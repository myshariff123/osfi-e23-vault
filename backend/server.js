require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const { Pool }  = require('pg');
const multer    = require('multer');
const AWS       = require('aws-sdk');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const rateLimit = require('express-rate-limit');
const path      = require('path');

process.on('uncaughtException', (err) => console.error('[CRITICAL]', err.message));

// ── DB ────────────────────────────────────────────────────────────────────────
const pool = new Pool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'clearmrm',
  port:     5432,
  ssl:      { rejectUnauthorized: false },
  max:      10,
});

// ── AWS ───────────────────────────────────────────────────────────────────────
const _bedrockRT = new AWS.BedrockRuntime({ region: 'ca-central-1' });
const cognito    = new AWS.CognitoIdentityServiceProvider({ region: 'ca-central-1' });

async function callBedrock(params, maxRetries) {
  if (!maxRetries) maxRetries = 3;
  const modelId = params.model || 'anthropic.claude-3-haiku-20240307-v1:0';
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const body = JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens:  params.max_tokens || 1024,
        messages:    params.messages,
        system:      params.system,
        temperature: params.temperature || 0.3,
      });
      const resp = await _bedrockRT.invokeModel({ modelId, contentType:'application/json', accept:'application/json', body }).promise();
      const parsed = JSON.parse(resp.body.toString('utf8'));
      return { content: [{ text: parsed.content[0].text }] };
    } catch (e) {
      if (attempt === maxRetries) throw e;
      await new Promise(r => setTimeout(r, 500 * attempt));
    }
  }
}

// Safe JSON extract from Bedrock response (handles markdown code fences)
function extractJSON(text) {
  const clean = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  return JSON.parse(clean);
}

// ── Express ───────────────────────────────────────────────────────────────────
const app    = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5*1024*1024 } });

app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const aiLimiter  = rateLimit({ windowMs:60000, max:30, standardHeaders:true, legacyHeaders:false });
const apiLimiter = rateLimit({ windowMs:60000, max:200, standardHeaders:true, legacyHeaders:false });
app.use('/api', apiLimiter);

// ── Auth ──────────────────────────────────────────────────────────────────────
async function requireAuth(req, res, next) {
  try {
    const auth = (req.headers.authorization||'').replace('Bearer ','');
    if (!auth) return res.status(401).json({ error:'No token' });
    const parts = auth.split('.');
    if (parts.length < 2) return res.status(401).json({ error:'Bad token' });
    const claims = JSON.parse(Buffer.from(parts[1],'base64url').toString('utf8'));
    const email  = claims.email || claims['cognito:username'] || '';
    if (!email) return res.status(401).json({ error:'No email in token' });
    const r = await pool.query('SELECT id,tenant_id,email,full_name,role FROM users WHERE email=$1',[email]);
    if (!r.rows.length) return res.status(403).json({ error:'User not provisioned in ClearMRM.' });
    req.user = r.rows[0];
    next();
  } catch(e) { console.error('[auth]',e.message); res.status(401).json({ error:'Authentication failed' }); }
}

// ── Audit ─────────────────────────────────────────────────────────────────────
async function audit(tenantId, modelId, actorEmail, eventType, meta) {
  if (!meta) meta = {};
  try {
    await pool.query(
      'INSERT INTO audit_events(tenant_id,model_id,actor_email,event_type,field_changed,old_value,new_value,metadata,ip_address) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [tenantId,modelId||null,actorEmail,eventType,meta.field||null,meta.old||null,meta.new||null,
       meta.metadata ? JSON.stringify(meta.metadata) : null, meta.ip||null]
    );
  } catch(e) { console.error('[audit]',e.message); }
}

// ── Risk scoring ──────────────────────────────────────────────────────────────
function computeRiskTier(a) {
  const fiMap = {under_100k:1,'100k_1m':2,'1m_10m':3,over_10m:4};
  const cxMap = {rule_based:1,statistical:2,ml:3,deep_learning:3};
  const dvMap = {under_100:1,'100_to_10k':2,over_10k:3};
  const lvMap = {within_1yr:0,'1_to_3yr':1,over_3yr:2,never:3};
  const dqMap = {excellent:0,good:1,acceptable:2,poor:3};
  const bd = {
    financial_impact: fiMap[a.q_financial_impact]||0,
    complexity:       cxMap[a.q_complexity]||0,
    regulatory_use:   a.q_regulatory_use ? 3 : 0,
    decision_volume:  dvMap[a.q_decision_volume]||0,
    last_validated:   lvMap[a.q_last_validated]||0,
    data_quality:     dqMap[a.q_data_quality]||0,
    vendor:           a.q_is_vendor ? 2 : 0,
    multi_bu:         a.q_multi_business_unit ? 1 : 0,
  };
  const score = Object.values(bd).reduce(function(s,v){ return s+v; },0);
  let tier = score >= 11 ? 1 : score >= 6 ? 2 : 3;
  if (a.q_regulatory_use || a.q_last_validated === 'never') tier = 1;
  return { tier, score, breakdown: bd };
}

function nextValidationDue(tier) {
  const d = new Date();
  d.setFullYear(d.getFullYear() + tier);
  return d.toISOString().split('T')[0];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/api/health', function(req, res) {
  res.json({ status:'ok', service:'ClearMRM', region:'ca-central-1', ts:new Date() });
});

// ── Auth / Login ──────────────────────────────────────────────────────────────
app.post('/api/auth/login', async function(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error:'Email and password required' });
    const result = await cognito.initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: { USERNAME:email, PASSWORD:password },
    }).promise();
    if (result.ChallengeName === 'NEW_PASSWORD_REQUIRED')
      return res.status(403).json({ error:'Password change required. Contact your administrator.' });
    const r = await pool.query('SELECT id FROM users WHERE email=$1',[email]);
    if (!r.rows.length) return res.status(403).json({ error:'User not provisioned in ClearMRM. Contact your administrator.' });
    res.json({ token: result.AuthenticationResult.IdToken });
  } catch(e) {
    if (e.code==='NotAuthorizedException') return res.status(401).json({ error:'Incorrect email or password.' });
    if (e.code==='UserNotFoundException')  return res.status(401).json({ error:'No account found with this email.' });
    if (e.code==='UserNotConfirmedException') return res.status(401).json({ error:'Account not confirmed. Check your email.' });
    console.error('[login]',e.code,e.message);
    res.status(500).json({ error:'Login failed. Please try again.' });
  }
});

