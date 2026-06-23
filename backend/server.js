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

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 2 AI ENHANCEMENTS — VALIDATION WORKFLOW
// ═══════════════════════════════════════════════════════════════════════════════

// AI: Analyze submitted findings against OSFI E-23
app.post('/api/validations/:id/ai-analyze', aiLimiter, requireAuth, async function(req, res) {
  try {
    const r = await pool.query(
      'SELECT v.*,m.name AS model_name,m.risk_tier,m.methodology_type,m.business_unit,m.purpose FROM validations v JOIN models m ON v.model_id=m.id WHERE v.id=$1 AND v.tenant_id=$2',
      [req.params.id, req.user.tenant_id]
    );
    if (!r.rows.length) return res.status(404).json({ error:'Not found' });
    const v = r.rows[0];
    if (!v.findings) return res.status(400).json({ error:'No findings submitted yet. Submit findings first.' });
    const aiResp = await callBedrock({
      model:'anthropic.claude-3-sonnet-20240229-v1:0', max_tokens:900, temperature:0.2,
      messages:[{role:'user',content:
        'You are a senior OSFI E-23 model risk examiner reviewing an independent model validation for a Canadian FRFI.\n\n'+
        'Model: "'+v.model_name+'" | Tier: '+(v.risk_tier||'unrated')+' | Methodology: '+(v.methodology_type||'unknown')+'\n'+
        'Business Unit: '+(v.business_unit||'unknown')+'\n'+
        'Validation type: '+v.validation_type+'\n'+
        'Scope: '+(v.scope||'not specified')+'\n'+
        'Findings submitted:\n'+v.findings+'\n'+
        'Outcome declared: '+(v.outcome||'not yet declared')+'\n'+
        'Conditions: '+(v.conditions||'none')+'\n\n'+
        'Return ONLY valid JSON:\n'+
        '{"severity":"critical|high|medium|low","osfi_sections_implicated":["§X.X: finding description"],"findings_completeness_score":0,"gaps_in_findings":["gap 1"],"recommended_conditions":["condition with §ref"],"remediation_timeline":"e.g. 30 days","approval_recommendation":"approve|conditional_approve|reject","approval_rationale":"2 sentences citing OSFI E-23"}'
      }]
    });
    const analysis = extractJSON(aiResp.content[0].text);
    await pool.query('UPDATE validations SET ai_findings_analysis=$1 WHERE id=$2',[JSON.stringify(analysis),req.params.id]);
    await audit(req.user.tenant_id,v.model_id,req.user.email,'validation_ai_analyzed',{ip:req.ip});
    res.json(analysis);
  } catch(e) { console.error('[val-ai-analyze]',e.message); res.status(500).json({ error:e.message }); }
});

// AI: Approval readiness check (completeness verification before approving)
app.post('/api/validations/:id/ai-approve-check', aiLimiter, requireAuth, async function(req, res) {
  try {
    const r = await pool.query(
      'SELECT v.*,m.name AS model_name,m.risk_tier,m.methodology_type FROM validations v JOIN models m ON v.model_id=m.id WHERE v.id=$1 AND v.tenant_id=$2',
      [req.params.id, req.user.tenant_id]
    );
    if (!r.rows.length) return res.status(404).json({ error:'Not found' });
    const v = r.rows[0];
    const aiResp = await callBedrock({
      model:'anthropic.claude-3-sonnet-20240229-v1:0', max_tokens:700, temperature:0.15,
      messages:[{role:'user',content:
        'You are an OSFI E-23 model risk governance officer conducting an approval completeness check on a validation before it can be formally approved.\n\n'+
        'Model: "'+v.model_name+'" | Tier: '+(v.risk_tier||'unrated')+' | Methodology: '+(v.methodology_type||'unknown')+'\n'+
        'Validation type: '+v.validation_type+'\n'+
        'Assigned validator: '+(v.assigned_to_email||'unknown')+'\n'+
        'Findings: '+(v.findings||'NONE')+'\n'+
        'Outcome: '+(v.outcome||'NONE')+'\n'+
        'Conditions imposed: '+(v.conditions||'none')+'\n'+
        'AI findings analysis performed: '+(v.ai_findings_analysis ? 'Yes — severity: '+JSON.parse(JSON.stringify(v.ai_findings_analysis)).severity : 'No')+'\n\n'+
        'OSFI E-23 requires: independent validator, documented scope, findings with §references, pass/fail outcome, conditions if conditional, approval by authorized senior officer.\n\n'+
        'Return ONLY valid JSON:\n'+
        '{"approval_ready":true,"completeness_score":0,"missing_documentation":["item 1"],"osfi_e23_requirements_met":["req 1"],"osfi_e23_requirements_missing":["req 1"],"recommendation":"1-2 sentences"}'
      }]
    });
    const check = extractJSON(aiResp.content[0].text);
    await pool.query('UPDATE validations SET ai_approval_check=$1 WHERE id=$2',[JSON.stringify(check),req.params.id]);
    res.json(check);
  } catch(e) { console.error('[val-approve-check]',e.message); res.status(500).json({ error:e.message }); }
});

// AI: Generate formal audit-grade closure summary
app.post('/api/validations/:id/ai-closure-summary', aiLimiter, requireAuth, async function(req, res) {
  try {
    const r = await pool.query(
      'SELECT v.*,m.name AS model_name,m.risk_tier,m.methodology_type,m.business_unit,m.next_validation_due FROM validations v JOIN models m ON v.model_id=m.id WHERE v.id=$1 AND v.tenant_id=$2',
      [req.params.id, req.user.tenant_id]
    );
    if (!r.rows.length) return res.status(404).json({ error:'Not found' });
    const v = r.rows[0];
    const aiResp = await callBedrock({
      model:'anthropic.claude-3-haiku-20240307-v1:0', max_tokens:350, temperature:0.2,
      messages:[{role:'user',content:
        'You are an OSFI E-23 model risk compliance officer writing the official closure narrative for a completed validation. This text will become part of the permanent audit record per OSFI E-23 §4.4.\n\n'+
        'Model: "'+v.model_name+'" | Tier: '+(v.risk_tier||'unrated')+' | BU: '+(v.business_unit||'unknown')+'\n'+
        'Validation type: '+v.validation_type+' | Outcome: '+(v.outcome||'unknown')+'\n'+
        'Assigned to: '+(v.assigned_to_email||'unknown')+' | Approved by: '+(v.approved_by_email||'unknown')+'\n'+
        'Findings: '+(v.findings||'none recorded')+'\n'+
        'Conditions imposed: '+(v.conditions||'none')+'\n'+
        'Next validation due: '+(v.next_validation_due||'not set')+'\n\n'+
        'Write exactly 3 sentences for the audit closure record: (1) validation scope, validator, and outcome per OSFI E-23 §4.3, (2) key finding and compliance status with specific §references, (3) next action or next validation due timeline. Formal, audit-grade language only.'
      }]
    });
    const summary = aiResp.content[0].text.trim();
    await pool.query('UPDATE validations SET ai_closure_summary=$1 WHERE id=$2',[summary,req.params.id]);
    await audit(req.user.tenant_id,v.model_id,req.user.email,'validation_closure_summary_generated',{ip:req.ip});
    res.json({ summary });
  } catch(e) { console.error('[val-closure]',e.message); res.status(500).json({ error:e.message }); }
});

