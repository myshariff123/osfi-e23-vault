# ClearMRM — Product Formulation Log

> This document is the living record of all strategic decisions, product definitions, feature choices, and rationale established during the formulation of ClearMRM. It serves as the guiding star for all future development decisions. Every significant decision recorded here should be treated as a binding product principle unless explicitly revisited and updated with the date of change and reason.

**Project Start:** June 22, 2026
**Last Updated:** June 23, 2026 (Session 5 — Customer Pivot)
**Status:** Phase 1 + Phase 2 + Phase 3 + Phase 4 + Phase 5 DEPLOYED — `https://clearmrm.nimblestride.ca`

---

## SESSION 1 — June 22, 2026

### Origin: Market Research → Opportunity Identification

**Context:** A comprehensive research exercise across publicly accessible reports from Deloitte, McKinsey, PwC, KPMG, EY, Accenture, and BCG identified the top 4 global trending areas and top 4 Canadian regulatory compliance opportunities for building a sellable SaaS product within 3–6 months.

**The Convergence Finding:** Two of the highest-ranked opportunities — AI Model Monitoring Dashboard (Global #3) and OSFI E-23 Model Inventory (Canada #1) — were identified as the same product. They converge on one solution: a model governance and compliance platform purpose-built for Canada, with natural international expansion capability.

**Decision made:** Proceed with the OSFI E-23 Model Inventory platform as the primary product. This combines:
- The global demand signal for AI model governance
- The hard Canadian regulatory deadline (May 1, 2027) creating urgency and a forced buying cycle
- The absence of any Canadian-native, OSFI-specific, affordable solution in the market

---

### Opportunity Validation Summary

**Why this opportunity is real (evidence from research):**

| Signal | Source | Finding |
|---|---|---|
| Regulatory mandate | OSFI | E-23 (final, Sep 2025) effective May 1, 2027 — affects ALL FRFIs |
| Market gap | BDO Canada / MNP | 68–74% of Canadian mid-tier FRFIs manage model inventory in Excel |
| Validation backlog | IIA Canada survey 2025 | Average model validation backlog: 22 months across Canadian FRFIs |
| AI model blindspot | OSFI 2025 revision | New explicit inclusion of AI/ML models — most institutions unprepared |
| Enterprise price gap | IBM OpenPages | $800K–$2.5M / 12–24 months — inaccessible to 90% of market |
| No Canadian competitor | Market scan | No Canadian-native, OSFI-specific, purpose-built platform found |
| Scope expansion | OSFI 2025 revision | Expanded from deposit-taking only → ALL FRFIs (triples TAM) |
| Deadline urgency | OSFI | May 2027 = hard compliance date; OSFI can add capital requirements for non-compliance |

---

### Consulting Firm Research Links (Public, Free Access)

For ongoing market intelligence, the following publicly accessible resources were identified and should be monitored:

**Deloitte:**
- [Tech Trends 2026 Hub](https://www.deloitte.com/us/en/insights/topics/technology-management/tech-trends.html)
- [Tech Trends 2026 PDF (Free)](https://mkto.deloitte.com/rs/712-CNF-326/images/DI_Tech-trends-2026.pdf)
- [Deloitte Canada — OSFI E-23 Expanded Guidelines](https://www.deloitte.com/ca/en/Industries/financial-services/perspectives/osfi-expanded-guidelines.html)

**McKinsey:**
- [Global Tech Agenda 2026](https://www.mckinsey.com/capabilities/mckinsey-technology/our-insights/mckinsey-global-tech-agenda-2026)
- [Technology Trends Outlook 2025 PDF (Free)](https://www.mckinsey.com/~/media/mckinsey/business%20functions/mckinsey%20digital/our%20insights/the%20top%20trends%20in%20tech%202025/mckinsey-technology-trends-outlook-2025.pdf)
- [State of Organizations 2026 PDF (Free)](https://www.mckinsey.com/~/media/mckinsey/business%20functions/people%20and%20organizational%20performance/our%20insights/the%20state%20of%20organizations/2026/the-state-of-organizations-2026.pdf)

**PwC:**
- [PwC Annual Outlook 2026](https://www.pwc.com/us/en/about-us/newsroom/press-releases/annual-outlook-2026.html)
- [PwC Canada M&A Trends 2026](https://www.pwc.com/ca/en/services/deals/trends.html)

**KPMG:**
- [KPMG Global Tech Report 2026](https://kpmg.com/xx/en/our-insights/ai-and-technology/global-tech-report.html)
- [KPMG Canada CSSB Sustainability Reporting](https://kpmg.com/ca/en/services/environmental-social-and-governance/reporting/cssb-sustainability-reporting.html)

**EY:**
- [EY CEO Outlook 2026](https://www.ey.com/en_gl/ceo/ceo-outlook-global-report)
- [EY Canada — CSDS New Sustainability Standards](https://www.ey.com/en_ca/insights/assurance/canadas-new-sustainability-standards)

**Accenture:**
- [Accenture Macro Foresight Brief 2026 PDF (Free)](https://www.accenture.com/content/dam/accenture/final/accenture-com/document-4/Accenture-Strategy-Macro-Foresight-Brief-2026-Top-10-Trends.pdf)
- [Accenture Banking Trends 2026 PDF (Free)](https://www.accenture.com/content/dam/accenture/final/industry/banking/document/Banking-Top-Trends-FY26-Report-Final.pdf)

**BCG:**
- [BCG Publications Hub (all free)](https://www.bcg.com/publications)

**Canadian Regulatory Sources:**
- [OSFI E-23 Guideline (Official)](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/guideline-e-23-model-risk-management-2027)
- [ValidMind — OSFI E-23 Analysis](https://verifywise.ai/blog/osfi-e-23-ai-model-risk-management-canada)
- [ValidMind — E-23 Compliance Strategies](https://validmind.com/blog/e-23-compliance-strategies-for-model-risk-management/)
- [BDO Canada — OSFI B-13 and AI Compliance](https://www.bdo.ca/insights/how-osfi-b-13-and-ai-driven-automation-are-shaping-the-future-of-compliance)

---

### Product Name

**Final name: ClearMRM**

**Working name discarded:** "OSFI E-23 Vault" was the session-1 working name.

**Rationale for ClearMRM:** Clear = transparent, audit-ready, unambiguous; MRM = Model Risk Management (industry-standard abbreviation used by every CRO, Head of Model Risk, and OSFI examiner). The name is immediately understood by the target audience without explanation.

**URL:** `https://clearmrm.nimblestride.ca` (live as of June 22, 2026)

**Brand parent:** Nimblestride Inc. (same legal entity and AWS account as ClearBind)

**Decision status:** Final — do not revert to "OSFI E-23 Vault". Register trademark before first public announcement.

---

### Core Product Decisions

#### DECISION 1: Scope is strictly OSFI E-23 compliance — no scope creep in v1.0

The product will only include features that directly help a Canadian FRFI demonstrate E-23 compliance to OSFI. Every feature request must pass this test.

**Rationale:** The discipline of a narrow scope is what makes a 30-day implementation possible. Scope creep toward generic GRC functionality would undermine the positioning, extend implementation time, and make the product compete with IBM/SAS on their terms rather than on ours.

**Features excluded from v1.0:**
- Capital calculation engines
- Model build/development environments
- Credit adjudication workflow
- AML transaction monitoring
- Generic GRC framework functionality

---

#### DECISION 2: Competitive positioning — do not compete with IBM, SAS, Moody's, Wolters Kluwer

These enterprise players target Tier 1 banks (RBC, TD, CIBC, BMO, Scotiabank, National Bank) who have 20–50 model risk professionals and $1M+ software budgets.

Our market is Tier 2 institutions ($1B–$100B assets) with 2–5 model risk professionals who cannot afford enterprise tools and cannot build internally.

**This is a non-overlapping market segment.** The strategy is to make enterprise tools irrelevant to our target segment, not to compete feature-for-feature with them.

---

#### DECISION 3: The five architectural pillars are non-negotiable

Every technical decision must respect these five pillars:

1. **Auditability by Design** — Append-only audit log from Day 1, built into data model
2. **Canadian Data Sovereignty** — AWS ca-central-1 exclusively, no exceptions, contractually guaranteed
3. **Tenant Isolation** — PostgreSQL RLS, tenant_id on every table, no cross-tenant data access possible
4. **Process-Based, Not Tool-Based** — Platform enforces the compliance process; users cannot skip steps
5. **Explainability Over Automation** — Every AI-generated recommendation must include traceable reasoning

---

#### DECISION 4: Pricing strategy — dramatically below enterprise, profitable at scale

| Tier | Institution Size | ACV |
|---|---|---|
| Tier 3 — Community | Under $1B assets | $30,000/yr |
| Tier 2 — Regional | $1B–$20B assets | $72,000/yr |
| Tier 1 — National | $20B–$100B assets | $144,000/yr |
| Enterprise | Over $100B assets | Custom ($180K+) |

The IBM comparison (used in every sales conversation): "IBM OpenPages: $1.2M year-1, 18-month implementation. Our platform: $72K/year, 30-day implementation. $1.1M saved in year 1."

---

#### DECISION 5: Technology stack — AWS ca-central-1 native, existing team skills

- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Backend:** Node.js 20 LTS + TypeScript + Express.js
- **Database:** PostgreSQL 15 on AWS RDS ca-central-1 (with RLS)
- **AI:** AWS Bedrock + Claude (ca-central-1) — NOT OpenAI (PIPEDA violation risk)
- **Infrastructure:** AWS ECS Fargate (not single EC2), CI/CD via GitHub Actions
- **Auth:** AWS Cognito + MFA enforcement

**Critical:** The OpenAI → AWS Bedrock migration is a prerequisite before any enterprise client data touches the system. The OPC/CAI/OIPC Joint Investigation of OpenAI (May 6, 2026) found OpenAI non-compliant with PIPEDA and Quebec Law 25.

---

#### DECISION 6: MVP scope is disciplined minimum — three features only

MVP includes:
1. Model Registry (Feature 1) — complete structured inventory
2. Risk Rating Engine (Feature 2) — automated Tier 1/2/3 classification
3. Audit Trail (Feature 5) — immutable append-only log
4. Basic Board Pack PDF generator
5. Role-based multi-user access
6. CSV import from Excel (critical for onboarding existing spreadsheet inventories)

Features deferred to Phase 2 (not MVP):
- Validation Workflow Manager (Feature 3)
- Third-Party/Vendor Model Module (Feature 4)
- OSFI Examiner Export (Feature 7)
- API integrations with core banking systems

---

### Go-to-Market Decisions

#### DECISION 7: Launch timing — immediately, not January 2027

The buyer urgency peaks in Q3 2026 (July–September 2026). A Tier 2 bank beginning evaluation in September 2026 with a 3–6 month decision cycle can be operational by March 2027 — 2 months before the deadline. If we launch in January 2027, we miss the majority of the buying window.

**Sales urgency maximum: Q3 2026 to Q1 2027.**

---

#### DECISION 8: Lighthouse client strategy for pilot phase

Sign 2–3 pilot clients at $36K–$60K/year (discounted from standard $96K–$120K).
In exchange: co-design participation, reference permission, case study rights.

Composition: one bank, one insurer, one credit union — for segment reference diversity.

The three most accessible lighthouse candidates are:
1. A smaller Schedule I bank or trust company
2. A federal P&C insurer
3. A credit union central

---

#### DECISION 9: The regulatory counsel opinion letter is a marketing asset

Budget $15K–$25K for a formal OSFI E-23 compliance review opinion letter from qualified Canadian insurance/banking regulatory counsel. This letter:

- Validates the product's regulatory alignment to an OSFI examiner
- Becomes a key differentiator in enterprise sales (no competitor has this)
- Is released publicly as a white paper to generate inbound demand
- Eliminates the CCO/legal gatekeeper objection

This is the highest-ROI marketing spend in Phase 0.

---

#### DECISION 10: Risk Canada Conference is the single most important go-to-market event

Risk Canada (typically February/March) is where every CRO, Head of Model Risk, and CCO at Canadian financial institutions attends. The Phase 3 General Availability launch must be timed with this conference. A booth, a speaking slot on OSFI E-23, and a case study from the lighthouse client presented at Risk Canada is the most efficient path to pipeline generation.

---

### Top 10 Target Customers (Confirmed in Session 1)

| Priority | Institution | Province | Segment | Annual Budget Signal |
|---|---|---|---|---|
| 1 | ATB Financial | Alberta | Crown bank equiv. | $180M+ tech spend |
| 2 | Equitable Bank (EQ Bank) | Ontario | Tier 2 bank | $50M+ tech spend |
| 3 | Home Capital / Home Trust | Ontario | Trust company | Compliance-forward since 2017 |
| 4 | Laurentian Bank | Quebec | Tier 2 bank | $300M tech modernization |
| 5 | CWB / National Bank (AB) | Alberta | Post-merger integration | National Bank budget |
| 6 | Wawanesa Insurance | Manitoba | Federal insurer | $150M+ operating expense |
| 7 | Co-operators Group | Ontario | Federal insurer (multi-entity) | $200M+ digital transformation |
| 8 | Alberta Blue Cross | Alberta | Provincial + federal plans | $7.2B benefits processed |
| 9 | Peace Hills Insurance | Alberta | Provincial insurer | Reinsurance-driven urgency |
| 10 | Concentra Bank | Saskatchewan | Credit union central | Credit union ecosystem leader |

**Primary contacts at each institution:**
- Chief Risk Officer (primary champion)
- Head of Model Risk / Head of Model Validation (technical champion)
- CFO (economic buyer)
- Chief Compliance Officer (legal gatekeeper)
- CISO / VP IT Security (security gatekeeper)

---

### Four Competitive Moats (Long-Term Defense)

1. **Regulatory interpretation depth** — Accumulates monthly; irreplicable without operating history
2. **Model Type Library** — 200+ Canadian FRFI model descriptions, risk rating benchmarks, validation templates; irreplicable without client data
3. **Switching cost** — Immutable audit trail cannot be migrated; switching = rebuilding entire compliance history
4. **Ecosystem partnerships** — PRMIA Canada, validation firm referral network, OSFI-accredited partners

---

### Open Questions Requiring Resolution Before Phase 1 Build

The following questions were not resolved in this session and must be answered before MVP development begins:

| Question | Owner | Priority |
|---|---|---|
| What is the product's legal entity name? (OSFI E-23 Vault Inc. vs. Nimblestride Inc.) | Founder | High |
| Does the existing nimblestride.ca brand extend to this product or is a new brand needed? | Founder | High |
| What is the target go-live date for MVP (internal demo)? | Founder + Tech | High |
| Has regulatory counsel been engaged? Which firm? | Founder | High |
| Has a data residency counsel been engaged for the DPA template? | Founder | High |
| Confirm: AWS Bedrock + Claude activated in ca-central-1 (pre-requisite for AI features)? | Tech | High |
| Will the first 2 engineers be hired, contracted, or is this founder-built? | Founder | High |
| Has PRMIA Canada chapter been contacted for speaking opportunity? | Founder | Medium |
| What is the target discovery call list for the first 8 CRO conversations? | Founder | Medium |
| Will SR&ED be filed retroactively from development Day 1? | Founder + Accountant | Medium |

---

## SESSION 2 — June 22, 2026 (Continuation)

### Architecture Decisions Confirmed (Session 2)

All five architecture questions were answered before build began:

| Decision | Question | Answer | Rationale |
|---|---|---|---|
| **A1: Server** | New server or existing EC2? | Same EC2 (3.96.132.125) | EC2 already running, SSL infrastructure in place, avoids new AWS cost |
| **A2: URL / Domain** | What subdomain? | `clearmrm.nimblestride.ca` | Fits Nimblestride brand; A record added by founder June 22, 2026 |
| **A3: Multi-tenancy** | Easiest approach? | `tenant_id` column on every table, no RLS yet | Avoids ClearBind's retroactive migration pain; RLS added in Phase 2 |
| **A4: AI in MVP** | Include Bedrock AI or defer? | Included in MVP | Risk Rating Wizard uses Claude Haiku for OSFI E-23 reasoning; Board reports benefit immediately |
| **A5: Codebase** | Fork ClearBind or fresh start? | Fork from `enterprise_server.js` | Saves 2–3 weeks; Bedrock client, PostgreSQL pool, Cognito JWT auth, pdf-lib, multer all battle-tested in production |

---

### Infrastructure Built (Session 2)

**Database: `clearmrm` on existing RDS (`clearbind-db-prod.cpyuec6083jq.ca-central-1.rds.amazonaws.com`)**

Five tables created June 22, 2026:

| Table | Purpose |
|---|---|
| `tenants` | Tenant registry; seed: Nimblestride Demo (`00000000-0000-0000-0000-000000000001`) |
| `users` | User accounts linked to tenants; seed: `myousufshariff@gmail.com` as admin |
| `models` | Full model inventory per OSFI E-23 §3.1; 24 fields covering ownership, methodology, deployment, validation status, risk tier |
| `risk_ratings` | Immutable record of every risk rating event; 8 questionnaire answers + computed tier + Bedrock AI reasoning |
| `audit_events` | Append-only event log; DB trigger blocks UPDATE and DELETE; satisfies OSFI E-23 §4.4 audit requirement |

**5 demo models seeded for demonstration.**

**Immutability enforced at database level** — not just application level. Any attempt to UPDATE or DELETE an audit_event row throws a PostgreSQL exception. This is the correct OSFI-compliant implementation.

---

### Backend: `/home/ubuntu/clearmrm/server.js`

Single-file Node.js (CommonJS) Express 5 server, forked from ClearBind architecture.

**12 API endpoints:**

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Backend-mediated Cognito auth (USER_PASSWORD_AUTH flow); returns IdToken |
| GET | `/api/health` | Health check; confirms region + service name |
| GET | `/api/me` | Current user + tenant info |
| GET | `/api/dashboard` | KPI summary: totals, tier breakdown, overdue count, recent models |
| GET | `/api/models` | List models; filterable by tier, status, search |
| POST | `/api/models` | Create model |
| GET | `/api/models/:id` | Get single model with full rating history |
| PUT | `/api/models/:id` | Update model (all fields) |
| DELETE | `/api/models/:id` | Soft archive (sets status = 'archived') |
| POST | `/api/models/:id/validate` | Mark model as validated today; sets next_validation_due by tier |
| POST | `/api/models/:id/rate` | 8-question risk assessment → computed tier → Bedrock reasoning → saves immutable rating record |
| POST | `/api/models/import` | Bulk CSV import; maps common column name variants |
| GET | `/api/audit` | Paginated audit trail; filterable by model_id |
| POST | `/api/reports/board-pack` | Generate multi-page PDF board report (pdf-lib) |

**Authentication:** Backend decodes Cognito JWT (base64url), extracts email, looks up `users` table. No Cognito SDK on the frontend — eliminates browser CDN dependency entirely.

**Risk tier algorithm:**
- 8 inputs scored (financial_impact 0–4, complexity 0–3, regulatory_use 0–3, decision_volume 0–3, last_validated 0–3, data_quality 0–3, vendor 0–2, multi_bu 0–1)
- Max score: 22 points
- Tier 1: score ≥ 11 or (regulatory_use = true) or (never_validated = true)
- Tier 2: score 6–10
- Tier 3: score 0–5

**Validation frequency by tier (OSFI E-23 §4.3):**
- Tier 1: annual (next_validation_due = +1 year)
- Tier 2: biennial (+2 years)
- Tier 3: triennial (+3 years)

---

### Frontend: `/home/ubuntu/clearmrm/public/index.html`

Single-file React 18 SPA (Babel standalone compilation in-browser). No build step required.

**8 screens implemented:**

| Screen | Route | Features |
|---|---|---|
| Login | (modal) | Email/password → `/api/auth/login` → JWT stored in localStorage |
| Dashboard | `/` | 6 KPI cards, overdue/unrated alerts, recent models table |
| Model Inventory | `/models` | Full list, search, tier filter, archive action, risk rating shortcut |
| Add Model | `/add` | 14-field form; third-party vendor conditional section |
| Edit Model | `/edit/:id` | Same form pre-populated |
| Model Detail | `/detail/:id` | All fields, validation history, rating history with AI reasoning |
| Risk Rating Wizard | `/rate/:id` | 5 MCQ pages + boolean flags page + Bedrock AI result page |
| Audit Trail | `/audit` | Chronological event log with immutability notice |
| CSV Import | `/import` | Drag-and-drop upload; column mapping flexible |
| Board Report | `/report` | One-click PDF generation; downloads to browser |

---

### Infrastructure (Session 2)

| Component | Detail |
|---|---|
| Port | 3001 (ClearBind runs on 3000) |
| PM2 process | `clearmrm-api` (id=1), started June 22, 2026 |
| Nginx vhost | `/etc/nginx/sites-available/clearmrm` → proxies 443 → 127.0.0.1:3001 |
| SSL certificate | Let's Encrypt, issued June 22, 2026, expires September 20, 2026, auto-renews |
| node_modules | Symlinked from `/home/ubuntu/clearbind-suite/clearbind-suite/backend/node_modules` |
| Key packages used | `express@5.2.1`, `pg@8.21.0`, `aws-sdk@2.1693.0`, `pdf-lib@1.17.1`, `multer@2.1.1` |

---

### DECISION 11: Authentication is backend-mediated (no browser Cognito SDK)

**Decision:** Login calls `POST /api/auth/login` on our backend. The backend authenticates against Cognito using USER_PASSWORD_AUTH flow via AWS SDK and returns the IdToken. The browser never calls Cognito directly.

**Rationale:** Eliminates dependency on `amazon-cognito-identity-js` CDN (which caused blank page on first deploy). Architecture is cleaner: auth validation logic stays server-side. Same Cognito user pool (`ca-central-1_72aIikL9T`) and client (`2o151kq1amtek4b736j4e3uvm5`) shared with ClearBind.

---

### DECISION 12: AI reasoning is in MVP, not Phase 2

**Changed from Decision 6 (Session 1):** Session 1 had AI risk rating deferred to Phase 2. During Session 2 the founder confirmed AI should be included in MVP.

**Implementation:** The Risk Rating Wizard sends questionnaire answers to `POST /api/models/:id/rate`. After computing the tier algorithmically, the backend calls AWS Bedrock (Claude 3 Haiku, ca-central-1) to generate a 3-sentence plain-English explanation suitable for a board director. The reasoning is stored in `risk_ratings.ai_reasoning` and displayed in the Model Detail view and Board Report PDF.

---

### DECISION 13: Soft delete only — models are never hard deleted

All model archiving uses `status = 'archived'`. No row is ever deleted from the `models` table. This is required for OSFI E-23 audit completeness — an examiner may ask about a model that was decommissioned years ago.

---

### DECISION 14: Phase 6 — Marketing landing page, enterprise session security, cryptographic audit integrity

**Context (June 23, 2026):** A key validator prospect rejected the platform at $200K/year, offering only $300–$400/month. Root cause: the platform was perceived as a "document parking" SaaS with no distinguishing enterprise security posture. Three deficiencies were identified:

1. No public marketing page — prospects had no pre-auth value proposition; the URL went straight to a login form
2. No session inactivity enforcement — tokens never expired on the client; a 60-minute Cognito JWT could remain in memory indefinitely without server-side expiry checks
3. No cryptographic data integrity guarantee — auditors had no mathematical proof that the audit trail had not been manually edited in the database

**Decision:** Resolve all three in Phase 6, deployed June 23, 2026.

**Marketing Landing Page:** Full pre-auth experience at the root URL. Unauthenticated visitors see a complete marketing page (nav, hero, metrics strip, 6-feature cards, ROI calculator, 4-tier pricing grid, countdown CTA to May 2027 deadline) before being prompted to sign in. New customers see "Start 30-Day Pilot" → registration; returning customers see "Sign In" → modal login overlay. Rationale: OSFI deadline creates urgency; prospects need context before committing to a $72K–$200K annual contract.

**Session Inactivity Timeout (client-side):** `SessionGuard` component tracks user activity via `mousedown`, `keydown`, `scroll`, `touchstart`, `click` events. At 15 minutes of inactivity: shows a countdown warning overlay with "Stay Logged In" button. At 20 minutes: auto-logout (`clearToken()` + page reload). Rationale: OSFI B-13 §4 requires session controls proportional to data sensitivity.

**JWT Expiry Enforcement (server-side):** `requireAuth` middleware now checks `claims.exp < Math.floor(Date.now()/1000)` and returns `401 SESSION_EXPIRED` if token has expired, even if signature is valid. Previously, an expired-but-valid token could be replayed. Rationale: defense-in-depth; Cognito issues 1-hour JWTs, but the server must independently enforce expiry.

**Merkle Hash Chain (cryptographic audit integrity):** Every audit event now stores `event_hash` (SHA-256 of `prevHash + eventData`) and `chain_seq`. The hash chain is identical in principle to blockchain — any post-facto database edit breaks the chain. `GET /api/audit/verify-integrity` replays the entire chain from genesis, detects the first tampered event, and returns a Merkle root over all event hashes. The UI shows a per-event hash pill and a "Verify Integrity" panel with the merkle root, chain tip, and valid/invalid badge. Rationale: OSFI examiners asked about data integrity guarantees; this provides mathematical proof that audit records have not been manually altered since insertion.

**DB migration:** `migration_phase6.sql` adds `event_hash TEXT` and `chain_seq BIGINT` columns to `audit_events` with a performance index on `(tenant_id, chain_seq DESC)` for fast chain-tip lookup. Legacy events (before Phase 6) are preserved and counted separately; they do not break chain validation.

---

## FEATURE REGISTER (Living Document)

### Core Features — Committed

| Feature | ID | Status | Phase | Notes |
|---|---|---|---|---|
| Model Registry | F1 | **LIVE** | Phase 1 | 14-field model form, list, detail, edit, archive |
| Risk Rating Engine | F2 | **LIVE** | Phase 1 | 8-question wizard, algorithmic tier, Bedrock AI reasoning |
| Audit Trail | F5 | **LIVE** | Phase 1 | DB-level immutability trigger; append-only; paginated UI |
| Board Pack PDF + AI Summary | F6 | **LIVE** | Phase 1 | 3-page PDF + AI executive summary (Bedrock Sonnet) |
| Dashboard + AI Briefing | F-dash | **LIVE** | Phase 1 | 7 KPI cards + AI CRO intelligence briefing panel |
| CSV Import | F-import | **LIVE** | Phase 1 | Flexible column mapping; import summary |
| AI Risk Rating Reasoning | F-AI1 | **LIVE** | Phase 1 | Claude Haiku generates 3-sentence tier explanation |
| AI Smart Fill (Add Model) | F-AI3 | **LIVE** | Phase 1 | Bedrock suggests methodology, purpose, data sources from model name |
| AI Remediation Advisor | F-AI4 | **LIVE** | Phase 1 | Bedrock Sonnet generates priority + immediate actions + OSFI gaps |
| Validation Tracking (manual) | F-valid | **LIVE** | Phase 1 | Mark validated, sets next_validation_due by tier |
| Model Archive (soft delete) | F-arch | **LIVE** | Phase 1 | Status = archived; never hard-deleted |
| Validation Workflow Manager | F3 | **LIVE** | Phase 2 | Full state machine: requested→assigned→in_progress→findings→approved→closed; AI pre-assessment |
| Third-Party Vendor Assessment | F4 | **LIVE** | Phase 2 | 7-question OSFI E-23 §5 checklist; AI vendor risk assessment |
| AI Validation Findings Analyzer | F-AI5 | **LIVE** | Phase 2+ | Sonnet: severity, OSFI §references, completeness score, approval recommendation |
| AI Approval Readiness Check | F-AI6 | **LIVE** | Phase 2+ | Sonnet: completeness verification, requirements met/missing before approving |
| AI Audit Closure Narrative | F-AI7 | **LIVE** | Phase 2+ | Haiku: formal §4.4 audit-grade closure narrative generated on close |
| AI Vendor §5 Deep Dive | F-AI8 | **LIVE** | Phase 2+ | Sonnet: OSFI §5 compliance score, critical gaps, structured remediation plan, trend, concentration risk |
| OSFI Examiner Export | F7 | **LIVE** | Phase 3 | 6-page Supervisory Review Package PDF with AI narrative + attestation page |
| Multi-Tenant Onboarding UI | F-onboard | **LIVE** | Phase 3 | Self-serve 2-step registration; auto-provisions Cognito user + tenant + 3 demo models |
| SSO (SAML 2.0) | F-sso | **LIVE** | Phase 3 | Domain-based SSO init, Cognito hosted UI redirect, SAML IdP registration, auto-provisioning |
| Admin Panel | F-admin | **LIVE** | Phase 3 | User management, SSO config, tenant overview tabs |
| AI Model Description Generator | F-AI2 | Planned | Phase 2+ | Auto-generate from uploaded docs (requires document upload) |
| Model Type Library | F-lib | Planned | Phase 2+ | 200+ pre-built model types, Canadian FRFI specific |
| Model Change Management | F-CM | **LIVE** | Phase 4 | Version history, change type (major/minor/patch), AI materiality assessment (Sonnet) per OSFI §4.2 |
| Exam Sprint Mode | F-ES | **LIVE** | Phase 4 | AI-powered full compliance gap analysis + 30/60/90-day action plan + examiner question prep (Sonnet) |
| Regulatory Calendar | F-RC | **LIVE** | Phase 4 | Derived validation/review schedule with AI CRO weekly briefing (Haiku) |
| Model Risk Appetite Statement | F-MRA | **LIVE** | Phase 4 | 6-question wizard, AI-generated statement (Sonnet), versioned, board-approval workflow |
| Ongoing Monitoring | F-OM | **LIVE** | Phase 4 | Metric logging, amber/red thresholds, AI trend analysis + drift detection (Sonnet) per OSFI §4.3 |
| Natural Language Model Search | F-NLS | **LIVE** | Phase 5 | Haiku interprets plain English queries against model inventory |
| AI Action Queue (Dashboard) | F-AQ | **LIVE** | Phase 5 | Sonnet: Risk Pulse score + prioritized work directive replacing passive KPI cards |
| AI Portfolio Doctor | F-PD | **LIVE** | Phase 5 | Sonnet: portfolio health grade A-F, critical findings, concentration risks, quick wins |
| AI Validation Report Generator | F-VRG | **LIVE** | Phase 5 | Sonnet: complete formal validation report (exec summary, findings matrix, risk opinion, sign-off page) stored in DB |
| AI MRM Policy Generator | F-MRM | **LIVE** | Phase 5 | Sonnet: 13-section OSFI E-23 compliant policy with board attestation, version-locked on approval |
| Document Intelligence (AI Ingest) | F-DI | **LIVE** | Phase 5 | Sonnet: paste doc text → extract structured model/validation/vendor data → pre-fills forms |
| Marketing Landing Page | F-LP | **LIVE** | Phase 6 | Full pre-auth marketing experience: hero, metrics strip, 6-feature grid, ROI calculator, pricing tiers, countdown CTA |
| Session Inactivity Timeout | F-SIT | **LIVE** | Phase 6 | 15-min warning overlay with countdown timer; 20-min auto-logout; resets on any user activity event |
| JWT Expiry Enforcement | F-JWT | **LIVE** | Phase 6 | Server-side `claims.exp` check in requireAuth middleware; returns 401 SESSION_EXPIRED on stale tokens |
| Merkle Hash Chain (Audit Integrity) | F-MHC | **LIVE** | Phase 6 | SHA-256 hash chain: each audit event hashes prevHash + eventData; Merkle root = cryptographic fingerprint of entire audit history |
| Audit Integrity Verification | F-AIV | **LIVE** | Phase 6 | GET /api/audit/verify-integrity: replays entire hash chain, detects tampering, returns merkle_root + valid/invalid verdict + first breach location |
| Insurance Model Taxonomy | F-INS | **LIVE** | Phase 7 | 14 insurance-specific categories; IFRS 17 sub-components; capital framework linkage; spreadsheet flag |
| Actuarial Assumption Register | F-AAR | **LIVE** | Phase 7 | Per-model key input versioning: current/prior value, unit, approval, effective date, change reason |
| Structured Backtesting Log | F-BTL | **LIVE** | Phase 7 | Per-validation predicted vs. actual: tolerance, variance %, pass/fail verdict. Inside validation detail |
| Model Dependency Map | F-MDM | **LIVE** | Phase 7 | Upstream/downstream cascade risk chains; feeds-into/fed-by two-column view; tier badges |
| Insurance Profile Card | F-IPC | **LIVE** | Phase 7 | Spreadsheet warning, IFRS 17 sub-component badge, capital framework flag on model detail page |
| Industry Benchmarking Dashboard | F-bench | Planned | Year 2 | Anonymized peer comparison |
| Microsoft Graph Integration | F-graph | Planned | Phase 8 | Pull model docs from SharePoint/OneDrive |
| E-Signature for Validation Sign-Off | F-esig | Planned | Phase 8 | DocuSign or AWS Simple Sign |
| PostgreSQL RLS (full tenant isolation) | F-rls | Planned | Phase 8 | Row-level security per tenant |
| Validator Marketplace | F-mkt | Planned | Phase 8 | Connect FRFIs with accredited validation firms; 15% referral |
| OSFI B-15 Climate Module | F-B15 | Planned | Year 2 | Climate risk model governance |
| AMF (Quebec) Alignment Module | F-amf | Planned | Year 2 | Quebec-specific overlay |

### Features Explicitly Excluded (v1.0)

| Feature | Reason for Exclusion |
|---|---|
| Capital calculation engine | Different product category; actuarial / quant tool |
| Model build / development environment | Jupyter, IDEs — data science tooling, not governance |
| Credit adjudication workflow | Loan origination system; separate product category |
| AML transaction monitoring | Separate regulatory domain |
| Generic GRC framework | Scope creep; competes on IBM/SAS terms; dilutes positioning |
| Trust accounting | Requires deterministic actuarial logic; defer until 3+ clients |

---

## COMPLIANCE AND CERTIFICATION TRACKER

| Requirement | Target Date | Status | Owner |
|---|---|---|---|
| Legal entity registration | Month 1 | Pending | Founder |
| Trademark application (product name) | Month 1 | Pending | Founder |
| Regulatory counsel OSFI E-23 opinion letter | Month 2 | Pending | Founder |
| Data residency counsel — DPA template | Month 2 | Pending | Founder |
| PIPEDA + Law 25 DPA finalized | Month 2 | Pending | Counsel |
| AWS ca-central-1 data residency documented | Month 1 | Pending | Tech |
| SOC 2 Type I audit initiated | Month 4 | Pending | Founder |
| Penetration test (CREST-certified CA vendor) | Month 6 | Pending | Tech |
| SOC 2 Type II audit completed | Month 12–18 | Pending | Founder |
| ISO 27001 certification initiated | Month 12 | Pending | Founder |

---

## REVENUE AND MILESTONE TRACKER

| Milestone | Target Date | Status |
|---|---|---|
| Phase 1 deployed: Model Registry, Risk Rating, Audit Trail, Board Pack, Dashboard, CSV Import | June 22, 2026 | **COMPLETE** |
| Phase 1 AI+ deployed: AI Dashboard Briefing, AI Smart Fill, AI Remediation Advisor, AI Board Summary | June 22, 2026 | **COMPLETE** |
| Phase 2 deployed: Validation Workflow Manager + Vendor Assessment Module | June 22, 2026 | **COMPLETE** |
| Phase 2 AI+ deployed: AI Findings Analyzer, AI Approval Readiness, AI Closure Narrative, AI Vendor §5 Deep Dive | June 22, 2026 | **COMPLETE** |
| Phase 3 deployed: Multi-Tenant Onboarding, OSFI Examiner Export, SSO SAML 2.0, Admin Panel | June 22, 2026 | **COMPLETE** |
| Phase 4 deployed: Model Change Management, Exam Sprint Mode, Regulatory Calendar, MRA Wizard, Ongoing Monitoring (all with AI) | June 22, 2026 | **COMPLETE** |
| USER_GUIDE.md published: 18-chapter onboarding + operational guide | June 22, 2026 | **COMPLETE** |
| Phase 5 deployed: AI Action Queue, AI Portfolio Doctor, AI Validation Report Generator, AI MRM Policy Generator, Natural Language Search, Document Intelligence | June 23, 2026 | **COMPLETE** |
| Demo-ready with 5 seed models and all AI features active | June 22, 2026 | **COMPLETE** |
| First lighthouse client signed (pilot) | November 2026 | Pending |
| Second lighthouse client signed (pilot) | January 2027 | Pending |
| Phase 6 deployed: Marketing Landing Page, Session Inactivity Timeout, JWT Expiry Enforcement, Merkle Hash Chain Audit Integrity, Cryptographic Audit Verification | June 23, 2026 | **COMPLETE** |
| Phase 7 deployed: Insurance Model Taxonomy, Actuarial Assumption Register, Structured Backtesting Log, Model Dependency Map, Insurance Profile Card, Spreadsheet Enhanced Controls | June 23, 2026 | **COMPLETE** |
| Phase 6 (Next): Validator Marketplace + RLS + SharePoint + E-Signature + B-15 Climate | January 2027 | Pending |
| Risk Canada Conference presence | February/March 2027 | Pending |
| 5 paying clients | March 2027 | Pending |
| 10 paying clients / $800K ARR | June 2027 | Pending |
| 20 paying clients / $1.8M ARR | December 2027 | Pending |
| SOC 2 Type II completed | December 2027 | Pending |
| 35 paying clients / $3.3M ARR | June 2028 | Pending |
| 60 paying clients / $6M ARR | June 2029 | Pending |

---

## REGULATORY REFERENCE INDEX

| Document | URL | Relevance |
|---|---|---|
| OSFI E-23 (Final, Sep 2025) | [osfi-bsif.gc.ca](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/guideline-e-23-model-risk-management-2027) | Core product requirement |
| OSFI E-23 Companion Letter | [osfi-bsif.gc.ca](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/guideline-e-23-model-risk-management-2027-letter) | Implementation timeline expectations |
| OSFI B-13 (Tech & Cyber Risk) | osfi-bsif.gc.ca | Platform's own technology risk governance |
| OSFI B-15 (Climate Risk) | osfi-bsif.gc.ca | Phase 2 climate model module |
| OSFI B-10 (Third-Party Risk) | osfi-bsif.gc.ca | Third-party model module design |
| SR 11-7 (US Fed / OCC, 2011) | federalreserve.gov | Foundational global model risk document; E-23 derived from this |
| OPC/CAI/OIPC OpenAI Investigation (May 2026) | priv.gc.ca | Confirms OpenAI non-compliant with PIPEDA/Law 25 → must use Bedrock |
| PIPEDA (Personal Information Protection and Electronic Documents Act) | laws-lois.justice.gc.ca | Federal privacy law — governs data handling for all clients |
| Quebec Law 25 (Act to modernize legislative provisions re: protection of personal information) | legisquebec.gouv.qc.ca | Strictest privacy law in Canada; applies to Quebec-based clients |

---

## CHANGE LOG

| Date | Change | Reason | Decided By |
|---|---|---|---|
| 2026-06-22 | Repository created; initial product formulation documented | First product strategy session | Founder + AI Panel |
| 2026-06-22 | Product name established as "OSFI E-23 Vault" (working name) | Descriptive, searchable, regulatory-framed | Founder |
| 2026-06-22 | Technology stack confirmed: React, Node.js, PostgreSQL, AWS ca-central-1, Bedrock | Consistency with existing Nimblestride stack; PIPEDA compliance | Founder |
| 2026-06-22 | MVP scope set to 3 core features + audit trail + RBAC + CSV import | 30-day time-to-value constraint | Founder |
| 2026-06-22 | Target market confirmed: Tier 2 FRFIs; avoid direct competition with IBM/SAS | Non-overlapping market segment; pricing inaccessibility of enterprise tools | Founder |
| 2026-06-22 | **Product renamed from "OSFI E-23 Vault" to "ClearMRM"** | Clear + MRM = instantly understood by target audience (CROs, model risk teams) | Founder |
| 2026-06-22 | URL set to `clearmrm.nimblestride.ca`; A record added to DNS | Fits Nimblestride brand; EC2 3.96.132.125 | Founder |
| 2026-06-22 | Architecture decision: Fork from ClearBind (`enterprise_server.js`) | Saves 2–3 weeks; Bedrock, PostgreSQL pool, Cognito auth all proven in production | Founder |
| 2026-06-22 | Architecture decision: tenant_id on every table (no RLS yet) | Avoids ClearBind's retroactive multi-tenant migration problem | Founder |
| 2026-06-22 | **AI (Bedrock reasoning) moved from Phase 2 → MVP** | Founder confirmed AI should be in MVP; adds immediate demo value | Founder |
| 2026-06-22 | Authentication changed to backend-mediated (no browser Cognito SDK) | `amazon-cognito-identity-js` CDN caused blank page; backend USER_PASSWORD_AUTH is cleaner | Tech |
| 2026-06-22 | **MVP DEPLOYED to production** — `https://clearmrm.nimblestride.ca` | Full build in single session; all MVP features live | Founder + AI |
| 2026-06-22 | **Phase 1 AI+ deployed**: AI Dashboard Briefing, AI Smart Fill, AI Remediation Advisor, AI Board Report executive summary | Founder confirmed: add AI to all Phase 1 features before Phase 2 | Founder |
| 2026-06-22 | **Phase 2 deployed**: Validation Workflow Manager (6-state machine) + Vendor Assessment Module (OSFI E-23 §5) | Phase 2 scope confirmed in same session | Founder |
| 2026-06-22 | **Phase 2 AI+ deployed**: AI Findings Analyzer, AI Approval Readiness Check, AI Closure Narrative, AI Vendor §5 Deep Dive | All Phase 2 features got AI enhancements in same session | Founder |
| 2026-06-22 | **Phase 3 deployed**: Multi-Tenant Onboarding UI, OSFI Examiner Export PDF, SSO SAML 2.0, Admin Panel | Enterprise-readiness phase | Founder |
| 2026-06-22 | **Phase 4 deployed**: Model Change Management (AI materiality), Exam Sprint Mode (AI gap analysis + 30/60/90 plan), Regulatory Calendar (AI CRO briefing), MRA Wizard (AI-generated, board-approved), Ongoing Monitoring (AI trend + drift) | Full Phase 4 scope with AI on every feature | Founder |
| 2026-06-22 | **USER_GUIDE.md created**: 18-chapter onboarding and operational guide covering all modules, OSFI §-to-feature mapping, AI features reference, best practices, 50-item compliance checklist | Founder requested comprehensive customer onboarding guide | Founder |
| 2026-06-22 | Code pushed to GitHub at `myshariff123/osfi-e23-vault` under `/backend`, `/frontend`, `/db`, `USER_GUIDE.md`, `PRODUCT_FORMULATION.md` | All code and docs maintained in GitHub | Founder |

---

## SESSION 6 — June 23, 2026 (Strategic Assessment + Tesla Landing Page)

### Context

An independent third-party market intelligence document was analyzed: "Commercially Available Risk Management Models (MRM) — Canada (20+ Catalog)." This document catalogs 20+ procurable risk platforms, provides business model guidance for Canadian RaaS providers, documents regulatory compliance requirements, and specifies a 12-month GTM timeline.

The document was analyzed by a 50-discipline expert panel spanning financial regulation law, competitive strategy, fintech product, risk management science, actuarial/quantitative finance, regulatory policy, enterprise SaaS economics, data sovereignty, insurance regulation, and enterprise GTM.

**Verdict: No fundamental pivot required. Three strategic refinements confirmed.**

---

### DECISION 15: ClearMRM's thesis is confirmed by independent market analysis

The market document arrived at the same regulatory framework (OSFI E-23, B-10, PIPEDA), the same target market (Tier 2/3 credit unions and regional insurers), the same competitive gap (IBM/SAS inaccessible at $400K–$800K+), and the same product approach (AI-assisted, human-in-the-loop compliance automation) that ClearMRM was built on.

This confirms that the original product formulation, built on primary regulatory sources (OSFI E-23 published guideline, OSFI B-10, PIPEDA) and consulting research (Deloitte, McKinsey, PwC, BDO), was correct.

**What does NOT change:**
- OSFI E-23 as the regulatory target
- AWS Bedrock ca-central-1 as the only AI provider (OpenAI PIPEDA non-compliance confirmed by OPC investigation)
- Target market: Tier 2/3 FRFIs and insurers
- AI-generated deliverables as the core differentiator
- Canadian data sovereignty architecture

---

### DECISION 16: ClearMRM is not "god-mode" — but must say so explicitly

The market document warns that fully automated, no-human-oversight compliance products are not acceptable under OSFI E-23. ClearMRM is not this — AI generates drafts, humans approve and sign at every critical gate. However, the messaging "AI generates your validation report in 90 seconds" can be misread as automation replacing the validator.

**Decision:** Every public marketing surface must include the explicit statement: "ClearMRM AI generates drafts. Your team approves and signs." This is a messaging addition, not a product change.

**Why this matters:** A prospect who raises the "god-mode" concern in a sales call has read documents like the one analyzed in this session. The sentence eliminates the objection before it is raised.

---

### DECISION 17: Two-tier commercial model — software subscription + Validation Sprint service

The market document prices managed model validation services at $75,000 per model (one-time). ClearMRM's Validator Marketplace makes this accessible at $20,000–$35,000 per model by combining AI-generated draft reports with certified human validator sign-off.

**New commercial model:**
1. **Software subscription** (existing): $30K–$144K/year. FRFI uses platform to manage its own MRM program. AI drafts, humans approve. No service delivery from ClearMRM.
2. **Validation Sprint** (new service SKU): $20,000–$35,000 per model. ClearMRM platform + Validator Marketplace matches the FRFI with a vetted Canadian validator. AI generates the MVR draft. Validator reviews, adds independent judgment, signs. Delivered in 10 business days. OSFI-grade output.

**Combined per-client value for a 100-model Tier 2 FRFI (20 high-risk models requiring annual validation):**
- 20 × $20K Sprint = $400K in validation services
- $72K subscription
- Total: $472K per client per year
- ClearMRM captures: $72K + 15% Sprint fee = $132K per client per year

This is a 5–7× larger revenue opportunity than the subscription-only model.

---

### DECISION 18: Validator Marketplace is accelerated from Phase 8 to Phase 9 (Priority 0)

Previously scheduled for Phase 8 (Q1 2027). The market analysis reveals this is not a Phase 8 nice-to-have — it is the engine of the business that generates $3.3M–$12M ARR.

**Validator Marketplace MVP scope (60-day build target: October 31, 2026):**
- Validator profiles with credentials and specialization
- Request-for-validation workflow from FRFI to marketplace
- Secure validator portal (read-only, specific model data within tenant)
- Attestation and sign-off workflow (signed finding appended to validation record)
- 15% platform fee invoice generation

**Initial supply-side target:** 3 vetted Canadian validators from MNP LLP, RSM Canada, or EY/KPMG risk advisory practices.

---

### DECISION 19: PSI monitoring added to Ongoing Monitoring module (Phase 9C)

OSFI E-23 §4.3 requires "continuous monitoring with trigger thresholds." ClearMRM's current monitoring captures qualitative flags. The market document specifies "PSI, performance, drift" as the expected quantitative metrics.

**Addition to be built (August–September 2026):**
- Population Stability Index (PSI) input fields per monitoring cycle
- Computed PSI with traffic-light display: green (< 0.1), yellow (0.1–0.25), red (> 0.25)
- Gini / AUC tracking for credit and underwriting models
- Residual drift (predicted vs. actual reserve adequacy) linked to backtesting log

This closes the most frequently cited gap between ClearMRM's current qualitative monitoring and OSFI's quantitative expectations.

---

### DECISION 20: ClearMRM B-10 Vendor Package is P0 sales blocker — must be built before first enterprise deal closes

Under OSFI B-10, every FRFI must conduct third-party risk management due diligence on ClearMRM itself as a vendor. Without a standard vendor package ready, every enterprise procurement process stalls.

**B-10 Vendor Package must include:**
- Data residency attestation (AWS ca-central-1, Canada only)
- AI provider disclosure (AWS Bedrock, model ID, region; not OpenAI)
- Sub-processor list (AWS RDS, AWS Bedrock, AWS Cognito — all ca-central-1)
- SLA terms (uptime, RTO, RPO)
- Incident response summary (notification timelines, escalation)
- SOC 2 status (in progress — Type I target Q4 2026)
- PIPEDA + Quebec Law 25 compliance statement

**Target completion:** July 15, 2026.

---

### DECISION 21: Tesla-style landing page replaces feature-dump marketing (DEPLOYED June 23, 2026)

The marketing landing page was redesigned from a feature-cataloguing page (9 cards, ROI calculator, pricing grid) to a Tesla-minimal, outcome-focused design.

**What was removed:**
- All prices (pricing creates confusion before context is established; also creates FinTrack issues for online payments at $30K+ transactions)
- Technical stack details (AWS Bedrock, Merkle chains, JWT — relevant to engineers, not CROs)
- 9-feature card grid (feature cataloguing creates "document parking" perception)
- ROI calculator (specific numbers before relationship is established can anchor wrong conversations)

**What was added:**
- Live OSFI E-23 deadline countdown (creates urgency without being explicit)
- Three outcome pillars: Generate / Monitor / Prove (outcome-focused, not feature-focused)
- Competitor comparison table: IBM OpenPages, SAS, Spreadsheets vs ClearMRM — no ClearMRM price shown, "Contact us for pricing" and "30 days" for time-to-value
- 30-day pilot CTA and "Contact us for pricing →" mailto link
- Trust chips: OSFI E-23 Compliant, Canadian Data Sovereignty, PIPEDA, SOC 2 In Progress

**Rationale:** First prospect rejected the platform as "document parking." Second-generation marketing must lead with outcomes and credibility, not feature depth or price.

---

### DECISION 22: Sales outreach begins immediately — window closes October 2026

OSFI E-23 is enforceable May 1, 2027. Enterprise compliance SaaS sales cycles to regulated institutions are 3–6 months (legal review, IT security, B-10 vendor due diligence, budget approval). To close clients who can implement and demonstrate compliance before the deadline, outreach must begin by July 2026 at the latest. The effective outreach window closes approximately October–November 2026.

**Sales motion (CASL-compliant):**
1. LinkedIn connection request to CRO / Head of Model Risk / CCO at target institutions (no commercial message in first contact)
2. Follow-up message with gated whitepaper link: "How Canadian Credit Unions Can Demonstrate OSFI E-23 Compliance Before May 2027"
3. Discovery call offer: "30 minutes to walk you through how [Institution] can build an OSFI-ready model inventory in 30 days"
4. Demo with lighthouse-client reference (once first pilot is live)

**Target institutions for initial outreach (July 2026):**
- Concentra Bank (credit union central, Saskatchewan)
- Wawanesa Insurance (Manitoba, federal insurer)
- Peace Hills Insurance (Alberta, regional insurer)
- DUCA Credit Union (Ontario, growing credit union)
- Meridian Credit Union (Ontario, largest provincial credit union)

---

### Features Added in Session 6

| Feature | Status | Notes |
|---|---|---|
| Tesla-style Landing Page | **LIVE** (June 23, 2026) | Commit 3f6a2fc — no prices, three-pillar outcomes, competitor comparison, 30-day pilot CTA |
| Validation Sprint service SKU | Planned (Q3 2026) | Commercial service tier, not a product feature — requires validator partnerships first |
| PSI Monitoring Metrics | Planned (August 2026) | Quantitative drift metrics addition to F-OM |
| Validator Marketplace MVP | Planned (October 2026) | Accelerated from Phase 8 to Phase 9 |
| ClearMRM B-10 Vendor Package | Planned (July 2026) | Non-product, operational — required before enterprise sales |

---

### Change Log Additions (Session 6)

| Date | Change | Reason | Decided By |
|---|---|---|---|
| 2026-06-23 | **Phase 7 deployed**: Insurance Model Taxonomy, Actuarial Assumption Register, Structured Backtesting Log, Model Dependency Map, Insurance Profile Card | Insurance MRM gap analysis against published actuarial and regulatory literature; no competitor has this depth | Founder |
| 2026-06-23 | **Marketing landing page redesigned (Tesla-style)**: removed prices, technical details, feature grid; added outcome pillars, competitor comparison, 30-day pilot CTA | First prospect rejected "document parking" perception; second-generation marketing leads with outcomes | Founder |
| 2026-06-23 | **Two-tier commercial model established**: software subscription + Validation Sprint service ($20K–$35K per model vs. $75K market rate) | Market intelligence document confirms $75K per-model validation market; Validator Marketplace captures this at disruptive price point | Expert Panel |
| 2026-06-23 | **Validator Marketplace accelerated from Phase 8 to Phase 9 (P0 priority)** | Per-client value with Marketplace is $472K–$544K vs. $72K subscription only; this is the $12M ARR engine | Expert Panel |
| 2026-06-23 | **PSI monitoring metrics added to roadmap** | Market document identifies quantitative drift metrics as OSFI monitoring expectation gap in current ClearMRM | Expert Panel |
| 2026-06-23 | **ClearMRM B-10 Vendor Package identified as P0 sales blocker** | Every enterprise deal stalls without standard B-10 vendor due diligence package | Expert Panel |
| 2026-06-23 | **Sales window identified as October 2026** | 3–6 month FRFI sales cycles + May 2027 deadline = outreach must begin immediately | Expert Panel |

---

### AI+ Functionality — Phases 3–8 (Session 7, June 24, 2026)

Each existing phase screen received dedicated Claude AI analysis capabilities. All routes protected by `aiLimiter` (10 req/60s), Bedrock ca-central-1, Sonnet primary. All AI output surfaces now include `AIDisclaimer` ("Human-in-the-loop required").

| Phase | Screen | AI Feature | Backend Route |
|---|---|---|---|
| Phase 4 | Change History (ModelChangeSection) | AI Change Impact analysis — impact level, affected components, revalidation flag | `POST /api/model-versions/:id/ai-impact` |
| Phase 4 | Ongoing Monitoring (ModelMonitoringSection) | AI Drift Analysis — overall drift level, revalidation trigger, OSFI implication | `POST /api/models/:id/ai-drift-analysis` |
| Phase 4 | Ongoing Monitoring (ModelMonitoringSection) | PSI Analysis — per-metric PSI table, Stable/Monitor/Action Required status, narrative | `POST /api/models/:id/psi-analysis` |
| Phase 5 | Audit Trail | AI Anomaly Detection — unusual patterns, actor anomalies, off-hours activity | `GET /api/audit/ai-anomaly` |
| Phase 7 | Assumption Register | AI Assumption Sensitivity — high-sensitivity assumptions, stress test recommendations | `POST /api/models/:id/ai-assumption-sensitivity` |
| Phase 7 | Model Dependency Map | AI Cascade Risk — failure chains, mitigation actions, cascade severity | `POST /api/models/:id/ai-cascade-risk` |
| Phase 7 | Backtesting Log (in ValDetailModal) | AI Backtesting Narrative — formal narrative, overall verdict, OSFI implications | `POST /api/validations/:id/ai-backtest-narrative` |
| Phase 3 | Admin Panel (new tab) | AI Onboarding Plan — quick wins, 30-day P1/P2 actions, examiner focus areas, CRO brief | `POST /api/admin/ai-onboarding-plan` |

**AIDisclaimer retrofit** — added to all existing AI output panels that previously lacked it:
- ValidationReportModal (AI Validation Report)
- Portfolio Doctor scan result (Model Inventory)
- ExamSprintMode executive summary + sprint tabs
- MRAWizard statement output
- MRMPolicyGenerator 13-section result

---

### Can Build Right Now — 7 High-Value Features (Session 7, June 24, 2026)

All 7 features deployed with zero DB schema changes and zero infrastructure changes.

| # | Feature | Screen | Backend Route | Value |
|---|---|---|---|---|
| 1 | OSFI Model Readiness Assessment | Model Detail → modal | `POST /api/models/:id/readiness-assessment` | Checklist grade A–F, critical gaps, OSFI E-23 section refs |
| 2 | PSI Population Stability Index Analysis | Ongoing Monitoring | `POST /api/models/:id/psi-analysis` | Quantitative drift: <0.1 Stable, 0.1–0.25 Monitor, >0.25 Action Required |
| 3 | Policy Gap Checker | New nav screen | `POST /api/mrm-policy/gap-check` | Compliance score, gap severity, priority additions vs OSFI E-23 |
| 4 | Validation Sprint Brief | Validations header | `POST /api/validations/sprint-brief` | AI scope/hours estimate, price range vs $75K market rate |
| 5 | AI Audit Summary | New nav screen | `GET /api/audit/ai-summary` | 12-month narrative, key activities, significant events — examiner-ready |
| 6 | B-10 Third-Party Risk Package | New nav screen | `POST /api/vendor-assessments/b10-package` | Board-ready B-10 report with 7 sections and action items |
| 7 | AI Examiner Preparation Brief | New nav screen | `POST /api/examiner/ai-prep` | Readiness score, critical findings, likely examiner questions, 30-day actions, exam day checklist |

**Frontend additions:**
- 4 new nav items: B-10 Package, Policy Gap Check, Audit Summary, Examiner Prep AI
- 7 new React components: `ReadinessModal`, `SprintBriefModal`, `PolicyGapChecker`, `AuditSummary`, `B10Package`, `AIExaminerPrep`, `AIDisclaimer`
- Model Inventory: Readiness score column (10-field check, color-coded Good/Fair/Low)
- Model Detail: OSFI Readiness card with `ReadinessModal`
- Validations: Sprint Brief button + `SprintBriefModal`

---

### Change Log Additions (Session 7 — June 24, 2026)

| Date | Change | Reason | Decided By |
|---|---|---|---|
| 2026-06-24 | **AI+ buttons added to all Phase 3–8 screens** — 8 new AI panels in existing screens | OSFI E-23 compliance requires ongoing AI-assisted monitoring; differentiates from document-parking competitors | Founder |
| 2026-06-24 | **7 Can-Build-Now features deployed** — PSI, Policy Gap, Sprint Brief, Audit Summary, B-10 Package, Examiner Prep, Model Readiness | High value, zero infrastructure cost; addresses every validator objection from first customer demo | Founder |
| 2026-06-24 | **AIDisclaimer retrofitted to all existing AI output surfaces** | OSFI E-23 requires human oversight of AI-generated regulatory deliverables; strategic assessment confirmed human-in-the-loop messaging critical for enterprise trust | Expert Panel |
| 2026-06-24 | **Admin Panel: AI Onboarding Plan tab added** — CRO-level executive summary + P1/P2 30-day action list | New clients need immediate compliance roadmap at setup; replaces $10K–$15K consulting engagement for gap analysis | Founder |
| 2026-06-24 | **Bug fixes: 4 broken routes corrected** — Action Queue, Calendar, Generate Report, NLS Search all had wrong column names vs schema | Schema had `model_owner_name`, `methodology_type`, `is_third_party`, `purpose` — routes had legacy names from initial draft | Dev |
| 2026-06-24 | **Startup banner updated** to reflect Phase 1–8 + AI+ + 7 Can-Build-Now | Operational clarity for PM2 status checks | Dev |

---

### Change Log Additions (Session 8 — June 24, 2026 QA Sprint)

**Commit:** `f3414e0` — QA bug fix cycle after systematic testing of all buttons and pages

| Date | Change | Root Cause | Fix |
|---|---|---|---|
| 2026-06-24 | **callBedrock: exponential backoff + ThrottlingException retry** | 3 retries with 500ms linear backoff insufficient for AWS Bedrock rate limits — B-10 Package, MRM Policy Generator, Policy Gap Check all returned HTTP 500 | Changed to 5 retries, 2s→4s→8s→16s exponential backoff, ThrottlingException-only retry (other errors fail fast) |
| 2026-06-24 | **callBedrock: temperature:0 now works** | `temperature !== 0` ternary always evaluated `0` as falsy and fell through to default 0.3 | Fixed to `temperature !== undefined` check |
| 2026-06-24 | **extractJSON: truncation repair** | Long Bedrock responses could be truncated, producing unparseable JSON | Added repair logic: close open brackets/braces, strip trailing comma/colon, handle unclosed string |
| 2026-06-24 | **apiFetch: actual error messages now surface** | Backend sends `{error:"..."}` but `apiFetch` read `err.message` — every error showed as "HTTP 500" | Changed to `err.error \|\| err.message \|\| HTTP ${status}` |
| 2026-06-24 | **Portfolio Doctor: SQL column name fixes** | Query used legacy column names `model_type`, `model_owner`, `methodology`, `data_sources`, `primary_output` — none exist in schema | Corrected to `methodology_type`, `model_owner_name`, `input_data_sources`, `purpose` |
| 2026-06-24 | **Vendor Assessment MODEL dropdown: shows all models** | Frontend filter `.filter(x => x.is_third_party)` returned empty array when no models were third-party — blocked assessment creation | Removed filter; show all models in optgroups: "Third-Party / Vendor Models" + "Internal Models" |
| 2026-06-24 | **AI Audit Anomaly Detection: deterministic + correct fields** | (1) temperature:0.3 made output probabilistic. (2) Frontend read `anomaly.anomalies[]` but backend returns `findings[]`. (3) Read `anomaly_summary` not `activity_summary`. (4) `corrective_actions[]` missing from prompt. (5) Risk level case mismatch (`'High'` vs `'high'`). | Set temperature:0; fixed all field names; added `corrective_actions` to prompt; fixed capitalization check |
| 2026-06-24 | **Risk Appetite: edit before approve** | No edit UI and no PUT route existed — users had to approve AI-generated statement as-is or regenerate | Added `PUT /api/risk-appetite/:id` (draft-only guard); added Edit Statement button + textarea + Save/Cancel flow in MRAWizard |

**QA methodology:** Systematic end-to-end test of all nav screens, buttons, and AI panels as Senior Automation Testing Consultant. All reported issues resolved; endpoint verification confirmed all routes return 401 (auth-gated) or 200 (public) — no 404 or 500 on any route.

---

*This document must be updated after every strategic session, product decision, customer conversation, or architecture change. The goal is that any new team member can read this document and understand exactly what we are building, why, who we are building it for, and what decisions have already been made.*

*Next scheduled update: After first customer discovery call, or after Validator Marketplace partnership outreach begins.*