// ── Me ────────────────────────────────────────────────────────────────────────
app.get('/api/me', requireAuth, async function(req, res) {
  try {
    const t = await pool.query('SELECT id,name FROM tenants WHERE id=$1',[req.user.tenant_id]);
    res.json({ user:req.user, tenant:t.rows[0]||null });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ── Dashboard ─────────────────────────────────────────────────────────────────
app.get('/api/dashboard', requireAuth, async function(req, res) {
  try {
    const tid = req.user.tenant_id;
    const [totals,overdue,unrated,recent,valPending] = await Promise.all([
      pool.query("SELECT risk_tier,COUNT(*) c FROM models WHERE tenant_id=$1 AND status='active' GROUP BY risk_tier",[tid]),
      pool.query("SELECT COUNT(*) c FROM models WHERE tenant_id=$1 AND status='active' AND next_validation_due < NOW()",[tid]),
      pool.query("SELECT COUNT(*) c FROM models WHERE tenant_id=$1 AND status='active' AND risk_tier IS NULL",[tid]),
      pool.query("SELECT id,name,risk_tier,status,next_validation_due,updated_at FROM models WHERE tenant_id=$1 AND status='active' ORDER BY updated_at DESC LIMIT 5",[tid]),
      pool.query("SELECT COUNT(*) c FROM validations WHERE tenant_id=$1 AND status NOT IN ('approved','closed')",[tid]),
    ]);
    const byTier = {1:0,2:0,3:0};
    totals.rows.forEach(function(r){ byTier[r.risk_tier]=parseInt(r.c); });
    res.json({
      total:   (byTier[1]||0)+(byTier[2]||0)+(byTier[3]||0)+parseInt(unrated.rows[0].c),
      tier1:   byTier[1]||0, tier2:byTier[2]||0, tier3:byTier[3]||0,
      unrated: parseInt(unrated.rows[0].c),
      overdue: parseInt(overdue.rows[0].c),
      val_pending: parseInt(valPending.rows[0].c),
      recent:  recent.rows,
    });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ── AI: Dashboard Intelligence Briefing ───────────────────────────────────────
app.get('/api/ai/dashboard-insight', aiLimiter, requireAuth, async function(req, res) {
  try {
    const tid = req.user.tenant_id;
    const [tiers, overdueModels, unrated, valPending] = await Promise.all([
      pool.query("SELECT risk_tier,COUNT(*) c FROM models WHERE tenant_id=$1 AND status='active' GROUP BY risk_tier",[tid]),
      pool.query("SELECT name,business_unit,methodology_type,next_validation_due FROM models WHERE tenant_id=$1 AND status='active' AND next_validation_due < NOW() ORDER BY next_validation_due ASC LIMIT 5",[tid]),
      pool.query("SELECT COUNT(*) c FROM models WHERE tenant_id=$1 AND status='active' AND risk_tier IS NULL",[tid]),
      pool.query("SELECT COUNT(*) c FROM validations WHERE tenant_id=$1 AND status NOT IN ('approved','closed')",[tid]),
    ]);
    const byTier = {1:0,2:0,3:0};
    tiers.rows.forEach(function(r){ byTier[r.risk_tier]=parseInt(r.c); });
    const total = (byTier[1]||0)+(byTier[2]||0)+(byTier[3]||0)+parseInt(unrated.rows[0].c);
    const overdueList = overdueModels.rows.map(function(m){ return m.name+' ('+m.business_unit+')'; }).join(', ');

    const aiResp = await callBedrock({
      model: 'anthropic.claude-3-haiku-20240307-v1:0',
      max_tokens: 200, temperature: 0.3,
      messages: [{ role:'user', content:
        'You are an OSFI E-23 model risk expert giving a morning compliance briefing to a Chief Risk Officer.\n\n'+
        'Current inventory: '+total+' active models. Tier 1 (High Risk): '+(byTier[1]||0)+'. Tier 2: '+(byTier[2]||0)+'. Tier 3: '+(byTier[3]||0)+'. Unrated: '+unrated.rows[0].c+'. Overdue for validation: '+overdueModels.rows.length+(overdueList ? ' ('+overdueList+')' : '')+'. Open validation workflows: '+valPending.rows[0].c+'.\n\n'+
        'Write exactly 2 sentences for a CRO dashboard. Sentence 1: overall compliance posture with specific numbers. Sentence 2: the single most urgent action. Reference OSFI E-23 section numbers. Be direct and specific.'
      }]
    });
    res.json({ insight: aiResp.content[0].text.trim(), generated_at: new Date() });
  } catch(e) { console.error('[dashboard-insight]',e.message); res.status(500).json({ error:e.message }); }
});

// ── AI: Smart Fill (suggest model fields from name) ───────────────────────────
app.post('/api/ai/suggest-model-fields', aiLimiter, requireAuth, async function(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error:'Model name required' });
    const aiResp = await callBedrock({
      model: 'anthropic.claude-3-haiku-20240307-v1:0',
      max_tokens: 500, temperature: 0.2,
      messages: [{ role:'user', content:
        'You are an OSFI E-23 model risk classification expert at a Canadian financial institution.\n\n'+
        'A model named "'+name+'" is being registered.'+(description ? ' Additional context: '+description : '')+'\n\n'+
        'Return ONLY valid JSON with no markdown:\n'+
        '{"methodology_type":"one of: rule_based, statistical, ml, deep_learning, other","purpose":"2 sentence description of what this model does","business_unit":"most likely business unit","input_data_sources":"typical data inputs","osfi_e23_considerations":"1 sentence on key OSFI E-23 risk factors for this model type","is_third_party_likely":false,"tier_indication":"Tier 1/2/3 with 1 sentence reason"}'
      }]
    });
    res.json(extractJSON(aiResp.content[0].text));
  } catch(e) { console.error('[suggest-fields]',e.message); res.status(500).json({ error:e.message }); }
});

// ── AI: Remediation Advisor ───────────────────────────────────────────────────
app.post('/api/models/:id/ai-advice', aiLimiter, requireAuth, async function(req, res) {
  try {
    const [mRes, ratingRes] = await Promise.all([
      pool.query('SELECT * FROM models WHERE id=$1 AND tenant_id=$2',[req.params.id,req.user.tenant_id]),
      pool.query('SELECT * FROM risk_ratings WHERE model_id=$1 ORDER BY created_at DESC LIMIT 1',[req.params.id]),
    ]);
    if (!mRes.rows.length) return res.status(404).json({ error:'Not found' });
    const m = mRes.rows[0];
    const isOverdue = m.next_validation_due && new Date(m.next_validation_due) < new Date();
    const overdueDays = isOverdue ? Math.round((new Date()-new Date(m.next_validation_due))/86400000) : 0;

    const aiResp = await callBedrock({
      model: 'anthropic.claude-3-sonnet-20240229-v1:0',
      max_tokens: 700, temperature: 0.2,
      messages: [{ role:'user', content:
        'You are an OSFI E-23 model risk compliance advisor at a Canadian federally regulated financial institution.\n\n'+
        'Model: "'+m.name+'"\nBusiness Unit: '+(m.business_unit||'Unknown')+'\nMethodology: '+(m.methodology_type||'Unknown')+'\nPurpose: '+(m.purpose||'Not specified')+'\nRisk Tier: '+(m.risk_tier ? 'Tier '+m.risk_tier : 'UNRATED')+'\nVendor: '+(m.is_third_party ? 'Yes - '+(m.vendor_name||'unknown') : 'No')+'\nLast Validated: '+(m.last_validated_at ? new Date(m.last_validated_at).toLocaleDateString('en-CA') : 'Never')+'\nValidation Status: '+(isOverdue ? 'OVERDUE by '+overdueDays+' days' : 'Current')+(ratingRes.rows.length ? '\nLatest Risk Reasoning: '+ratingRes.rows[0].ai_reasoning : '')+'\n\n'+
        'Return ONLY valid JSON:\n'+
        '{"priority":"critical|high|medium|low","executive_summary":"2 sentences on current OSFI E-23 compliance posture","immediate_actions":["action with §reference","action 2","action 3"],"osfi_e23_gaps":["gap 1","gap 2"],"validation_scope":"what the next independent validation should cover","estimated_effort":"e.g. 3-4 weeks with internal model validation team"}'
      }]
    });
    const advice = extractJSON(aiResp.content[0].text);
    await audit(req.user.tenant_id,req.params.id,req.user.email,'ai_advice_generated',{ip:req.ip});
    res.json(advice);
  } catch(e) { console.error('[ai-advice]',e.message); res.status(500).json({ error:e.message }); }
});

// ── Models CRUD ───────────────────────────────────────────────────────────────
app.get('/api/models', requireAuth, async function(req, res) {
  try {
    const tier=req.query.tier, status=req.query.status||'active', search=req.query.search;
    let q='SELECT * FROM models WHERE tenant_id=$1 AND status=$2';
    const p=[req.user.tenant_id,status];
    if (tier) { q+=' AND risk_tier=$'+(p.length+1); p.push(parseInt(tier)); }
    if (search) { const i=p.length+1; q+=' AND (LOWER(name) LIKE $'+i+' OR LOWER(business_unit) LIKE $'+i+')'; p.push('%'+search.toLowerCase()+'%'); }
    q+=' ORDER BY updated_at DESC LIMIT 500';
    res.json((await pool.query(q,p)).rows);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

app.post('/api/models', requireAuth, async function(req, res) {
  try {
    const b=req.body;
    const r=await pool.query(
      'INSERT INTO models(tenant_id,name,version,description,purpose,business_unit,model_owner_name,model_owner_email,methodology_type,input_data_sources,production_system,deployed_at,is_third_party,vendor_name,vendor_product,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *',
      [req.user.tenant_id,b.name,b.version||'1.0',b.description,b.purpose,b.business_unit,b.model_owner_name,b.model_owner_email,b.methodology_type||'other',b.input_data_sources,b.production_system,b.deployed_at||null,b.is_third_party||false,b.vendor_name||null,b.vendor_product||null,'active']
    );
    await audit(req.user.tenant_id,r.rows[0].id,req.user.email,'model_created',{metadata:{name:r.rows[0].name},ip:req.ip});
    res.status(201).json(r.rows[0]);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

app.get('/api/models/:id', requireAuth, async function(req, res) {
  try {
    const [m,ratings,validations] = await Promise.all([
      pool.query('SELECT * FROM models WHERE id=$1 AND tenant_id=$2',[req.params.id,req.user.tenant_id]),
      pool.query('SELECT * FROM risk_ratings WHERE model_id=$1 ORDER BY created_at DESC',[req.params.id]),
      pool.query('SELECT * FROM validations WHERE model_id=$1 ORDER BY created_at DESC LIMIT 10',[req.params.id]),
    ]);
    if (!m.rows.length) return res.status(404).json({ error:'Not found' });
    res.json(Object.assign({},m.rows[0],{ratings:ratings.rows,validations:validations.rows}));
  } catch(e) { res.status(500).json({ error:e.message }); }
});

app.put('/api/models/:id', requireAuth, async function(req, res) {
  try {
    const b=req.body;
    const prev=await pool.query('SELECT * FROM models WHERE id=$1 AND tenant_id=$2',[req.params.id,req.user.tenant_id]);
    if (!prev.rows.length) return res.status(404).json({ error:'Not found' });
    const r=await pool.query(
      'UPDATE models SET name=$1,version=$2,description=$3,purpose=$4,business_unit=$5,model_owner_name=$6,model_owner_email=$7,methodology_type=$8,input_data_sources=$9,production_system=$10,deployed_at=$11,is_third_party=$12,vendor_name=$13,vendor_product=$14 WHERE id=$15 AND tenant_id=$16 RETURNING *',
      [b.name,b.version,b.description,b.purpose,b.business_unit,b.model_owner_name,b.model_owner_email,b.methodology_type,b.input_data_sources,b.production_system,b.deployed_at||null,b.is_third_party||false,b.vendor_name||null,b.vendor_product||null,req.params.id,req.user.tenant_id]
    );
    await audit(req.user.tenant_id,req.params.id,req.user.email,'model_updated',{metadata:{fields_changed:Object.keys(b)},ip:req.ip});
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

app.delete('/api/models/:id', requireAuth, async function(req, res) {
  try {
    await pool.query("UPDATE models SET status='archived' WHERE id=$1 AND tenant_id=$2",[req.params.id,req.user.tenant_id]);
    await audit(req.user.tenant_id,req.params.id,req.user.email,'model_archived',{ip:req.ip});
    res.json({ ok:true });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

app.post('/api/models/:id/validate', requireAuth, async function(req, res) {
  try {
    const m=await pool.query('SELECT * FROM models WHERE id=$1 AND tenant_id=$2',[req.params.id,req.user.tenant_id]);
    if (!m.rows.length) return res.status(404).json({ error:'Not found' });
    const tier=m.rows[0].risk_tier||3;
    const today=new Date().toISOString().split('T')[0];
    const nextDue=nextValidationDue(tier);
    const r=await pool.query('UPDATE models SET last_validated_at=$1,next_validation_due=$2 WHERE id=$3 RETURNING *',[today,nextDue,req.params.id]);
    await audit(req.user.tenant_id,req.params.id,req.user.email,'model_validated',{field:'last_validated_at',new:today,metadata:{next_due:nextDue},ip:req.ip});
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ── Risk Rating ───────────────────────────────────────────────────────────────
app.post('/api/models/:id/rate', aiLimiter, requireAuth, async function(req, res) {
  try {
    const m=await pool.query('SELECT * FROM models WHERE id=$1 AND tenant_id=$2',[req.params.id,req.user.tenant_id]);
    if (!m.rows.length) return res.status(404).json({ error:'Not found' });
    const model=m.rows[0], answers=req.body;
    const {tier,score,breakdown}=computeRiskTier(answers);
    let reasoning='Tier '+tier+' assigned based on risk score of '+score+'/20.';
    try {
      const aiResp=await callBedrock({
        model:'anthropic.claude-3-haiku-20240307-v1:0', max_tokens:300, temperature:0.2,
        messages:[{role:'user',content:
          'Model: "'+model.name+'" ('+( model.methodology_type||'unknown')+').\nAnswers: financial_impact='+answers.q_financial_impact+', complexity='+answers.q_complexity+', regulatory='+answers.q_regulatory_use+', decisions='+answers.q_decision_volume+', last_validated='+answers.q_last_validated+', data_quality='+answers.q_data_quality+', vendor='+answers.q_is_vendor+', multi_bu='+answers.q_multi_business_unit+'.\nScore: '+score+'/20. Tier: '+tier+'.\nWrite exactly 3 sentences explaining Tier '+tier+' assignment per OSFI E-23. Reference specific risk criteria. Plain English for a board director.'
        }]
      });
      reasoning=aiResp.content[0].text.trim();
    } catch(e) { console.error('[bedrock reasoning]',e.message); }
    const rr=await pool.query(
      'INSERT INTO risk_ratings(tenant_id,model_id,rated_by_email,q_financial_impact,q_complexity,q_regulatory_use,q_decision_volume,q_last_validated,q_data_quality,q_is_vendor,q_multi_business_unit,computed_tier,score_total,score_breakdown,ai_reasoning) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *',
      [req.user.tenant_id,req.params.id,req.user.email,answers.q_financial_impact,answers.q_complexity,answers.q_regulatory_use||false,answers.q_decision_volume,answers.q_last_validated,answers.q_data_quality,answers.q_is_vendor||false,answers.q_multi_business_unit||false,tier,score,JSON.stringify(breakdown),reasoning]
    );
    const nextDue=nextValidationDue(tier);
    await pool.query('UPDATE models SET risk_tier=$1,next_validation_due=$2 WHERE id=$3',[tier,nextDue,req.params.id]);
    await audit(req.user.tenant_id,req.params.id,req.user.email,'model_rated',{field:'risk_tier',new:'Tier '+tier,metadata:{score,tier},ip:req.ip});
    res.json(Object.assign({},rr.rows[0],{next_validation_due:nextDue}));
  } catch(e) { console.error('[rate]',e); res.status(500).json({ error:e.message }); }
});

// ── CSV Import ────────────────────────────────────────────────────────────────
app.post('/api/models/import', requireAuth, upload.single('csv'), async function(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error:'No file uploaded' });
    const lines=req.file.buffer.toString('utf8').split('\n').filter(function(l){ return l.trim(); });
    if (lines.length < 2) return res.status(400).json({ error:'CSV must have header + data rows' });
    const headers=lines[0].split(',').map(function(h){ return h.trim().toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,''); });
    let imported=0, skipped=0;
    for (let i=1;i<lines.length;i++) {
      try {
        const vals=lines[i].split(',').map(function(v){ return v.trim().replace(/^"|"$/g,''); });
        const row={};
        headers.forEach(function(h,idx){ row[h]=vals[idx]||''; });
        if (!row.name && !row.model_name) { skipped++; continue; }
        await pool.query(
          'INSERT INTO models(tenant_id,name,description,business_unit,model_owner_name,model_owner_email,methodology_type,production_system,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',
          [req.user.tenant_id,row.name||row.model_name||('Imported Model '+i),row.description||row.purpose||null,row.business_unit||row.department||null,row.model_owner||row.owner_name||null,row.owner_email||row.model_owner_email||null,row.methodology||row.model_type||row.methodology_type||'other',row.system||row.production_system||null,'active']
        );
        imported++;
      } catch(err) { skipped++; }
    }
    await audit(req.user.tenant_id,null,req.user.email,'csv_imported',{metadata:{imported,skipped},ip:req.ip});
    res.json({ imported, skipped });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ── Audit Trail ───────────────────────────────────────────────────────────────
app.get('/api/audit', requireAuth, async function(req, res) {
  try {
    const {model_id}=req.query;
    const limit=parseInt(req.query.limit)||100, offset=parseInt(req.query.offset)||0;
    let q='SELECT * FROM audit_events WHERE tenant_id=$1';
    const p=[req.user.tenant_id];
    if (model_id) { q+=' AND model_id=$'+(p.length+1); p.push(model_id); }
    q+=' ORDER BY created_at DESC LIMIT $'+(p.length+1)+' OFFSET $'+(p.length+2);
    p.push(limit,offset);
    res.json((await pool.query(q,p)).rows);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 2 — VALIDATION WORKFLOW
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/validations', requireAuth, async function(req, res) {
  try {
    const {model_id, status}=req.query;
    let q='SELECT v.*,m.name AS model_name,m.risk_tier,m.business_unit FROM validations v JOIN models m ON v.model_id=m.id WHERE v.tenant_id=$1';
    const p=[req.user.tenant_id];
    if (model_id) { q+=' AND v.model_id=$'+(p.length+1); p.push(model_id); }
    if (status) { q+=' AND v.status=$'+(p.length+1); p.push(status); }
    q+=' ORDER BY v.created_at DESC LIMIT 200';
    res.json((await pool.query(q,p)).rows);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

app.post('/api/validations', aiLimiter, requireAuth, async function(req, res) {
  try {
    const b=req.body;
    if (!b.model_id) return res.status(400).json({ error:'model_id required' });
    const mRes=await pool.query('SELECT * FROM models WHERE id=$1 AND tenant_id=$2',[b.model_id,req.user.tenant_id]);
    if (!mRes.rows.length) return res.status(404).json({ error:'Model not found' });
    const m=mRes.rows[0];

    // AI pre-assessment
    let aiPreAssessment=null;
    try {
      const aiResp=await callBedrock({
        model:'anthropic.claude-3-haiku-20240307-v1:0', max_tokens:350, temperature:0.2,
        messages:[{role:'user',content:
          'You are an OSFI E-23 independent validator scoping a model validation engagement.\n\n'+
          'Model: "'+m.name+'"\nTier: '+(m.risk_tier ? 'Tier '+m.risk_tier : 'Unrated')+'\nMethodology: '+(m.methodology_type||'unknown')+'\nPurpose: '+(m.purpose||'unspecified')+'\nVendor: '+(m.is_third_party ? 'Yes - '+(m.vendor_name||'unknown') : 'No')+'\nValidation type requested: '+(b.validation_type||'full')+'\nScope provided: '+(b.scope||'none')+'\n\n'+
          'Write a 3-sentence validation pre-assessment covering: (1) recommended validation approach per OSFI E-23, (2) key risk areas to focus on, (3) estimated timeline and resource needs. Be specific and actionable.'
        }]
      });
      aiPreAssessment=aiResp.content[0].text.trim();
    } catch(e) { console.error('[val pre-assessment]',e.message); }

    const r=await pool.query(
      'INSERT INTO validations(tenant_id,model_id,status,validation_type,scope,requested_by_email,due_date,ai_pre_assessment) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [req.user.tenant_id,b.model_id,'requested',b.validation_type||'full',b.scope||null,req.user.email,b.due_date||null,aiPreAssessment]
    );
    await audit(req.user.tenant_id,b.model_id,req.user.email,'validation_requested',{metadata:{validation_id:r.rows[0].id},ip:req.ip});
    res.status(201).json(r.rows[0]);
  } catch(e) { console.error('[create validation]',e); res.status(500).json({ error:e.message }); }
});

app.get('/api/validations/:id', requireAuth, async function(req, res) {
  try {
    const r=await pool.query('SELECT v.*,m.name AS model_name,m.risk_tier,m.business_unit,m.methodology_type FROM validations v JOIN models m ON v.model_id=m.id WHERE v.id=$1 AND v.tenant_id=$2',[req.params.id,req.user.tenant_id]);
    if (!r.rows.length) return res.status(404).json({ error:'Not found' });
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// State machine: assign | start | submit | approve | close
app.put('/api/validations/:id', requireAuth, async function(req, res) {
  try {
    const {action}=req.body;
    const cur=await pool.query('SELECT * FROM validations WHERE id=$1 AND tenant_id=$2',[req.params.id,req.user.tenant_id]);
    if (!cur.rows.length) return res.status(404).json({ error:'Not found' });
    const v=cur.rows[0];
    let updates={}, newStatus=v.status, eventType='validation_updated';

    if (action==='assign') {
      if (!req.body.assigned_to_email) return res.status(400).json({ error:'assigned_to_email required' });
      updates={status:'assigned',assigned_to_email:req.body.assigned_to_email,assigned_at:'NOW()'};
      newStatus='assigned'; eventType='validation_assigned';
    } else if (action==='start') {
      updates={status:'in_progress',started_at:'NOW()'};
      newStatus='in_progress'; eventType='validation_started';
    } else if (action==='submit') {
      if (!req.body.findings || !req.body.outcome) return res.status(400).json({ error:'findings and outcome required' });
      if (!['pass','conditional_pass','fail'].includes(req.body.outcome)) return res.status(400).json({ error:'outcome must be pass, conditional_pass, or fail' });
      updates={status:'findings_submitted',findings:req.body.findings,outcome:req.body.outcome,conditions:req.body.conditions||null};
      newStatus='findings_submitted'; eventType='validation_findings_submitted';
    } else if (action==='approve') {
      updates={status:'approved',approved_by_email:req.user.email,approved_at:'NOW()'};
      newStatus='approved'; eventType='validation_approved';
      // Update model's last_validated_at
      const today=new Date().toISOString().split('T')[0];
      const mRes=await pool.query('SELECT risk_tier FROM models WHERE id=$1',[v.model_id]);
      const tier=(mRes.rows[0]&&mRes.rows[0].risk_tier)||3;
      const nextDue=nextValidationDue(tier);
      await pool.query('UPDATE models SET last_validated_at=$1,next_validation_due=$2 WHERE id=$3',[today,nextDue,v.model_id]);
    } else if (action==='close') {
      updates={status:'closed'};
      newStatus='closed'; eventType='validation_closed';
    } else {
      return res.status(400).json({ error:'Invalid action. Use: assign|start|submit|approve|close' });
    }

    // Build update query dynamically (skip NOW() values — they need literal SQL)
    const setClauses=[], params=[req.params.id];
    Object.keys(updates).forEach(function(k){
      if (updates[k]==='NOW()') {
        setClauses.push(k+'=NOW()');
      } else {
        params.push(updates[k]);
        setClauses.push(k+'=$'+params.length);
      }
    });
    const r=await pool.query('UPDATE validations SET '+setClauses.join(',')+' WHERE id=$1 RETURNING *',params);
    await audit(req.user.tenant_id,v.model_id,req.user.email,eventType,{metadata:{validation_id:req.params.id,action,new_status:newStatus},ip:req.ip});
    res.json(r.rows[0]);
  } catch(e) { console.error('[validation update]',e); res.status(500).json({ error:e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 2 — VENDOR ASSESSMENT
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/vendor-assessments', requireAuth, async function(req, res) {
  try {
    const {model_id}=req.query;
    let q='SELECT va.*,m.name AS model_name,m.vendor_name,m.vendor_product FROM vendor_assessments va JOIN models m ON va.model_id=m.id WHERE va.tenant_id=$1';
    const p=[req.user.tenant_id];
    if (model_id) { q+=' AND va.model_id=$2'; p.push(model_id); }
    q+=' ORDER BY va.created_at DESC LIMIT 100';
    res.json((await pool.query(q,p)).rows);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

app.post('/api/vendor-assessments', aiLimiter, requireAuth, async function(req, res) {
  try {
    const b=req.body;
    const mRes=await pool.query('SELECT * FROM models WHERE id=$1 AND tenant_id=$2 AND is_third_party=TRUE',[b.model_id,req.user.tenant_id]);
    if (!mRes.rows.length) return res.status(404).json({ error:'Vendor model not found' });
    const m=mRes.rows[0];

    // Score: each TRUE answer reduces risk
    const positives=['q_sla_documented','q_data_access','q_audit_rights','q_exit_plan','q_model_doc_received','q_override_capability'];
    const negatives=['q_concentration_risk'];
    let score=0;
    positives.forEach(function(k){ if (b[k]) score+=2; });
    negatives.forEach(function(k){ if (b[k]) score-=2; });
    const riskLevel = score >= 10 ? 'low' : score >= 5 ? 'medium' : 'high';
    const nextReview=new Date(); nextReview.setFullYear(nextReview.getFullYear()+1);

    let aiAssessment=null;
    try {
      const aiResp=await callBedrock({
        model:'anthropic.claude-3-haiku-20240307-v1:0', max_tokens:300, temperature:0.2,
        messages:[{role:'user',content:
          'You are an OSFI E-23 third-party model risk expert. Assess this vendor model per OSFI E-23 §5 (Third-Party Model Risk).\n\n'+
          'Model: "'+m.name+'" from vendor '+( m.vendor_name||'unknown')+' ('+( m.vendor_product||'unknown')+')\n'+
          'SLA documented: '+b.q_sla_documented+'\nData access rights: '+b.q_data_access+'\nAudit rights: '+b.q_audit_rights+'\nExit plan: '+b.q_exit_plan+'\nConcentration risk: '+b.q_concentration_risk+'\nModel documentation received: '+b.q_model_doc_received+'\nOverride capability: '+b.q_override_capability+'\nOverall risk score: '+score+'/12 ('+riskLevel+' risk)\n\n'+
          'Write 3 sentences: (1) overall vendor governance posture per OSFI E-23 §5, (2) most critical gap, (3) recommended action with timeline.'
        }]
      });
      aiAssessment=aiResp.content[0].text.trim();
    } catch(e) { console.error('[vendor assessment AI]',e.message); }

    const r=await pool.query(
      'INSERT INTO vendor_assessments(tenant_id,model_id,assessed_by_email,q_sla_documented,q_data_access,q_audit_rights,q_exit_plan,q_concentration_risk,q_model_doc_received,q_override_capability,risk_score,risk_level,findings,ai_assessment,next_review_due) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *',
      [req.user.tenant_id,b.model_id,req.user.email,b.q_sla_documented||false,b.q_data_access||false,b.q_audit_rights||false,b.q_exit_plan||false,b.q_concentration_risk||false,b.q_model_doc_received||false,b.q_override_capability||false,score,riskLevel,b.findings||null,aiAssessment,nextReview.toISOString().split('T')[0]]
    );
    await audit(req.user.tenant_id,b.model_id,req.user.email,'vendor_assessed',{metadata:{risk_level:riskLevel,score},ip:req.ip});
    res.status(201).json(r.rows[0]);
  } catch(e) { console.error('[vendor assessment]',e); res.status(500).json({ error:e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// BOARD REPORT PDF (with AI executive summary)
// ═══════════════════════════════════════════════════════════════════════════════

app.post('/api/reports/board-pack', aiLimiter, requireAuth, async function(req, res) {
  try {
    const tid=req.user.tenant_id;
    const [tenant,models,overdue,valPending] = await Promise.all([
      pool.query('SELECT name FROM tenants WHERE id=$1',[tid]),
      pool.query("SELECT * FROM models WHERE tenant_id=$1 AND status='active' ORDER BY risk_tier NULLS LAST,name",[tid]),
      pool.query("SELECT COUNT(*) c FROM models WHERE tenant_id=$1 AND status='active' AND next_validation_due < NOW()",[tid]),
      pool.query("SELECT COUNT(*) c FROM validations WHERE tenant_id=$1 AND status NOT IN ('approved','closed')",[tid]),
    ]);
    const institutionName=(tenant.rows[0]&&tenant.rows[0].name)||'Institution';
    const ms=models.rows;
    const t1=ms.filter(function(m){ return m.risk_tier===1; });
    const t2=ms.filter(function(m){ return m.risk_tier===2; });
    const t3=ms.filter(function(m){ return m.risk_tier===3; });
    const unr=ms.filter(function(m){ return !m.risk_tier; });
    const overdueCount=parseInt(overdue.rows[0].c);

    // AI Executive Summary
    let execSummary='Model risk management inventory as at '+new Date().toLocaleDateString('en-CA',{year:'numeric',month:'long'})+'. Total active models: '+ms.length+'.';
    try {
      const aiResp=await callBedrock({
        model:'anthropic.claude-3-sonnet-20240229-v1:0', max_tokens:300, temperature:0.3,
        messages:[{role:'user',content:
          'You are an OSFI E-23 model risk expert writing the executive summary for a Board Risk Committee report.\n\n'+
          'Institution: '+institutionName+'\nReport date: '+new Date().toLocaleDateString('en-CA',{year:'numeric',month:'long'})+'\nTotal models: '+ms.length+'. Tier 1: '+t1.length+'. Tier 2: '+t2.length+'. Tier 3: '+t3.length+'. Unrated: '+unr.length+'. Overdue: '+overdueCount+'. Open validation workflows: '+valPending.rows[0].c+'.\n\n'+
          'Write exactly 3 sentences for a Board Risk Committee executive summary: (1) overall model risk posture referencing OSFI E-23 effective date May 2027, (2) the most critical finding requiring board attention, (3) management recommendation. Formal, board-level language.'
        }]
      });
      execSummary=aiResp.content[0].text.trim();
    } catch(e) { console.error('[board exec summary]',e.message); }

    // Build PDF
    const pdf=await PDFDocument.create();
    const font=await pdf.embedFont(StandardFonts.Helvetica);
    const fontB=await pdf.embedFont(StandardFonts.HelveticaBold);
    const NAVY=rgb(0.04,0.18,0.38), RED=rgb(0.72,0.11,0.11), AMB=rgb(0.75,0.45,0.0);
    const GRN=rgb(0.10,0.55,0.20), GRY=rgb(0.5,0.5,0.5);
    const W=595.28, H=841.89, M=56;

    function newPage() {
      const pg=pdf.addPage([W,H]);
      pg.drawRectangle({x:0,y:H-48,width:W,height:48,color:NAVY});
      pg.drawText('ClearMRM',{x:M,y:H-30,size:14,font:fontB,color:rgb(1,1,1)});
      pg.drawText('OSFI E-23 Model Risk Management',{x:M+95,y:H-30,size:9,font,color:rgb(0.7,0.8,1)});
      pg.drawText(institutionName+'  |  Confidential',{x:W-M-155,y:H-30,size:8,font,color:rgb(0.7,0.8,1)});
      pg.drawLine({start:{x:M,y:16},end:{x:W-M,y:16},thickness:0.5,color:GRY});
      pg.drawText('Generated '+new Date().toLocaleDateString('en-CA',{year:'numeric',month:'long',day:'numeric'})+'  |  clearmrm.nimblestride.ca',{x:M,y:8,size:7,font,color:GRY});
      return pg;
    }
    function txt(pg,text,x,y,opts) {
      if (!opts) opts={};
      pg.drawText(String(text||''),{x,y,size:opts.size||9,font:opts.bold?fontB:font,color:opts.color||rgb(0.1,0.1,0.1),maxWidth:opts.maxW});
    }

    // Page 1 — Cover + AI Summary
    const p1=newPage();
    p1.drawRectangle({x:M,y:H-220,width:W-2*M,height:140,color:rgb(0.96,0.97,0.99)});
    txt(p1,'MODEL RISK MANAGEMENT',M+20,H-145,{size:17,bold:true,color:NAVY});
    txt(p1,'BOARD RISK COMMITTEE REPORT',M+20,H-167,{size:12,bold:true,color:NAVY});
    txt(p1,'Reporting Period: '+new Date().toLocaleDateString('en-CA',{year:'numeric',month:'long'}),M+20,H-187,{size:10,color:GRY});

    // KPI boxes
    const boxes=[{label:'TOTAL',val:ms.length,color:NAVY},{label:'TIER 1',val:t1.length,color:RED},{label:'TIER 2',val:t2.length,color:AMB},{label:'TIER 3',val:t3.length,color:GRN},{label:'OVERDUE',val:overdueCount,color:RED},{label:'UNRATED',val:unr.length,color:GRY}];
    const bw=(W-2*M-50)/6; let bx=M;
    boxes.forEach(function(b){
      p1.drawRectangle({x:bx,y:H-360,width:bw+6,height:80,color:rgb(0.97,0.97,0.99)});
      p1.drawRectangle({x:bx,y:H-280,width:bw+6,height:4,color:b.color});
      txt(p1,b.val,bx+8,H-335,{size:22,bold:true,color:b.color});
      txt(p1,b.label,bx+6,H-354,{size:7,bold:true,color:GRY});
      bx+=bw+8;
    });

    // AI Executive Summary box
    txt(p1,'EXECUTIVE SUMMARY (AI-GENERATED)',M,H-395,{size:9,bold:true,color:NAVY});
    p1.drawRectangle({x:M,y:H-460,width:W-2*M,height:58,color:rgb(0.97,0.98,1.0)});
    p1.drawRectangle({x:M,y:H-460,width:3,height:58,color:NAVY});
    // Wrap text manually (pdf-lib doesn't auto-wrap)
    const words=execSummary.split(' ');
    let line='', lineY=H-408, maxW=W-2*M-20;
    words.forEach(function(w){
      const test=line ? line+' '+w : w;
      if (test.length*4.5 > maxW && line) {
        txt(p1,line,M+10,lineY,{size:8});
        line=w; lineY-=12;
      } else { line=test; }
    });
    if (line) txt(p1,line,M+10,lineY,{size:8});

    // Compliance summary
    txt(p1,'OSFI E-23 COMPLIANCE SUMMARY',M,H-480,{size:9,bold:true,color:NAVY});
    p1.drawLine({start:{x:M,y:H-484},end:{x:W-M,y:H-484},thickness:0.5,color:rgb(0.85,0.85,0.9)});
    const rated=ms.length-unr.length;
    const pct=ms.length ? Math.round(rated/ms.length*100) : 0;
    [
      'Total models in inventory: '+ms.length,
      'Models with assigned risk tier: '+rated+' of '+ms.length+' ('+pct+'%)',
      'Tier 1 (High Risk) — annual validation required: '+t1.length,
      'Tier 2 (Medium Risk) — biennial validation required: '+t2.length,
      'Tier 3 (Standard Risk) — triennial validation required: '+t3.length,
      'Models overdue for independent validation: '+overdueCount,
      'Open validation workflows in progress: '+valPending.rows[0].c,
    ].forEach(function(l,i){ txt(p1,l,M+10,H-498-i*14,{size:8}); });
    txt(p1,'OSFI Guideline E-23 (September 2025) effective May 1, 2027. AI summary generated by Amazon Bedrock Claude (ca-central-1).',M,H-600,{size:7,color:GRY});

    // Page 2 — Model Inventory
    const p2=newPage();
    txt(p2,'MODEL INVENTORY',M,H-72,{size:12,bold:true,color:NAVY});
    p2.drawLine({start:{x:M,y:H-77},end:{x:W-M,y:H-77},thickness:0.5,color:NAVY});
    const cols=[{label:'Model Name',x:M,w:145},{label:'Business Unit',x:M+150,w:90},{label:'Type',x:M+245,w:65},{label:'Tier',x:M+315,w:30},{label:'Last Validated',x:M+350,w:80},{label:'Next Due',x:M+435,w:75}];
    cols.forEach(function(c){ txt(p2,c.label,c.x,H-93,{size:8,bold:true,color:NAVY}); });
    p2.drawLine({start:{x:M,y:H-97},end:{x:W-M,y:H-97},thickness:0.5,color:rgb(0.8,0.8,0.9)});
    let ry=H-112;
    ms.forEach(function(m,idx){
      if (ry<80) return;
      if (idx%2===0) p2.drawRectangle({x:M-2,y:ry-5,width:W-2*M+4,height:15,color:rgb(0.97,0.97,0.99)});
      const tc=m.risk_tier===1?RED:m.risk_tier===2?AMB:m.risk_tier===3?GRN:GRY;
      const isOD=m.next_validation_due&&new Date(m.next_validation_due)<new Date();
      txt(p2,(m.name||'').substring(0,24),M,ry,{size:8});
      txt(p2,(m.business_unit||'-').substring(0,16),M+150,ry,{size:8});
      txt(p2,(m.methodology_type||'-').substring(0,10),M+245,ry,{size:7,color:GRY});
      txt(p2,m.risk_tier?'T'+m.risk_tier:'-',M+315,ry,{size:8,bold:true,color:tc});
      txt(p2,m.last_validated_at?new Date(m.last_validated_at).toLocaleDateString('en-CA'):'Never',M+350,ry,{size:8});
      txt(p2,m.next_validation_due?new Date(m.next_validation_due).toLocaleDateString('en-CA'):'-',M+435,ry,{size:7,color:isOD?RED:rgb(0.1,0.1,0.1)});
      ry-=15;
    });

    // Page 3 — Tier 1 Detail
    if (t1.length>0) {
      const p3=newPage();
      txt(p3,'TIER 1 — HIGH RISK MODELS (Annual Validation Required)',M,H-72,{size:11,bold:true,color:RED});
      p3.drawLine({start:{x:M,y:H-77},end:{x:W-M,y:H-77},thickness:0.5,color:RED});
      let ty=H-100;
      t1.forEach(function(m){
        if (ty<100) return;
        p3.drawRectangle({x:M-4,y:ty-22,width:W-2*M+8,height:42,color:rgb(0.997,0.97,0.97)});
        p3.drawRectangle({x:M-4,y:ty-22,width:3,height:42,color:RED});
        txt(p3,m.name,M+8,ty,{size:10,bold:true});
        txt(p3,(m.business_unit||'-')+'  |  '+(m.methodology_type||'-')+'  |  Owner: '+(m.model_owner_name||'-'),M+8,ty-13,{size:8,color:GRY});
        const isOD=m.next_validation_due&&new Date(m.next_validation_due)<new Date();
        txt(p3,(m.last_validated_at?'Last validated: '+new Date(m.last_validated_at).toLocaleDateString('en-CA'):'Never validated')+'  |  Next due: '+(m.next_validation_due||'-')+(isOD?' OVERDUE':''),M+8,ty-25,{size:8,color:isOD?RED:AMB});
        ty-=54;
      });
    }

    await audit(tid,null,req.user.email,'report_generated',{metadata:{model_count:ms.length,tier1:t1.length},ip:req.ip});
    const pdfBytes=await pdf.save();
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition','attachment; filename="ClearMRM-Board-Report-'+new Date().toISOString().split('T')[0]+'.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch(e) { console.error('[board-report]',e); res.status(500).json({ error:e.message }); }
});

// ── SPA fallback ──────────────────────────────────────────────────────────────
app.get('/{*path}', function(req, res) {
  res.sendFile(path.join(__dirname,'public','index.html'));
});

const PORT=process.env.PORT||3001;
app.listen(PORT, function() {
  console.log('[ClearMRM] Port '+PORT+' | Bedrock ca-central-1 | DB: clearmrm | Phase 1+2');
});