// GET validation with AI fields included
app.get('/api/validations/:id/full', requireAuth, async function(req, res) {
  try {
    const r = await pool.query(
      'SELECT v.*,m.name AS model_name,m.risk_tier,m.business_unit,m.methodology_type FROM validations v JOIN models m ON v.model_id=m.id WHERE v.id=$1 AND v.tenant_id=$2',
      [req.params.id, req.user.tenant_id]
    );
    if (!r.rows.length) return res.status(404).json({ error:'Not found' });
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 2 AI ENHANCEMENTS — VENDOR ASSESSMENT
// ═══════════════════════════════════════════════════════════════════════════════

// AI: Full OSFI §5 deep-dive analysis with remediation plan and trend
app.post('/api/vendor-assessments/:id/ai-deepdive', aiLimiter, requireAuth, async function(req, res) {
  try {
    const r = await pool.query(
      'SELECT va.*,m.name AS model_name,m.vendor_name,m.vendor_product,m.methodology_type,m.business_unit,m.purpose FROM vendor_assessments va JOIN models m ON va.model_id=m.id WHERE va.id=$1 AND va.tenant_id=$2',
      [req.params.id, req.user.tenant_id]
    );
    if (!r.rows.length) return res.status(404).json({ error:'Not found' });
    const a = r.rows[0];
    const history = await pool.query(
      'SELECT risk_level,risk_score,created_at FROM vendor_assessments WHERE model_id=$1 ORDER BY created_at DESC LIMIT 4',
      [a.model_id]
    );
    const trend = history.rows.length >= 2
      ? (history.rows[0].risk_score > history.rows[1].risk_score ? 'improving' : history.rows[0].risk_score < history.rows[1].risk_score ? 'deteriorating' : 'stable')
      : 'first_assessment';
    const aiResp = await callBedrock({
      model:'anthropic.claude-3-sonnet-20240229-v1:0', max_tokens:1000, temperature:0.2,
      messages:[{role:'user',content:
        'You are an OSFI E-23 third-party model risk specialist. Conduct a deep-dive vendor governance analysis per OSFI E-23 §5 (Third-Party Model Risk Management).\n\n'+
        'Vendor: '+(a.vendor_name||'unknown')+' | Product: '+(a.vendor_product||'unknown')+'\n'+
        'Model: "'+a.model_name+'" ('+(a.methodology_type||'unknown')+')\n'+
        'Business Unit: '+(a.business_unit||'unknown')+'\n'+
        'Risk Level: '+a.risk_level+' (Score: '+a.risk_score+'/12)\n\n'+
        'OSFI E-23 §5 Checklist:\n'+
        '- SLA documented: '+a.q_sla_documented+'\n'+
        '- Data access rights: '+a.q_data_access+'\n'+
        '- Contractual audit rights: '+a.q_audit_rights+'\n'+
        '- Exit/transition plan: '+a.q_exit_plan+'\n'+
        '- Concentration risk assessed: '+a.q_concentration_risk+'\n'+
        '- Model documentation received: '+a.q_model_doc_received+'\n'+
        '- Override capability: '+a.q_override_capability+'\n\n'+
        'Assessor findings: '+(a.findings||'none')+'\n'+
        'Historical trend: '+trend+' | History: '+history.rows.map(function(h){ return h.risk_level+'('+new Date(h.created_at).toLocaleDateString('en-CA')+')'; }).join(' → ')+'\n\n'+
        'Return ONLY valid JSON:\n'+
        '{"osfi_section5_compliance_score":0,"critical_gaps":["gap with §ref"],"remediation_plan":[{"action":"...","owner":"CRO|Legal|IT|Procurement","timeline":"e.g. 30 days","osfi_ref":"§X.X"}],"concentration_risk_narrative":"2 sentences","regulatory_disclosure_required":false,"regulatory_disclosure_rationale":"1 sentence","trend":"'+trend+'","next_assessment_priority":"high|medium|low","next_assessment_rationale":"1 sentence"}'
      }]
    });
    const deepdive = extractJSON(aiResp.content[0].text);
    await pool.query('UPDATE vendor_assessments SET ai_deepdive=$1 WHERE id=$2',[JSON.stringify(deepdive),req.params.id]);
    await audit(req.user.tenant_id,a.model_id,req.user.email,'vendor_ai_deepdive',{ip:req.ip});
    res.json(deepdive);
  } catch(e) { console.error('[vendor-deepdive]',e.message); res.status(500).json({ error:e.message }); }
});

// GET vendor assessment with deepdive included
app.get('/api/vendor-assessments/:id', requireAuth, async function(req, res) {
  try {
    const r = await pool.query(
      'SELECT va.*,m.name AS model_name,m.vendor_name,m.vendor_product FROM vendor_assessments va JOIN models m ON va.model_id=m.id WHERE va.id=$1 AND va.tenant_id=$2',
      [req.params.id, req.user.tenant_id]
    );
    if (!r.rows.length) return res.status(404).json({ error:'Not found' });
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 3 — MULTI-TENANT ONBOARDING
// ═══════════════════════════════════════════════════════════════════════════════

// Public: self-serve institution registration
app.post('/api/onboarding/register', apiLimiter, async function(req, res) {
  try {
    const { institution_name, institution_type, asset_size_tier, contact_name, contact_email, password } = req.body;
    if (!institution_name || !contact_email || !password)
      return res.status(400).json({ error:'institution_name, contact_email, and password are required' });
    const existing = await pool.query('SELECT id FROM users WHERE email=$1',[contact_email]);
    if (existing.rows.length) return res.status(409).json({ error:'An account with this email already exists.' });

    // Provision Cognito user
    try {
      await cognito.adminCreateUser({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: contact_email,
        TemporaryPassword: password,
        MessageAction: 'SUPPRESS',
        UserAttributes: [
          { Name:'email', Value:contact_email },
          { Name:'email_verified', Value:'true' },
          { Name:'name', Value:contact_name||contact_email },
        ],
      }).promise();
      await cognito.adminSetUserPassword({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: contact_email,
        Password: password,
        Permanent: true,
      }).promise();
    } catch(e) {
      if (e.code !== 'UsernameExistsException') throw e;
    }

    const domain = contact_email.split('@')[1] || null;
    const tRes = await pool.query(
      'INSERT INTO tenants(name,domain,institution_type,asset_size_tier,status) VALUES($1,$2,$3,$4,$5) RETURNING id',
      [institution_name, domain, institution_type||null, asset_size_tier||null, 'active']
    );
    const tenantId = tRes.rows[0].id;
    await pool.query(
      'INSERT INTO users(tenant_id,email,full_name,role) VALUES($1,$2,$3,$4)',
      [tenantId, contact_email, contact_name||contact_email, 'admin']
    );

    // Seed 3 demo models for immediate value
    const demos = [
      { name:'Credit Scoring Model', mtype:'statistical', bu:'Retail Banking', purpose:'Determines credit risk score for consumer loan applications using borrower financial history.' },
      { name:'AML Transaction Monitor', mtype:'ml', bu:'Compliance', purpose:'Detects suspicious transaction patterns and generates SAR referrals for regulatory reporting.' },
      { name:'IFRS 9 Expected Credit Loss (ECL) Model', mtype:'statistical', bu:'Finance', purpose:'Calculates expected credit losses across the loan portfolio for IFRS 9 provisioning.' },
    ];
    for (const d of demos) {
      await pool.query(
        'INSERT INTO models(tenant_id,name,methodology_type,business_unit,purpose,status) VALUES($1,$2,$3,$4,$5,$6)',
        [tenantId, d.name, d.mtype, d.bu, d.purpose, 'active']
      );
    }
    await audit(tenantId,null,contact_email,'tenant_onboarded',{metadata:{institution_name,institution_type},ip:req.ip});
    res.status(201).json({ ok:true, message:'Account created. You can now sign in.' });
  } catch(e) {
    console.error('[onboarding]',e.code,e.message);
    if (e.code==='InvalidPasswordException') return res.status(400).json({ error:'Password must be 8+ chars with uppercase, lowercase, number and special character.' });
    res.status(500).json({ error:e.message });
  }
});

// Admin: list all tenants (admin/super_admin)
app.get('/api/admin/tenants', requireAuth, async function(req, res) {
  try {
    if (!['admin','super_admin'].includes(req.user.role)) return res.status(403).json({ error:'Insufficient permissions' });
    const filter = req.user.role === 'super_admin' ? '' : ' WHERE t.id=$1';
    const params = req.user.role === 'super_admin' ? [] : [req.user.tenant_id];
    const r = await pool.query(
      'SELECT t.*,(SELECT COUNT(*) FROM users WHERE tenant_id=t.id) user_count,(SELECT COUNT(*) FROM models WHERE tenant_id=t.id AND status=\'active\') model_count FROM tenants t'+filter+' ORDER BY t.created_at DESC',
      params
    );
    res.json(r.rows);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// Admin: list users for a tenant
app.get('/api/admin/tenants/:id/users', requireAuth, async function(req, res) {
  try {
    if (!['admin','super_admin'].includes(req.user.role)) return res.status(403).json({ error:'Insufficient permissions' });
    if (req.user.role === 'admin' && req.params.id !== req.user.tenant_id) return res.status(403).json({ error:'Access denied' });
    const r = await pool.query('SELECT id,email,full_name,role,created_at FROM users WHERE tenant_id=$1 ORDER BY created_at',[req.params.id]);
    res.json(r.rows);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// Admin: provision a new user into a tenant
app.post('/api/admin/tenants/:id/users', requireAuth, async function(req, res) {
  try {
    if (!['admin','super_admin'].includes(req.user.role)) return res.status(403).json({ error:'Insufficient permissions' });
    if (req.user.role === 'admin' && req.params.id !== req.user.tenant_id) return res.status(403).json({ error:'Access denied' });
    const { email, full_name, role, temp_password } = req.body;
    if (!email || !temp_password) return res.status(400).json({ error:'email and temp_password required' });
    try {
      await cognito.adminCreateUser({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email,
        TemporaryPassword: temp_password,
        MessageAction: 'SUPPRESS',
        UserAttributes: [
          { Name:'email', Value:email },
          { Name:'email_verified', Value:'true' },
          { Name:'name', Value:full_name||email },
        ],
      }).promise();
      await cognito.adminSetUserPassword({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email,
        Password: temp_password,
        Permanent: true,
      }).promise();
    } catch(e) { if (e.code !== 'UsernameExistsException') throw e; }
    const r = await pool.query(
      'INSERT INTO users(tenant_id,email,full_name,role) VALUES($1,$2,$3,$4) ON CONFLICT(email) DO UPDATE SET tenant_id=$1,full_name=$3,role=$4 RETURNING *',
      [req.params.id, email, full_name||email, role||'analyst']
    );
    await audit(req.user.tenant_id,null,req.user.email,'user_provisioned',{metadata:{email,tenant_id:req.params.id},ip:req.ip});
    res.status(201).json(r.rows[0]);
  } catch(e) { console.error('[provision-user]',e.code,e.message); res.status(500).json({ error:e.message }); }
});

// Admin: configure SSO for tenant
app.put('/api/admin/tenants/:id/sso', requireAuth, async function(req, res) {
  try {
    if (!['admin','super_admin'].includes(req.user.role)) return res.status(403).json({ error:'Insufficient permissions' });
    if (req.user.role === 'admin' && req.params.id !== req.user.tenant_id) return res.status(403).json({ error:'Access denied' });
    const { sso_enabled, sso_provider_name, sso_metadata_url } = req.body;
    if (sso_enabled && sso_provider_name && sso_metadata_url) {
      try {
        await cognito.createIdentityProvider({
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
          ProviderName: sso_provider_name,
          ProviderType: 'SAML',
          ProviderDetails: { MetadataURL: sso_metadata_url },
          AttributeMapping: { email:'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' },
        }).promise();
      } catch(e) { if (e.code !== 'DuplicateProviderException') throw e; }
    }
    await pool.query(
      'UPDATE tenants SET sso_enabled=$1,sso_provider_name=$2,sso_metadata_url=$3 WHERE id=$4',
      [sso_enabled||false, sso_provider_name||null, sso_metadata_url||null, req.params.id]
    );
    await audit(req.user.tenant_id,null,req.user.email,'sso_configured',{metadata:{tenant_id:req.params.id,sso_enabled},ip:req.ip});
    res.json({ ok:true });
  } catch(e) { console.error('[sso-config]',e.code,e.message); res.status(500).json({ error:e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 3 — SSO AUTH
// ═══════════════════════════════════════════════════════════════════════════════

// Check if email domain has SSO, return Cognito hosted-UI redirect URL
app.post('/api/auth/sso-init', apiLimiter, async function(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error:'Email required' });
    const domain = (email.split('@')[1]||'').toLowerCase();
    if (!domain) return res.json({ sso_available:false });
    const t = await pool.query('SELECT sso_enabled,sso_provider_name FROM tenants WHERE domain=$1 AND sso_enabled=true',[domain]);
    if (!t.rows.length) return res.json({ sso_available:false });
    const provider = t.rows[0].sso_provider_name;
    const cognitoDomain = process.env.COGNITO_DOMAIN||'';
    const clientId = process.env.COGNITO_CLIENT_ID;
    const appUrl = process.env.APP_URL||'https://clearmrm.nimblestride.ca';
    const redirectUri = encodeURIComponent(appUrl+'/api/auth/sso-callback');
    const ssoUrl = 'https://'+cognitoDomain+'/oauth2/authorize?response_type=code&client_id='+clientId+'&redirect_uri='+redirectUri+'&identity_provider='+encodeURIComponent(provider)+'&scope=openid+email+profile';
    res.json({ sso_available:true, sso_url:ssoUrl, provider_name:provider });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// SSO callback — Cognito redirects here after IdP authentication
app.get('/api/auth/sso-callback', async function(req, res) {
  try {
    const { code, error, error_description } = req.query;
    if (error) return res.redirect('/#sso-error='+encodeURIComponent(error_description||error));
    if (!code) return res.redirect('/#sso-error=no_code');
    const cognitoDomain = process.env.COGNITO_DOMAIN||'';
    const clientId = process.env.COGNITO_CLIENT_ID;
    const appUrl = process.env.APP_URL||'https://clearmrm.nimblestride.ca';
    const redirectUri = appUrl+'/api/auth/sso-callback';
    const body = 'grant_type=authorization_code&code='+code+'&redirect_uri='+encodeURIComponent(redirectUri)+'&client_id='+clientId;
    const https = require('https');
    const tokenData = await new Promise(function(resolve,reject) {
      const opts = { hostname:cognitoDomain, path:'/oauth2/token', method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded','Content-Length':Buffer.byteLength(body)} };
      const reqH = https.request(opts,function(r){ let d=''; r.on('data',function(c){ d+=c; }); r.on('end',function(){ try{ resolve(JSON.parse(d)); }catch(e){ reject(e); } }); });
      reqH.on('error',reject); reqH.write(body); reqH.end();
    });
    if (!tokenData.id_token) return res.redirect('/#sso-error=token_exchange_failed');
    // Auto-provision user into correct tenant if first SSO login
    try {
      const parts = tokenData.id_token.split('.');
      const claims = JSON.parse(Buffer.from(parts[1],'base64url').toString('utf8'));
      const email = claims.email||'';
      if (email) {
        const existing = await pool.query('SELECT id FROM users WHERE email=$1',[email]);
        if (!existing.rows.length) {
          const domain = (email.split('@')[1]||'').toLowerCase();
          const tenant = await pool.query('SELECT id FROM tenants WHERE domain=$1 AND sso_enabled=true',[domain]);
          if (tenant.rows.length) {
            await pool.query('INSERT INTO users(tenant_id,email,full_name,role) VALUES($1,$2,$3,$4) ON CONFLICT(email) DO NOTHING',
              [tenant.rows[0].id,email,claims.name||email,'analyst']);
          }
        }
      }
    } catch(e) { console.error('[sso-autoprovision]',e.message); }
    res.redirect('/#sso-token='+tokenData.id_token);
  } catch(e) { console.error('[sso-callback]',e.message); res.redirect('/#sso-error='+encodeURIComponent(e.message)); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 3 — OSFI EXAMINER EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

app.post('/api/reports/examiner-export', aiLimiter, requireAuth, async function(req, res) {
  try {
    const tid = req.user.tenant_id;
    const [tenant, models, validations, vendors, overdueRes] = await Promise.all([
      pool.query('SELECT * FROM tenants WHERE id=$1',[tid]),
      pool.query(
        "SELECT m.*,(SELECT ai_reasoning FROM risk_ratings WHERE model_id=m.id ORDER BY created_at DESC LIMIT 1) AS latest_reasoning,(SELECT score_total FROM risk_ratings WHERE model_id=m.id ORDER BY created_at DESC LIMIT 1) AS score_total FROM models m WHERE m.tenant_id=$1 AND m.status='active' ORDER BY m.risk_tier NULLS LAST,m.name",
        [tid]
      ),
      pool.query('SELECT v.*,m.name AS model_name,m.risk_tier,m.business_unit FROM validations v JOIN models m ON v.model_id=m.id WHERE v.tenant_id=$1 ORDER BY v.created_at DESC',[tid]),
      pool.query('SELECT va.*,m.name AS model_name,m.vendor_name,m.vendor_product FROM vendor_assessments va JOIN models m ON va.model_id=m.id WHERE va.tenant_id=$1 ORDER BY va.created_at DESC',[tid]),
      pool.query("SELECT COUNT(*) c FROM models WHERE tenant_id=$1 AND status='active' AND next_validation_due < NOW()",[tid]),
    ]);
    const inst = (tenant.rows[0]&&tenant.rows[0].name)||'Institution';
    const ms = models.rows;
    const t1 = ms.filter(function(m){ return m.risk_tier===1; });
    const t2 = ms.filter(function(m){ return m.risk_tier===2; });
    const t3 = ms.filter(function(m){ return m.risk_tier===3; });
    const unr = ms.filter(function(m){ return !m.risk_tier; });
    const overdueN = parseInt(overdueRes.rows[0].c);
    const completedVals = validations.rows.filter(function(v){ return v.status==='approved'||v.status==='closed'; });

    // AI: 4-sentence examination narrative
    let complianceNarrative = 'Compliance narrative unavailable.';
    try {
      const aiResp = await callBedrock({
        model:'anthropic.claude-3-sonnet-20240229-v1:0', max_tokens:500, temperature:0.15,
        messages:[{role:'user',content:
          'You are a senior OSFI examiner writing the official Model Risk Management examination narrative for '+inst+'.\n\n'+
          'Examination date: '+new Date().toLocaleDateString('en-CA',{year:'numeric',month:'long'})+'\n'+
          'OSFI Guideline E-23 (September 2025, effective May 1, 2027)\n\n'+
          'Data: Total models: '+ms.length+'. Tier 1 (High): '+t1.length+'. Tier 2: '+t2.length+'. Tier 3: '+t3.length+'. Unrated: '+unr.length+'.\n'+
          'Overdue validations: '+overdueN+'. Completed validations: '+completedVals.length+'. Vendor assessments: '+vendors.rows.length+'.\n\n'+
          'Write exactly 4 sentences for the official examination narrative: (1) overall OSFI E-23 compliance posture with inventory completeness, (2) governance strength with §references, (3) validation program effectiveness with §references, (4) key finding requiring management response. Formal OSFI examination language.'
        }]
      });
      complianceNarrative = aiResp.content[0].text.trim();
    } catch(e) { console.error('[examiner-ai]',e.message); }

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const fontB = await pdf.embedFont(StandardFonts.HelveticaBold);
    const NAVY=rgb(0.04,0.18,0.38), RED=rgb(0.72,0.11,0.11), AMB=rgb(0.75,0.45,0.0);
    const GRN=rgb(0.10,0.55,0.20), GRY=rgb(0.5,0.5,0.5), BLK=rgb(0.05,0.05,0.05);
    const W=595.28, H=841.89, M=56;

    function exPage() {
      const pg=pdf.addPage([W,H]);
      pg.drawRectangle({x:0,y:H-52,width:W,height:52,color:NAVY});
      pg.drawText('ClearMRM',{x:M,y:H-22,size:11,font:fontB,color:rgb(1,1,1)});
      pg.drawText('OSFI E-23 SUPERVISORY REVIEW PACKAGE',{x:M+78,y:H-22,size:9,font,color:rgb(0.7,0.8,1)});
      pg.drawText('CONFIDENTIAL — REGULATORY USE ONLY',{x:W-M-195,y:H-22,size:8,font,color:rgb(0.95,0.75,0.45)});
      pg.drawText(inst,{x:M,y:H-38,size:8,font,color:rgb(0.7,0.8,1)});
      pg.drawText('Examination: '+new Date().toLocaleDateString('en-CA',{year:'numeric',month:'long',day:'numeric'}),{x:W-M-185,y:H-38,size:8,font,color:rgb(0.7,0.8,1)});
      pg.drawLine({start:{x:M,y:18},end:{x:W-M,y:18},thickness:0.4,color:GRY});
      pg.drawText('OSFI Guideline E-23 (Sep 2025) — Effective May 1, 2027 | Generated by ClearMRM',{x:M,y:8,size:6.5,font,color:GRY});
      return pg;
    }
    function tx(pg,text,x,y,opts) {
      if (!opts) opts={};
      pg.drawText(String(text||''),{x,y,size:opts.size||9,font:opts.bold?fontB:font,color:opts.color||BLK,maxWidth:opts.maxW});
    }
    function wrapTx(pg,text,x,startY,opts) {
      if (!opts) opts={};
      const maxW=opts.maxW||(W-2*M-10), sz=opts.size||8.5, lh=opts.lh||13;
      const words=String(text||'').split(' ');
      let line='', y=startY;
      words.forEach(function(w){
        const test=line?line+' '+w:w;
        if (test.length*(sz*0.55)>maxW&&line){ tx(pg,line,x,y,opts); line=w; y-=lh; }
        else { line=test; }
      });
      if (line){ tx(pg,line,x,y,opts); y-=lh; }
      return y;
    }
    function secHdr(pg,text,y) {
      pg.drawRectangle({x:M-4,y:y-16,width:W-2*M+8,height:22,color:rgb(0.06,0.22,0.46)});
      tx(pg,text,M+4,y-7,{size:9,bold:true,color:rgb(1,1,1)});
      return y-32;
    }

    // PAGE 1 — Cover
    const p1=exPage();
    p1.drawRectangle({x:M,y:H-240,width:W-2*M,height:160,color:rgb(0.95,0.97,1.0)});
    p1.drawRectangle({x:M,y:H-240,width:4,height:160,color:NAVY});
    tx(p1,'MODEL RISK MANAGEMENT',M+16,H-105,{size:18,bold:true,color:NAVY});
    tx(p1,'SUPERVISORY REVIEW PACKAGE',M+16,H-127,{size:13,bold:true,color:NAVY});
    tx(p1,'OSFI Guideline E-23 — Model Risk Management (September 2025)',M+16,H-148,{size:9,color:GRY});
    tx(p1,'Prepared for OSFI Examination',M+16,H-163,{size:9,color:GRY});
    tx(p1,'Institution: '+inst,M+16,H-183,{size:10,bold:true,color:BLK});
    tx(p1,'Date: '+new Date().toLocaleDateString('en-CA',{year:'numeric',month:'long',day:'numeric'}),M+16,H-198,{size:9,color:BLK});
    tx(p1,'Prepared by: '+req.user.email,M+16,H-213,{size:9,color:BLK});

    const metrics=[{l:'TOTAL',v:ms.length,c:NAVY},{l:'TIER 1',v:t1.length,c:RED},{l:'TIER 2',v:t2.length,c:AMB},{l:'TIER 3',v:t3.length,c:GRN},{l:'OVERDUE',v:overdueN,c:RED},{l:'VALIDATIONS',v:completedVals.length+' done',c:NAVY}];
    const mw=(W-2*M-40)/6; let mx=M;
    metrics.forEach(function(m){
      p1.drawRectangle({x:mx,y:H-362,width:mw+4,height:82,color:rgb(0.97,0.97,1)});
      p1.drawRectangle({x:mx,y:H-282,width:mw+4,height:3,color:m.c});
      tx(p1,m.v,mx+6,H-335,{size:19,bold:true,color:m.c});
      tx(p1,m.l,mx+4,H-355,{size:6.5,bold:true,color:GRY});
      mx+=mw+6;
    });

    let ny=H-392;
    ny=secHdr(p1,'OSFI E-23 EXAMINATION NARRATIVE (AI-GENERATED)',ny);
    p1.drawRectangle({x:M,y:ny-62,width:W-2*M,height:65,color:rgb(0.97,0.98,1)});
    p1.drawRectangle({x:M,y:ny-62,width:3,height:65,color:NAVY});
    ny=wrapTx(p1,complianceNarrative,M+8,ny-5,{size:8,lh:12,maxW:W-2*M-22});

    let iy=Math.min(ny-22,H-492);
    ny=secHdr(p1,'DOCUMENT INDEX',iy);
    ['Section 1: Complete Model Inventory Summary','Section 2: Tier 1 High-Risk Models — Validation Evidence','Section 3: Active Validation Findings','Section 4: Third-Party Vendor Governance (OSFI E-23 §5)','Section 5: Management Attestation'].forEach(function(s,i){
      tx(p1,(i+1)+'.  '+s,M+8,ny,{size:8.5}); ny-=14;
    });
    tx(p1,'CONFIDENTIAL: Contains supervisory information. Distribution restricted to model risk function and OSFI examiners.',M,30,{size:6.5,color:GRY});

    // PAGE 2 — Full Model Inventory
    const p2=exPage();
    let y2=secHdr(p2,'SECTION 1: MODEL INVENTORY — '+inst.toUpperCase()+' — '+new Date().toLocaleDateString('en-CA',{year:'numeric',month:'long'}),H-70);
    const cols=[{l:'Model Name',x:M,w:128},{l:'Business Unit',x:M+133,w:88},{l:'Type',x:M+225,w:60},{l:'Tier',x:M+288,w:30},{l:'Owner',x:M+320,w:80},{l:'Last Validated',x:M+403,w:72},{l:'Next Due',x:M+477,w:62}];
    cols.forEach(function(c){ tx(p2,c.l,c.x,y2+5,{size:7.5,bold:true,color:NAVY}); });
    y2-=10; p2.drawLine({start:{x:M,y:y2},end:{x:W-M,y:y2},thickness:0.6,color:NAVY}); y2-=13;
    ms.forEach(function(m,idx){
      if (y2<80) return;
      if (idx%2===0) p2.drawRectangle({x:M-2,y:y2-4,width:W-2*M+4,height:13,color:rgb(0.97,0.97,0.99)});
      const tc=m.risk_tier===1?RED:m.risk_tier===2?AMB:m.risk_tier===3?GRN:GRY;
      const isOD=m.next_validation_due&&new Date(m.next_validation_due)<new Date();
      tx(p2,(m.name||'').substring(0,21),M,y2,{size:7.5});
      tx(p2,(m.business_unit||'—').substring(0,15),M+133,y2,{size:7.5});
      tx(p2,(m.methodology_type||'—').replace(/_/g,' ').substring(0,9),M+225,y2,{size:7});
      tx(p2,m.risk_tier?'T'+m.risk_tier:'—',M+288,y2,{size:7.5,bold:true,color:tc});
      tx(p2,(m.model_owner_name||'—').substring(0,14),M+320,y2,{size:7});
      tx(p2,m.last_validated_at?new Date(m.last_validated_at).toLocaleDateString('en-CA'):'Never',M+403,y2,{size:7,color:m.last_validated_at?BLK:RED});
      tx(p2,m.next_validation_due?new Date(m.next_validation_due).toLocaleDateString('en-CA'):'—',M+477,y2,{size:7,color:isOD?RED:BLK});
      y2-=13;
    });
    tx(p2,'Total: '+ms.length+' active models. Rated: '+(ms.length-unr.length)+'. Overdue: '+overdueN+'.',M,24,{size:7.5,color:GRY});

    // PAGE 3 — Tier 1 Detail with AI reasoning
    if (t1.length>0) {
      const p3=exPage();
      let y3=secHdr(p3,'SECTION 2: TIER 1 HIGH-RISK MODELS (OSFI E-23 §4.2 — Annual Validation Required)',H-70);
      t1.forEach(function(m){
        if (y3<100) return;
        p3.drawRectangle({x:M-4,y:y3-54,width:W-2*M+8,height:60,color:rgb(0.999,0.97,0.97)});
        p3.drawRectangle({x:M-4,y:y3-54,width:3,height:60,color:RED});
        const isOD=m.next_validation_due&&new Date(m.next_validation_due)<new Date();
        tx(p3,m.name,M+8,y3,{size:10,bold:true});
        tx(p3,'Tier 1 · High Risk'+(isOD?' · VALIDATION OVERDUE':''),M+8,y3-14,{size:8,bold:true,color:isOD?RED:AMB});
        tx(p3,(m.methodology_type||'').replace(/_/g,' ')+' · Owner: '+(m.model_owner_name||'Unassigned')+' · BU: '+(m.business_unit||'—'),M+8,y3-26,{size:7.5,color:GRY});
        tx(p3,'Last validated: '+(m.last_validated_at?new Date(m.last_validated_at).toLocaleDateString('en-CA'):'Never')+' | Next due: '+(m.next_validation_due||'Not set'),M+8,y3-38,{size:7.5,color:isOD?RED:BLK});
        if (m.latest_reasoning) {
          y3=wrapTx(p3,'Risk basis: '+m.latest_reasoning,M+8,y3-50,{size:7,maxW:W-2*M-22,lh:10,color:rgb(0.3,0.3,0.3)});
          y3-=8;
        } else { y3-=62; }
        y3-=10;
      });
    }

    // PAGE 4 — Validation Evidence
    const p4=exPage();
    let y4=secHdr(p4,'SECTION 3: VALIDATION EVIDENCE (OSFI E-23 §4.3 — Independent Validation Program)',H-70);
    if (validations.rows.length===0) {
      tx(p4,'No validations on record.',M,y4,{size:9,color:GRY});
    } else {
      tx(p4,'Total: '+validations.rows.length+' validations. Completed: '+completedVals.length+'. In progress: '+(validations.rows.length-completedVals.length)+'.',M,y4,{size:8.5,bold:true,color:NAVY});
      y4-=18;
      validations.rows.slice(0,15).forEach(function(v){
        if (y4<100) return;
        const oc=v.outcome==='pass'?GRN:v.outcome==='fail'?RED:v.outcome==='conditional_pass'?AMB:GRY;
        p4.drawRectangle({x:M-2,y:y4-28,width:W-2*M+4,height:32,color:rgb(0.97,0.97,0.99)});
        tx(p4,v.model_name,M+4,y4,{size:8.5,bold:true});
        tx(p4,'Tier '+(v.risk_tier||'?'),M+185,y4,{size:8,color:GRY});
        tx(p4,v.status.replace(/_/g,' '),M+240,y4,{size:8});
        if (v.outcome) tx(p4,v.outcome.replace(/_/g,' '),M+330,y4,{size:8,bold:true,color:oc});
        tx(p4,v.assigned_to_email||'—',M+420,y4,{size:7,color:GRY});
        if (v.findings) y4=wrapTx(p4,'Findings: '+v.findings.substring(0,200),M+10,y4-14,{size:7,maxW:W-2*M-22,lh:10,color:rgb(0.3,0.3,0.3)});
        else y4-=14;
        y4-=16;
      });
    }

    // PAGE 5 — Vendor Assessments
    const p5=exPage();
    let y5=secHdr(p5,'SECTION 4: THIRD-PARTY VENDOR GOVERNANCE (OSFI E-23 §5)',H-70);
    if (vendors.rows.length===0) {
      tx(p5,'No vendor assessments on record.',M,y5,{size:9,color:GRY});
    } else {
      vendors.rows.slice(0,12).forEach(function(a){
        if (y5<100) return;
        const rc=a.risk_level==='high'?RED:a.risk_level==='medium'?AMB:GRN;
        p5.drawRectangle({x:M-2,y:y5-36,width:W-2*M+4,height:40,color:rgb(0.97,0.97,0.99)});
        tx(p5,a.model_name,M+4,y5,{size:8.5,bold:true});
        tx(p5,a.vendor_name||'—',M+4,y5-12,{size:8,color:GRY});
        tx(p5,(a.risk_level||'').toUpperCase()+' RISK',M+185,y5,{size:8,bold:true,color:rc});
        tx(p5,'Score: '+(a.risk_score||0)+'/12',M+265,y5,{size:8,color:GRY});
        tx(p5,'Assessed: '+(a.assessed_by_email||'—'),M+340,y5,{size:7.5,color:GRY});
        tx(p5,'Next review: '+(a.next_review_due||'—'),M+440,y5,{size:7.5,color:GRY});
        const chks=['q_sla_documented','q_data_access','q_audit_rights','q_exit_plan','q_model_doc_received','q_override_capability'];
        const passed=chks.filter(function(k){ return a[k]; }).length;
        tx(p5,'§5 Checklist: '+passed+'/'+chks.length+' items satisfied',M+4,y5-24,{size:7.5,color:GRY});
        if (a.ai_assessment) y5=wrapTx(p5,'AI: '+a.ai_assessment.substring(0,170),M+130,y5-24,{size:7,maxW:W-2*M-138,lh:10,color:rgb(0.25,0.25,0.55)});
        else y5-=24;
        y5-=18;
      });
    }

    // PAGE 6 — Management Attestation
    const p6=exPage();
    let y6=secHdr(p6,'SECTION 5: MANAGEMENT ATTESTATION',H-70);
    const attest=[
      'This supervisory review package has been prepared by '+inst+' pursuant to OSFI Guideline E-23 (Model Risk Management),',
      'effective May 1, 2027. The information contained herein is accurate to the best of management\'s knowledge as at',
      new Date().toLocaleDateString('en-CA',{year:'numeric',month:'long',day:'numeric'})+'. This document is provided in confidence to the Office of the Superintendent of Financial Institutions.',
      '',
      'The institution confirms:',
      '1. The model inventory represents all material models in active use, classified per OSFI E-23 §3 tiering criteria.',
      '2. Risk tier classifications reflect the institution\'s OSFI E-23 §4.2-aligned risk framework.',
      '3. Independent validation activities have been conducted per §4.3 by qualified, independent validators.',
      '4. Third-party model governance complies with or is remediating to OSFI E-23 §5 requirements.',
      '5. Audit trail records are maintained in append-only, immutable format per §4.4.',
      '',
      'Material exceptions or open findings are documented in Section 3 of this package.',
    ];
    attest.forEach(function(l){ tx(p6,l,M,y6,{size:9}); y6-=14; });
    y6-=28;
    tx(p6,'Authorized Signatory:',M,y6,{size:9,bold:true}); y6-=32;
    p6.drawLine({start:{x:M,y:y6},end:{x:M+220,y:y6},thickness:0.5,color:BLK}); y6-=16;
    tx(p6,'Chief Risk Officer — Model Risk Function',M,y6,{size:8,color:GRY}); y6-=14;
    tx(p6,'Date: ____________________________________________',M,y6,{size:9,bold:true}); y6-=36;
    tx(p6,'Generated by ClearMRM (clearmrm.nimblestride.ca) · AWS ca-central-1 · PIPEDA compliant · '+new Date().toISOString().split('T')[0],M,28,{size:7,color:GRY});

    await audit(tid,null,req.user.email,'examiner_export_generated',{metadata:{model_count:ms.length,tier1:t1.length},ip:req.ip});
    const pdfBytes=await pdf.save();
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition','attachment; filename="ClearMRM-OSFI-Examiner-Export-'+new Date().toISOString().split('T')[0]+'.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch(e) { console.error('[examiner-export]',e.message); res.status(500).json({ error:e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 4 — MODEL CHANGE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/models/:id/changes', requireAuth, async function(req, res) {
  try {
    const r = await pool.query(
      'SELECT * FROM model_versions WHERE model_id=$1 AND tenant_id=$2 ORDER BY created_at DESC',
      [req.params.id, req.user.tenant_id]
    );
    res.json(r.rows);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

app.post('/api/models/:id/changes', requireAuth, async function(req, res) {
  try {
    const { version_label, change_type, change_category, change_reason, is_material } = req.body;
    if (!version_label||!change_type||!change_reason)
      return res.status(400).json({ error:'version_label, change_type, and change_reason required' });
    const mRes = await pool.query('SELECT * FROM models WHERE id=$1 AND tenant_id=$2',[req.params.id,req.user.tenant_id]);
    if (!mRes.rows.length) return res.status(404).json({ error:'Model not found' });
    const m = mRes.rows[0];
    const snapshot = { name:m.name, business_unit:m.business_unit, methodology_type:m.methodology_type, purpose:m.purpose, risk_tier:m.risk_tier, version:m.current_version||m.version };
    const r = await pool.query(
      `INSERT INTO model_versions(tenant_id,model_id,version_label,change_type,change_category,change_reason,is_material,requires_revalidation,changed_by_email,snapshot)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [req.user.tenant_id,req.params.id,version_label,change_type,change_category||'other',
       change_reason,!!is_material,!!is_material,req.user.email,JSON.stringify(snapshot)]
    );
    await pool.query(
      'UPDATE models SET current_version=$1,revalidation_required=$2,updated_at=NOW() WHERE id=$3 AND tenant_id=$4',
      [version_label,!!is_material,req.params.id,req.user.tenant_id]
    );
    await audit(req.user.tenant_id,req.params.id,req.user.email,'model_change_logged',{
      field:'version',old:m.current_version||m.version,new:version_label,
      metadata:{change_type,change_category,is_material:!!is_material,change_reason}
    });
    res.json(r.rows[0]);
  } catch(e) { console.error('[model-change]',e.message); res.status(500).json({ error:e.message }); }
});

app.post('/api/models/:id/changes/:changeId/ai-materiality', aiLimiter, requireAuth, async function(req, res) {
  try {
    const [mRes,cvRes] = await Promise.all([
      pool.query('SELECT * FROM models WHERE id=$1 AND tenant_id=$2',[req.params.id,req.user.tenant_id]),
      pool.query('SELECT * FROM model_versions WHERE id=$1 AND tenant_id=$2',[req.params.changeId,req.user.tenant_id]),
    ]);
    if (!mRes.rows.length||!cvRes.rows.length) return res.status(404).json({ error:'Not found' });
    const m=mRes.rows[0], cv=cvRes.rows[0];
    const aiResp = await callBedrock({
      model:'anthropic.claude-3-sonnet-20240229-v1:0',
      max_tokens:700, temperature:0.2,
      messages:[{role:'user',content:
        'You are an OSFI E-23 model risk expert. Assess whether this model change is material and requires independent re-validation under OSFI Guideline E-23 (September 2025).\n\n'+
        'Model: '+m.name+'\nRisk Tier: '+(m.risk_tier||'Unrated')+'\nMethodology: '+(m.methodology_type||'unknown')+'\nBusiness Unit: '+(m.business_unit||'unknown')+'\n'+
        'Version change: '+((cv.snapshot&&cv.snapshot.version)||'prior')+' → '+cv.version_label+'\n'+
        'Change type: '+cv.change_type+'\nChange category: '+cv.change_category+'\nChange reason: '+cv.change_reason+'\n\n'+
        'Return ONLY valid JSON:\n'+
        '{"is_material":true,"materiality_score":0,"osfi_rationale":"...","revalidation_required":true,"revalidation_urgency":"immediate|within_90_days|next_cycle","risk_implications":["..."],"recommended_actions":["..."],"osfi_sections_implicated":["§X.X"]}'
      }]
    });
    const result = extractJSON(aiResp.content[0].text);
    await pool.query(
      'UPDATE model_versions SET ai_materiality=$1,is_material=$2,requires_revalidation=$3 WHERE id=$4',
      [JSON.stringify(result),result.is_material,result.revalidation_required,req.params.changeId]
    );
    if (result.revalidation_required) {
      await pool.query(
        'UPDATE models SET revalidation_required=true,updated_at=NOW() WHERE id=$1 AND tenant_id=$2',
        [req.params.id,req.user.tenant_id]
      );
    }
    await audit(req.user.tenant_id,req.params.id,req.user.email,'ai_materiality_assessed',{
      metadata:{change_id:req.params.changeId,is_material:result.is_material,score:result.materiality_score}
    });
    res.json(result);
  } catch(e) { console.error('[ai-materiality]',e.message); res.status(500).json({ error:e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 4 — EXAM SPRINT MODE
// ═══════════════════════════════════════════════════════════════════════════════

app.post('/api/exam-sprint/launch', aiLimiter, requireAuth, async function(req, res) {
  try {
    const tid = req.user.tenant_id;
    const [tenantRes,models,overdueModels,neverValidated,openVals,vendors,materialChanges] = await Promise.all([
      pool.query('SELECT name FROM tenants WHERE id=$1',[tid]),
      pool.query("SELECT risk_tier,COUNT(*) c FROM models WHERE tenant_id=$1 AND status='active' GROUP BY risk_tier",[tid]),
      pool.query("SELECT COUNT(*) c FROM models WHERE tenant_id=$1 AND status='active' AND next_validation_due<NOW()",[tid]),
      pool.query("SELECT COUNT(*) c FROM models WHERE tenant_id=$1 AND status='active' AND last_validated_at IS NULL",[tid]),
      pool.query("SELECT COUNT(*) c FROM validations WHERE tenant_id=$1 AND status NOT IN ('approved','closed')",[tid]),
      pool.query("SELECT risk_level,COUNT(*) c FROM vendor_assessments WHERE tenant_id=$1 GROUP BY risk_level",[tid]),
      pool.query("SELECT COUNT(*) c FROM models WHERE tenant_id=$1 AND revalidation_required=true",[tid]),
    ]);
    const byTier={1:0,2:0,3:0};
    models.rows.forEach(function(r){ byTier[r.risk_tier]=parseInt(r.c); });
    const total=(byTier[1]||0)+(byTier[2]||0)+(byTier[3]||0);
    const vendorByRisk={};
    vendors.rows.forEach(function(r){ vendorByRisk[r.risk_level]=parseInt(r.c); });
    const instName=(tenantRes.rows[0]&&tenantRes.rows[0].name)||'Institution';
    const aiResp = await callBedrock({
      model:'anthropic.claude-3-sonnet-20240229-v1:0',
      max_tokens:1400, temperature:0.2,
      messages:[{role:'user',content:
        'You are a senior OSFI E-23 compliance expert preparing a Canadian FRFI for an OSFI model risk examination.\n\n'+
        'Institution: '+instName+'\nDate: '+new Date().toLocaleDateString('en-CA')+'\nOSFI E-23 effective: May 1, 2027\n\n'+
        'COMPLIANCE SNAPSHOT:\n'+
        '- Total active models: '+total+' (Tier 1: '+(byTier[1]||0)+', Tier 2: '+(byTier[2]||0)+', Tier 3: '+(byTier[3]||0)+')\n'+
        '- Models overdue for validation: '+overdueModels.rows[0].c+'\n'+
        '- Models never validated: '+neverValidated.rows[0].c+'\n'+
        '- Open validation workflows: '+openVals.rows[0].c+'\n'+
        '- High-risk vendor assessments: '+(vendorByRisk['high']||0)+'\n'+
        '- Models with material changes requiring revalidation: '+materialChanges.rows[0].c+'\n\n'+
        'Generate a comprehensive Emergency OSFI Exam Sprint Plan based on OSFI Guideline E-23 (September 2025).\n\n'+
        'Return ONLY valid JSON (no extra text):\n'+
        '{"overall_readiness_score":0,"exam_risk_level":"high","executive_summary":"3 sentences","critical_gaps":[{"gap":"...","osfi_section":"§X.X","severity":"critical","affected_count":0}],"sprint_plan":{"day_30":[{"action":"...","owner":"...","osfi_ref":"§X.X","priority":"P1"}],"day_60":[{"action":"...","owner":"...","osfi_ref":"§X.X","priority":"P2"}],"day_90":[{"action":"...","owner":"...","osfi_ref":"§X.X","priority":"P2"}]},"quick_wins":["..."],"examiner_likely_questions":["..."],"strengths":["..."]}'
      }]
    });
    const plan = extractJSON(aiResp.content[0].text);
    const r = await pool.query(
      `INSERT INTO exam_sprints(tenant_id,created_by_email,overall_score,exam_risk_level,gap_analysis,sprint_plan)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING id,created_at`,
      [tid,req.user.email,plan.overall_readiness_score,plan.exam_risk_level,
       JSON.stringify({critical_gaps:plan.critical_gaps,executive_summary:plan.executive_summary,quick_wins:plan.quick_wins,examiner_likely_questions:plan.examiner_likely_questions,strengths:plan.strengths}),
       JSON.stringify(plan.sprint_plan)]
    );
    await audit(tid,null,req.user.email,'exam_sprint_launched',{
      metadata:{sprint_id:r.rows[0].id,score:plan.overall_readiness_score,risk_level:plan.exam_risk_level}
    });
    res.json({sprint_id:r.rows[0].id,created_at:r.rows[0].created_at,...plan});
  } catch(e) { console.error('[exam-sprint-launch]',e.message); res.status(500).json({ error:e.message }); }
});

app.get('/api/exam-sprint/latest', requireAuth, async function(req, res) {
  try {
    const r = await pool.query(
      'SELECT * FROM exam_sprints WHERE tenant_id=$1 ORDER BY created_at DESC LIMIT 1',
      [req.user.tenant_id]
    );
    if (!r.rows.length) return res.json(null);
    const s=r.rows[0], ga=s.gap_analysis||{}, sp=s.sprint_plan||{};
    res.json({
      sprint_id:s.id, overall_readiness_score:s.overall_score, exam_risk_level:s.exam_risk_level,
      created_at:s.created_at, executive_summary:ga.executive_summary,
      critical_gaps:ga.critical_gaps||[], quick_wins:ga.quick_wins||[],
      examiner_likely_questions:ga.examiner_likely_questions||[], strengths:ga.strengths||[],
      sprint_plan:sp,
    });
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 4b — REGULATORY CALENDAR
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/calendar/events', requireAuth, async function(req, res) {
  try {
    const tid = req.user.tenant_id;
    const now = new Date();
    const in90 = new Date(now); in90.setDate(in90.getDate() + 90);

    const [models, vendors, openVals] = await Promise.all([
      pool.query(
        `SELECT id,name,risk_tier,business_unit,next_validation_due,last_validated_at
         FROM models WHERE tenant_id=$1 AND status='active' AND next_validation_due IS NOT NULL
         ORDER BY next_validation_due ASC LIMIT 60`,
        [tid]
      ),
      pool.query(
        `SELECT id,model_name,vendor_name,next_review_due
         FROM vendor_assessments WHERE tenant_id=$1 AND next_review_due IS NOT NULL
         ORDER BY next_review_due ASC LIMIT 30`,
        [tid]
      ),
      pool.query(
        `SELECT v.id,v.status,v.created_at,m.name model_name,m.risk_tier
         FROM validations v JOIN models m ON m.id=v.model_id
         WHERE v.tenant_id=$1 AND v.status NOT IN ('approved','closed')
         ORDER BY v.created_at ASC LIMIT 20`,
        [tid]
      ),
    ]);

    const events = [];

    models.rows.forEach(function(m) {
      const due = new Date(m.next_validation_due);
      const daysUntil = Math.ceil((due - now) / 86400000);
      let urgency = 'upcoming';
      if (daysUntil < 0)   urgency = 'overdue';
      else if (daysUntil <= 30) urgency = 'critical';
      else if (daysUntil <= 90) urgency = 'warning';
      else return;
      events.push({
        id: 'val-'+m.id, type: 'validation_due', urgency,
        title: m.name, subtitle: 'Validation due · Tier '+(m.risk_tier||'?'),
        due_date: m.next_validation_due, days_until: daysUntil,
        model_id: m.id, business_unit: m.business_unit,
      });
    });

    vendors.rows.forEach(function(a) {
      const due = new Date(a.next_review_due);
      const daysUntil = Math.ceil((due - now) / 86400000);
      let urgency = 'upcoming';
      if (daysUntil < 0)   urgency = 'overdue';
      else if (daysUntil <= 30) urgency = 'critical';
      else if (daysUntil <= 90) urgency = 'warning';
      else return;
      events.push({
        id: 'vnd-'+a.id, type: 'vendor_review', urgency,
        title: a.model_name, subtitle: 'Vendor review · '+(a.vendor_name||''),
        due_date: a.next_review_due, days_until: daysUntil,
      });
    });

    openVals.rows.forEach(function(v) {
      events.push({
        id: 'wfl-'+v.id, type: 'validation_open', urgency: 'info',
        title: v.model_name, subtitle: 'Open workflow · '+(v.status||'').replace(/_/g,' '),
        due_date: null, days_until: null,
        validation_id: v.id,
      });
    });

    events.sort(function(a,b) {
      if (a.days_until === null) return 1;
      if (b.days_until === null) return -1;
      return a.days_until - b.days_until;
    });

    res.json(events);
  } catch(e) { console.error('[calendar]',e.message); res.status(500).json({ error:e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 4b — MODEL RISK APPETITE STATEMENT WIZARD
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/risk-appetite/latest', requireAuth, async function(req, res) {
  try {
    const r = await pool.query(
      `SELECT * FROM risk_appetite_statements WHERE tenant_id=$1 ORDER BY created_at DESC LIMIT 1`,
      [req.user.tenant_id]
    );
    res.json(r.rows[0] || null);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

app.post('/api/risk-appetite/generate', aiLimiter, requireAuth, async function(req, res) {
  try {
    const { risk_tolerance, max_unvalidated_pct, tier1_frequency, third_party_posture, escalation_threshold, institution_type } = req.body;
    if (!risk_tolerance) return res.status(400).json({ error:'risk_tolerance required' });

    const tRes = await pool.query('SELECT name FROM tenants WHERE id=$1',[req.user.tenant_id]);
    const instName = (tRes.rows[0]&&tRes.rows[0].name)||'the Institution';

    const aiResp = await callBedrock({
      model: 'anthropic.claude-3-sonnet-20240229-v1:0',
      max_tokens: 1200, temperature: 0.3,
      messages: [{ role:'user', content:
        'You are a senior model risk officer drafting a formal Model Risk Appetite Statement for a Canadian FRFI regulated under OSFI Guideline E-23 (September 2025).\n\n'+
        'Institution: '+instName+'\n'+
        'Institution type: '+(institution_type||'federally regulated financial institution')+'\n'+
        'Risk tolerance: '+risk_tolerance+'\n'+
        'Maximum % of Tier 1 models without active validation: '+(max_unvalidated_pct||'0%')+'\n'+
        'Tier 1 validation frequency: '+(tier1_frequency||'annual')+'\n'+
        'Third-party model posture: '+(third_party_posture||'conservative')+'\n'+
        'Model risk escalation threshold: '+(escalation_threshold||'$5M')+'\n\n'+
        'Draft a formal, board-ready Model Risk Appetite Statement. Structure it as:\n'+
        '1. STATEMENT OF MODEL RISK APPETITE — 2-3 sentences declaring overall risk tolerance\n'+
        '2. QUANTITATIVE THRESHOLDS — bullet list of specific measurable limits\n'+
        '3. QUALITATIVE BOUNDARIES — 4-5 principles (validation independence, documentation standards, third-party governance, escalation)\n'+
        '4. GOVERNANCE AND OVERSIGHT — roles and responsibilities paragraph\n'+
        '5. OSFI E-23 ALIGNMENT DECLARATION — 2 sentences citing specific E-23 sections\n\n'+
        'Write in formal regulatory language. Reference OSFI E-23 section numbers throughout. Do NOT use placeholders.'
      }]
    });

    const statementText = aiResp.content[0].text.trim();

    // Determine version
    const prev = await pool.query(
      `SELECT version FROM risk_appetite_statements WHERE tenant_id=$1 ORDER BY created_at DESC LIMIT 1`,
      [req.user.tenant_id]
    );
    let version = 'v1.0';
    if (prev.rows.length) {
      const parts = (prev.rows[0].version||'v1.0').replace('v','').split('.');
      version = 'v'+(parseInt(parts[0]||1))+'.'+( parseInt(parts[1]||0)+1 );
    }

    const r = await pool.query(
      `INSERT INTO risk_appetite_statements(tenant_id,version,inputs,statement_text,created_by)
       VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.tenant_id, version,
       JSON.stringify({ risk_tolerance, max_unvalidated_pct, tier1_frequency, third_party_posture, escalation_threshold, institution_type }),
       statementText, req.user.email]
    );
    await audit(req.user.tenant_id,null,req.user.email,'mra_statement_generated',{
      metadata:{ statement_id:r.rows[0].id, version }
    });
    res.json(r.rows[0]);
  } catch(e) { console.error('[mra-generate]',e.message); res.status(500).json({ error:e.message }); }
});

app.post('/api/risk-appetite/:id/approve', requireAuth, async function(req, res) {
  try {
    if (!['admin','super_admin'].includes(req.user.role))
      return res.status(403).json({ error:'Only admins can approve the MRA statement' });
    const r = await pool.query(
      `UPDATE risk_appetite_statements SET status='approved',approved_by=$1,approved_at=NOW()
       WHERE id=$2 AND tenant_id=$3 RETURNING *`,
      [req.user.email, req.params.id, req.user.tenant_id]
    );
    if (!r.rows.length) return res.status(404).json({ error:'Statement not found' });
    await audit(req.user.tenant_id,null,req.user.email,'mra_statement_approved',{
      metadata:{ statement_id:req.params.id }
    });
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 4b — ONGOING MODEL MONITORING
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/models/:id/monitoring', requireAuth, async function(req, res) {
  try {
    const r = await pool.query(
      `SELECT * FROM model_monitoring WHERE model_id=$1 AND tenant_id=$2 ORDER BY logged_at DESC, created_at DESC LIMIT 100`,
      [req.params.id, req.user.tenant_id]
    );
    res.json(r.rows);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

app.post('/api/models/:id/monitoring', requireAuth, async function(req, res) {
  try {
    const { metric_name, metric_value, threshold_amber, threshold_red, notes, logged_at } = req.body;
    if (!metric_name || metric_value === undefined)
      return res.status(400).json({ error:'metric_name and metric_value required' });
    const mRes = await pool.query('SELECT id,name FROM models WHERE id=$1 AND tenant_id=$2',[req.params.id,req.user.tenant_id]);
    if (!mRes.rows.length) return res.status(404).json({ error:'Model not found' });

    const r = await pool.query(
      `INSERT INTO model_monitoring(tenant_id,model_id,metric_name,metric_value,threshold_amber,threshold_red,notes,logged_by_email,logged_at)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.user.tenant_id,req.params.id,metric_name,metric_value,
       threshold_amber||null,threshold_red||null,notes||null,req.user.email,
       logged_at||new Date().toISOString().split('T')[0]]
    );
    const entry = r.rows[0];
    const breached = threshold_red && parseFloat(metric_value) >= parseFloat(threshold_red);
    if (breached) {
      await audit(req.user.tenant_id,req.params.id,req.user.email,'monitoring_threshold_breached',{
        metadata:{ metric:metric_name, value:metric_value, threshold_red }
      });
    } else {
      await audit(req.user.tenant_id,req.params.id,req.user.email,'monitoring_metric_logged',{
        metadata:{ metric:metric_name, value:metric_value }
      });
    }
    res.json({ ...entry, threshold_breached: !!breached });
  } catch(e) { console.error('[monitoring]',e.message); res.status(500).json({ error:e.message }); }
});

// AI: Calendar compliance briefing
app.get('/api/calendar/ai-briefing', aiLimiter, requireAuth, async function(req, res) {
  try {
    const tid = req.user.tenant_id;
    const [overdue, critical30, neverVal, openVals, vendors] = await Promise.all([
      pool.query("SELECT COUNT(*) c, array_agg(name ORDER BY next_validation_due ASC) names FROM models WHERE tenant_id=$1 AND status='active' AND next_validation_due<NOW()",[tid]),
      pool.query("SELECT COUNT(*) c FROM models WHERE tenant_id=$1 AND status='active' AND next_validation_due BETWEEN NOW() AND NOW()+INTERVAL '30 days'",[tid]),
      pool.query("SELECT COUNT(*) c FROM models WHERE tenant_id=$1 AND status='active' AND last_validated_at IS NULL",[tid]),
      pool.query("SELECT COUNT(*) c FROM validations WHERE tenant_id=$1 AND status NOT IN ('approved','closed')",[tid]),
      pool.query("SELECT COUNT(*) c FROM vendor_assessments WHERE tenant_id=$1 AND next_review_due<NOW()",[tid]),
    ]);
    const overdueNames=(overdue.rows[0].names||[]).slice(0,3).join(', ');
    const aiResp = await callBedrock({
      model:'anthropic.claude-3-haiku-20240307-v1:0',
      max_tokens:220, temperature:0.3,
      messages:[{role:'user',content:
        'You are an OSFI E-23 compliance officer giving a weekly calendar briefing to a Chief Risk Officer.\n\n'+
        'Compliance calendar today:\n'+
        '- Models overdue for validation: '+overdue.rows[0].c+(overdueNames?' ('+overdueNames+')':'')+'\n'+
        '- Models with validation due within 30 days: '+critical30.rows[0].c+'\n'+
        '- Models never validated: '+neverVal.rows[0].c+'\n'+
        '- Open validation workflows: '+openVals.rows[0].c+'\n'+
        '- Vendor assessments overdue: '+vendors.rows[0].c+'\n\n'+
        'Write exactly 2 sentences. Sentence 1: most urgent compliance priority this week with specific numbers and OSFI E-23 §reference. Sentence 2: the one delegation action for the team to close open items. Be directive and specific.'
      }]
    });
    res.json({ briefing:aiResp.content[0].text.trim(), generated_at:new Date() });
  } catch(e) { console.error('[cal-briefing]',e.message); res.status(500).json({ error:e.message }); }
});

// AI: Monitoring trend analysis for a specific metric
app.post('/api/models/:id/monitoring/ai-analysis', aiLimiter, requireAuth, async function(req, res) {
  try {
    const { metric_name } = req.body;
    if (!metric_name) return res.status(400).json({ error:'metric_name required' });
    const [mRes, readings] = await Promise.all([
      pool.query('SELECT name,risk_tier,methodology_type FROM models WHERE id=$1 AND tenant_id=$2',[req.params.id,req.user.tenant_id]),
      pool.query(
        'SELECT metric_value,threshold_amber,threshold_red,logged_at,notes FROM model_monitoring WHERE model_id=$1 AND tenant_id=$2 AND metric_name=$3 ORDER BY logged_at ASC LIMIT 20',
        [req.params.id,req.user.tenant_id,metric_name]
      ),
    ]);
    if (!mRes.rows.length) return res.status(404).json({ error:'Model not found' });
    if (!readings.rows.length) return res.status(400).json({ error:'No readings for this metric' });
    const m=mRes.rows[0];
    const latest=readings.rows[readings.rows.length-1];
    const readingSummary=readings.rows.map(r=>r.logged_at+': '+r.metric_value).join('; ');
    const aiResp = await callBedrock({
      model:'anthropic.claude-3-sonnet-20240229-v1:0',
      max_tokens:600, temperature:0.2,
      messages:[{role:'user',content:
        'You are an OSFI E-23 model risk expert analyzing ongoing model performance monitoring data under §4.5.\n\n'+
        'Model: '+m.name+'\nRisk Tier: '+(m.risk_tier||'Unrated')+'\nMethodology: '+(m.methodology_type||'unknown')+'\n'+
        'Metric: '+metric_name+'\nReadings (date: value): '+readingSummary+'\n'+
        'Amber threshold: '+(latest.threshold_amber||'not set')+'\nRed threshold: '+(latest.threshold_red||'not set')+'\n\n'+
        'Return ONLY valid JSON:\n'+
        '{"trend":"improving|stable|deteriorating","trend_magnitude":"low|moderate|significant","drift_assessment":"1 sentence","is_material_drift":false,"osfi_e23_implication":"1 sentence citing §4.5","recommended_actions":["..."],"escalation_required":false,"escalation_rationale":"..."}'
      }]
    });
    const result=extractJSON(aiResp.content[0].text);
    if (result.escalation_required) {
      await audit(req.user.tenant_id,req.params.id,req.user.email,'monitoring_ai_escalation_flagged',{
        metadata:{metric:metric_name,trend:result.trend,material:result.is_material_drift}
      });
    }
    res.json(result);
  } catch(e) { console.error('[monitoring-ai]',e.message); res.status(500).json({ error:e.message }); }
});

// Tenant-wide monitoring alerts (metrics breaching red threshold)
app.get('/api/monitoring/alerts', requireAuth, async function(req, res) {
  try {
    const r = await pool.query(
      `SELECT DISTINCT ON (mm.model_id, mm.metric_name)
         mm.*, m.name model_name, m.risk_tier
       FROM model_monitoring mm
       JOIN models m ON m.id = mm.model_id
       WHERE mm.tenant_id=$1
         AND mm.threshold_red IS NOT NULL
         AND mm.metric_value >= mm.threshold_red
       ORDER BY mm.model_id, mm.metric_name, mm.logged_at DESC`,
      [req.user.tenant_id]
    );
    res.json(r.rows);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ════════════════════════════════════════════════════════════════════════════════
// GOD-LEVEL AI ROUTES — Phase 5 (Automation Engine)
// ════════════════════════════════════════════════════════════════════════════════

// ── AI Action Queue: replaces passive dashboard with prioritized work queue ────
app.get('/api/dashboard/action-queue', aiLimiter, requireAuth, async function(req, res) {
  try {
    const tid = req.user.tenant_id;
    const today = new Date().toISOString().split('T')[0];

    const [models, validations, vendors, monAlerts, lastSprint] = await Promise.all([
      pool.query(
        `SELECT id,name,risk_tier,status,next_validation_due,revalidation_required,
                current_version,model_owner,model_type
         FROM models WHERE tenant_id=$1 AND status='active'`, [tid]),
      pool.query(
        `SELECT v.id,v.status,v.created_at,v.assigned_to_email,m.name model_name,m.risk_tier,
                v.findings,v.outcome
         FROM validations v JOIN models m ON m.id=v.model_id
         WHERE v.tenant_id=$1 AND v.status NOT IN ('approved','closed')`, [tid]),
      pool.query(
        `SELECT id,vendor_name,next_review_due,risk_rating FROM vendor_assessments
         WHERE tenant_id=$1 AND status='active'`, [tid]),
      pool.query(
        `SELECT DISTINCT ON (model_id,metric_name) model_id,metric_name,metric_value,threshold_red,
                threshold_amber, m.name model_name
         FROM model_monitoring mm JOIN models m ON m.id=mm.model_id
         WHERE mm.tenant_id=$1 AND threshold_red IS NOT NULL AND metric_value>=threshold_red
         ORDER BY model_id,metric_name,logged_at DESC`, [tid]),
      pool.query(
        `SELECT overall_score,exam_risk_level FROM exam_sprints
         WHERE tenant_id=$1 ORDER BY created_at DESC LIMIT 1`, [tid]),
    ]);

    const overdueModels    = models.rows.filter(m => m.next_validation_due && m.next_validation_due < today);
    const unreviewedVendors= vendors.rows.filter(v => v.next_review_due && v.next_review_due < today);
    const revalModels      = models.rows.filter(m => m.revalidation_required);
    const stalledVals      = validations.rows.filter(v => {
      const daysSince = (Date.now() - new Date(v.created_at)) / 86400000;
      return daysSince > 30;
    });

    const portfolioContext = {
      total_models: models.rows.length,
      tier1: models.rows.filter(m=>m.risk_tier===1).length,
      tier2: models.rows.filter(m=>m.risk_tier===2).length,
      tier3: models.rows.filter(m=>m.risk_tier===3).length,
      unrated: models.rows.filter(m=>!m.risk_tier).length,
      overdue_validations: overdueModels.map(m=>({name:m.name,tier:m.risk_tier,due:m.next_validation_due})),
      revalidation_required: revalModels.map(m=>({name:m.name,tier:m.risk_tier})),
      stalled_validations: stalledVals.map(v=>({model:v.model_name,status:v.status,days:Math.floor((Date.now()-new Date(v.created_at))/86400000)})),
      vendor_reviews_overdue: unreviewedVendors.map(v=>({name:v.vendor_name,due:v.next_review_due})),
      monitoring_red_alerts: monAlerts.rows.map(a=>({model:a.model_name,metric:a.metric_name})),
      last_exam_score: lastSprint.rows[0] || null,
    };

    const aiResp = await callBedrock({
      model: 'anthropic.claude-3-sonnet-20240229-v1:0',
      max_tokens: 1800,
      system: 'You are the CRO AI of a Canadian FRFI. Produce a JSON action queue that prioritizes the most urgent MRM tasks based on OSFI E-23 obligations. Return ONLY valid JSON.',
      messages: [{ role:'user', content:
        `Portfolio state: ${JSON.stringify(portfolioContext)}\n\n` +
        `Today: ${today}\n\n` +
        `Return JSON:\n` +
        `{"risk_pulse_score":0,"risk_pulse_label":"High/Moderate/Low Risk","executive_summary":"2 sentences on overall MRM posture","actions":[{"rank":1,"urgency":"critical|high|medium","category":"validation|monitoring|vendor|governance|exam","title":"...","detail":"2 sentences with specifics","action_label":"Open ...","nav_target":"validations|models|vendors|exam_sprint|mra_wizard|calendar","osfi_ref":"§X.X","estimated_hours":0,"consequence":"1 sentence on OSFI risk if ignored"}],"quick_wins":["<15 min task..."],"this_week":"1 paragraph directive to the MRM team"}`
      }]
    });
    const result = extractJSON(aiResp.content[0].text);
    await audit(tid, null, req.user.email, 'action_queue_generated', { metadata:{ risk_pulse:result.risk_pulse_score } });
    res.json({ ...result, generated_at: new Date().toISOString(), portfolio: portfolioContext });
  } catch(e) { console.error('[action-queue]',e.message); res.status(500).json({ error:e.message }); }
});

// ── AI Portfolio Doctor: scans entire model portfolio for systemic gaps ────────
app.post('/api/models/portfolio-scan', aiLimiter, requireAuth, async function(req, res) {
  try {
    const tid = req.user.tenant_id;
    const [models, validations] = await Promise.all([
      pool.query(
        `SELECT id,name,risk_tier,model_type,model_owner,next_validation_due,revalidation_required,
                current_version,methodology,data_sources,primary_output,model_purpose,status
         FROM models WHERE tenant_id=$1 AND status='active'`, [tid]),
      pool.query(
        `SELECT v.model_id, v.status, v.outcome, v.created_at
         FROM validations v WHERE v.tenant_id=$1`, [tid]),
    ]);
    const valsByModel = {};
    validations.rows.forEach(v => {
      if (!valsByModel[v.model_id]) valsByModel[v.model_id] = [];
      valsByModel[v.model_id].push(v);
    });
    const enriched = models.rows.map(m => ({
      ...m,
      validation_count: (valsByModel[m.id]||[]).length,
      last_outcome: (valsByModel[m.id]||[]).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))[0]?.outcome || 'never_validated',
    }));

    const aiResp = await callBedrock({
      model: 'anthropic.claude-3-sonnet-20240229-v1:0',
      max_tokens: 2000,
      system: 'You are a senior Canadian model risk examiner (equivalent to OSFI). Produce a candid, specific portfolio health assessment. Return ONLY valid JSON.',
      messages: [{ role:'user', content:
        `Model portfolio: ${JSON.stringify(enriched)}\n\n` +
        `Return JSON:\n` +
        `{"health_score":0,"health_grade":"A|B|C|D|F","headline":"1 sentence CRO-level summary","critical_findings":[{"finding":"...","affected_models":["name"],"osfi_ref":"§X.X","severity":"critical|high"}],"systemic_risks":[{"risk":"...","description":"...","osfi_ref":"§X.X"}],"quick_wins":[{"action":"...","models_affected":0,"hours_saved":0}],"tier_adequacy":{"assessment":"...","recommendation":"..."},"concentration_risks":[{"type":"methodology|vendor|owner|data_source","description":"...","affected_count":0}],"hours_saved_if_fixed":0,"estimated_osfi_exam_risk":"low|moderate|high|critical"}`
      }]
    });
    const result = extractJSON(aiResp.content[0].text);
    await audit(tid, null, req.user.email, 'portfolio_scan_run', { metadata:{ health_score:result.health_score, model_count:models.rows.length } });
    res.json({ ...result, model_count: models.rows.length, scanned_at: new Date().toISOString() });
  } catch(e) { console.error('[portfolio-scan]',e.message); res.status(500).json({ error:e.message }); }
});

// ── AI Validation Report Generator: produces complete formal report PDF ────────
app.post('/api/validations/:id/generate-report', aiLimiter, requireAuth, async function(req, res) {
  try {
    const tid = req.user.tenant_id;
    const vr = await pool.query(
      `SELECT v.*,m.name model_name,m.risk_tier,m.model_type,m.model_purpose,m.methodology,
              m.data_sources,m.primary_output,m.model_owner,m.regulatory_use,m.is_vendor_model,
              m.vendor_name,m.current_version
       FROM validations v JOIN models m ON m.id=v.model_id
       WHERE v.id=$1 AND v.tenant_id=$2`, [req.params.id, tid]);
    if (!vr.rows.length) return res.status(404).json({ error:'Validation not found' });
    const v = vr.rows[0];
    const history = await pool.query(
      `SELECT created_at,outcome,findings FROM validations
       WHERE model_id=$1 AND tenant_id=$2 AND id!=$3 ORDER BY created_at DESC LIMIT 3`,
      [v.model_id, tid, v.id]);
    const institution = await pool.query('SELECT name FROM tenants WHERE id=$1',[tid]);
    const instName = institution.rows[0]?.name || 'Financial Institution';

    const aiResp = await callBedrock({
      model: 'anthropic.claude-3-sonnet-20240229-v1:0',
      max_tokens: 3000,
      system: `You are a senior model validator writing a formal OSFI E-23 compliant validation report for ${instName}.
Write in formal financial institution language. Be specific and professional. Return ONLY valid JSON.`,
      messages: [{ role:'user', content:
        `Generate a complete formal validation report.\n\nValidation data: ${JSON.stringify({
          model_name: v.model_name, risk_tier: v.risk_tier, model_type: v.model_type,
          model_purpose: v.model_purpose, methodology: v.methodology, data_sources: v.data_sources,
          primary_output: v.primary_output, model_owner: v.model_owner, model_version: v.current_version,
          regulatory_use: v.regulatory_use, is_vendor: v.is_vendor_model, vendor: v.vendor_name,
          validator_email: v.assigned_to_email, validation_status: v.status,
          outcome: v.outcome, findings: v.findings, conditions: v.conditions_of_approval,
          validation_started: v.created_at, validation_closed: v.closed_at,
          validation_history: history.rows, institution: instName,
        })}\n\n` +
        `Return JSON with these exact keys:\n` +
        `{"report_date":"${new Date().toISOString().split('T')[0]}","report_version":"v1.0",` +
        `"executive_summary":"3–4 sentence formal summary","validation_scope":"2–3 sentences on scope and objectives",` +
        `"model_overview":{"description":"2–3 sentences","methodology_assessment":"2 sentences","data_assessment":"2 sentences"},` +
        `"findings_narrative":"3–5 paragraphs describing findings in formal language",` +
        `"findings_table":[{"id":"F-01","category":"Data Quality|Model Risk|Documentation|Governance","severity":"Critical|High|Medium|Low","finding":"...","osfi_ref":"§X.X","recommendation":"...","target_date":"YYYY-MM-DD"}],` +
        `"overall_risk_opinion":"Pass|Conditional Pass|Fail","risk_opinion_rationale":"2–3 sentences",` +
        `"conditions_of_approval":["condition..."],"recommendations":["recommendation..."],` +
        `"osfi_compliance_assessment":"2 sentences on OSFI E-23 compliance posture",` +
        `"validator_conclusion":"2–3 formal sentences","next_validation_recommendation":"..."}`
      }]
    });
    const report = extractJSON(aiResp.content[0].text);

    // Store generated report on validation record
    await pool.query(
      `UPDATE validations SET generated_report=$1, report_generated_at=NOW(), report_generated_by=$2 WHERE id=$3 AND tenant_id=$4`,
      [JSON.stringify(report), req.user.email, req.params.id, tid]);
    await audit(tid, v.model_id, req.user.email, 'validation_report_generated', {
      metadata:{ validation_id:req.params.id, outcome:report.overall_risk_opinion }
    });
    res.json({ ...report, model_name: v.model_name, institution_name: instName, validator: v.assigned_to_email });
  } catch(e) { console.error('[val-report]',e.message); res.status(500).json({ error:e.message }); }
});

// ── AI MRM Policy Generator ───────────────────────────────────────────────────
app.get('/api/mrm-policy/latest', requireAuth, async function(req, res) {
  try {
    const r = await pool.query(
      `SELECT * FROM mrm_policies WHERE tenant_id=$1 ORDER BY created_at DESC LIMIT 1`,
      [req.user.tenant_id]);
    res.json(r.rows[0] || null);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

app.post('/api/mrm-policy/generate', aiLimiter, requireAuth, async function(req, res) {
  try {
    const tid = req.user.tenant_id;
    const { institution_type, asset_size, model_count, board_frequency,
            validation_team_size, high_risk_categories, risk_appetite_level,
            existing_framework, regulatory_submissions, additional_context } = req.body;
    const inst = await pool.query('SELECT name FROM tenants WHERE id=$1',[tid]);
    const instName = inst.rows[0]?.name || 'Financial Institution';

    const aiResp = await callBedrock({
      model: 'anthropic.claude-3-sonnet-20240229-v1:0',
      max_tokens: 4000,
      system: `You are a senior regulatory counsel specializing in OSFI E-23 compliance for Canadian FRFIs.
Draft a complete, board-ready Model Risk Management Policy document. Use formal policy language. Return ONLY valid JSON.`,
      messages: [{ role:'user', content:
        `Draft a complete OSFI E-23 compliant MRM Policy for: ${instName}\n\n` +
        `Institution details: ${JSON.stringify({ institution_type, asset_size, model_count, board_frequency,
          validation_team_size, high_risk_categories, risk_appetite_level,
          existing_framework, regulatory_submissions, additional_context })}\n\n` +
        `Return JSON:\n` +
        `{"policy_title":"Model Risk Management Policy","effective_date":"${new Date().toISOString().split('T')[0]}","version":"v1.0","review_cycle":"Annual",` +
        `"sections":[` +
        `{"number":"1","title":"Purpose and Scope","content":"3–4 paragraphs"},` +
        `{"number":"2","title":"Definitions","content":"definitions of: Model, Model Risk, Tier 1/2/3, MRM, Validation, Champion-Challenger"},` +
        `{"number":"3","title":"Governance Framework","content":"3–4 paragraphs covering Board, Audit Committee, CRO, Model Risk Committee, Second Line"},` +
        `{"number":"4","title":"Model Identification and Inventory (OSFI E-23 §3)","content":"3–4 paragraphs"},` +
        `{"number":"5","title":"Model Risk Rating and Tiering (OSFI E-23 §3.2)","content":"3–4 paragraphs with tier criteria table"},` +
        `{"number":"6","title":"Model Validation Standards (OSFI E-23 §4)","content":"4–5 paragraphs covering independence, scope, frequency, findings"},` +
        `{"number":"7","title":"Third-Party and Vendor Models (OSFI E-23 §5)","content":"3–4 paragraphs"},` +
        `{"number":"8","title":"Ongoing Model Monitoring (OSFI E-23 §4.5)","content":"3–4 paragraphs covering metrics, thresholds, escalation"},` +
        `{"number":"9","title":"Model Change Management (OSFI E-23 §4.2)","content":"3 paragraphs covering materiality, re-validation triggers"},` +
        `{"number":"10","title":"Model Risk Appetite","content":"2–3 paragraphs with quantitative limits"},` +
        `{"number":"11","title":"Audit and Reporting","content":"2–3 paragraphs"},` +
        `{"number":"12","title":"Policy Exceptions","content":"2 paragraphs"},` +
        `{"number":"13","title":"Regulatory Compliance","content":"2 paragraphs referencing OSFI E-23"}],` +
        `"board_attestation":"Board-level statement for approval page","policy_owner":"Chief Risk Officer","approvers":["Board of Directors","Audit Committee","Chief Risk Officer"]}`
      }]
    });
    const policy = extractJSON(aiResp.content[0].text);

    const r = await pool.query(
      `INSERT INTO mrm_policies(tenant_id,version,status,inputs,policy_text,created_by)
       VALUES($1,'v1.0','draft',$2,$3,$4) RETURNING id`,
      [tid, JSON.stringify(req.body), JSON.stringify(policy), req.user.email]);
    await audit(tid, null, req.user.email, 'mrm_policy_generated', { metadata:{ policy_id:r.rows[0].id } });
    res.json({ id: r.rows[0].id, ...policy, institution_name: instName });
  } catch(e) { console.error('[mrm-policy]',e.message); res.status(500).json({ error:e.message }); }
});

app.post('/api/mrm-policy/:id/approve', requireAuth, async function(req, res) {
  try {
    const tid = req.user.tenant_id;
    const r = await pool.query(
      `UPDATE mrm_policies SET status='approved',approved_by=$1,approved_at=NOW()
       WHERE id=$2 AND tenant_id=$3 RETURNING *`,
      [req.user.email, req.params.id, tid]);
    if (!r.rows.length) return res.status(404).json({ error:'Policy not found' });
    await audit(tid, null, req.user.email, 'mrm_policy_approved', { metadata:{ policy_id:req.params.id } });
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({ error:e.message }); }
});

// ── Natural Language Search ───────────────────────────────────────────────────
app.get('/api/search', aiLimiter, requireAuth, async function(req, res) {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ results:[], interpretation:'', query:q });
    const tid = req.user.tenant_id;
    const models = await pool.query(
      `SELECT id,name,risk_tier,model_type,model_purpose,methodology,model_owner,
              status,next_validation_due,revalidation_required,is_vendor_model,vendor_name
       FROM models WHERE tenant_id=$1 AND status='active'`, [tid]);

    const aiResp = await callBedrock({
      model: 'anthropic.claude-3-haiku-20240307-v1:0',
      max_tokens: 800,
      system: 'You are a model inventory search engine. Given a natural language query and a model list, return the matching model IDs and a human-readable interpretation. Return ONLY valid JSON.',
      messages: [{ role:'user', content:
        `Query: "${q}"\n\nModel inventory: ${JSON.stringify(models.rows)}\n\n` +
        `Return JSON: {"matched_ids":["uuid",...],"interpretation":"1 sentence explaining what you found","total_matched":0,"search_explanation":"how you interpreted the query"}`
      }]
    });
    const parsed = extractJSON(aiResp.content[0].text);
    const results = models.rows.filter(m => (parsed.matched_ids||[]).includes(m.id));
    res.json({ results, interpretation: parsed.interpretation, search_explanation: parsed.search_explanation, total_matched: results.length, query: q });
  } catch(e) { console.error('[search]',e.message); res.status(500).json({ error:e.message }); }
});

// ── AI Document Intelligence ──────────────────────────────────────────────────
app.post('/api/ai/ingest-document', aiLimiter, requireAuth, async function(req, res) {
  try {
    const { document_text, document_type } = req.body;
    if (!document_text || document_text.length < 50)
      return res.status(400).json({ error:'Document text too short. Paste at least a paragraph.' });

    const typeHint = document_type || 'unknown';
    const aiResp = await callBedrock({
      model: 'anthropic.claude-3-sonnet-20240229-v1:0',
      max_tokens: 1500,
      system: 'You are a model risk document analyst. Extract structured MRM data from pasted document text. Return ONLY valid JSON.',
      messages: [{ role:'user', content:
        `Document type hint: ${typeHint}\nDocument text:\n\n${document_text.substring(0,4000)}\n\n` +
        `Extract all available information and return JSON:\n` +
        `{"document_type_detected":"validation_report|model_development_doc|vendor_assessment|mra_policy|other",` +
        `"confidence":"high|medium|low",` +
        `"extracted_model_data":{"name":null,"model_type":null,"model_purpose":null,"methodology":null,"data_sources":null,"primary_output":null,"model_owner":null,"vendor_name":null,"regulatory_use":null},` +
        `"extracted_validation_data":{"validator_name":null,"validation_date":null,"outcome":null,"findings":null,"conditions":null,"scope":null},` +
        `"extracted_vendor_data":{"vendor_name":null,"product_name":null,"contract_end_date":null,"risk_rating":null},` +
        `"key_dates":[{"label":"...","date":"YYYY-MM-DD"}],` +
        `"osfi_sections_referenced":["§X.X"],` +
        `"summary":"2–3 sentence plain English summary of what this document is about",` +
        `"suggested_next_action":"what to do with this document in ClearMRM",` +
        `"data_quality_warnings":["any fields that seemed unclear or ambiguous"]}`
      }]
    });
    const result = extractJSON(aiResp.content[0].text);
    await audit(req.user.tenant_id, null, req.user.email, 'document_ingested', {
      metadata:{ doc_type:result.document_type_detected, confidence:result.confidence }
    });
    res.json(result);
  } catch(e) { console.error('[ingest]',e.message); res.status(500).json({ error:e.message }); }
});

// ── SPA fallback ──────────────────────────────────────────────────────────────
app.get('/{*path}', function(req, res) {
  res.sendFile(path.join(__dirname,'public','index.html'));
});

const PORT=process.env.PORT||3001;
app.listen(PORT, function() {
  console.log('[ClearMRM] Port '+PORT+' | Bedrock ca-central-1 | DB: clearmrm | Phase 1–5');
});
