# ClearMRM — Product Formulation Log

> This document is the living record of all strategic decisions, product definitions, feature choices, and rationale established during the formulation of ClearMRM. It serves as the guiding star for all future development decisions. Every significant decision recorded here should be treated as a binding product principle unless explicitly revisited and updated with the date of change and reason.

**Project Start:** June 22, 2026
**Last Updated:** June 22, 2026
**Status:** MVP LIVE — `https://clearmrm.nimblestride.ca`

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

## FEATURE REGISTER (Living Document)

### Core Features — Committed

| Feature | ID | Status | Phase | Notes |
|---|---|---|---|---|
| Model Registry | F1 | **LIVE** | MVP | 14-field model form, list, detail, edit, archive |
| Risk Rating Engine | F2 | **LIVE** | MVP | 8-question wizard, algorithmic tier, Bedrock AI reasoning |
| Audit Trail | F5 | **LIVE** | MVP | DB-level immutability trigger; append-only; paginated UI |
| Board Pack PDF Generator | F6-basic | **LIVE** | MVP | 3-page PDF: cover KPIs, full inventory table, Tier 1 detail |
| Dashboard KPIs | F-dash | **LIVE** | MVP | 6 KPI cards, overdue alerts, unrated alerts, recent models |
| CSV Import (Excel migration) | F-import | **LIVE** | MVP | Flexible column mapping; import summary with counts |
| AI Risk Reasoning (Bedrock) | F-AI1 | **LIVE** | MVP | Moved from Phase 2; Claude Haiku, ca-central-1 |
| Validation Tracking | F-valid | **LIVE** | MVP | Mark validated, sets next_validation_due by tier |
| Model Archive (soft delete) | F-arch | **LIVE** | MVP | Status = archived; never hard-deleted |
| Validation Workflow Manager | F3 | Planned | Phase 2 | Scheduling, assignment, sign-off, escalation |
| Third-Party / Vendor Module | F4 | Planned | Phase 2 | Vendor model inventory, assessment, change notifications |
| OSFI Examiner Export | F7 | Planned | Phase 3 | Purpose-built Supervisory Review response format |
| AI Model Description Generator | F-AI2 | Planned | Phase 2 | Auto-generate model description from uploaded docs |
| Model Type Library | F-lib | Planned | Phase 2 | 200+ pre-built model types, Canadian FRFI specific |
| Natural Language Model Search | F-NLS | Planned | Phase 3 | Search model inventory in plain English |
| Industry Benchmarking Dashboard | F-bench | Planned | Year 2 | Anonymized peer comparison |
| Microsoft Graph Integration | F-graph | Planned | Phase 2 | Pull model docs from SharePoint/OneDrive |
| E-Signature for Validation Sign-Off | F-esig | Planned | Phase 2 | DocuSign or AWS Simple Sign |
| Multi-Entity / Multi-Tenant (full RLS) | F-mt | Planned | Phase 2 | Separate inventories per legal entity under one parent org |
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
| MVP deployed to production (`clearmrm.nimblestride.ca`) | June 22, 2026 | **COMPLETE** |
| Demo-ready with 5 seed models and working risk rating | June 22, 2026 | **COMPLETE** |
| First lighthouse client signed (pilot) | November 2026 | Pending |
| Second lighthouse client signed (pilot) | January 2027 | Pending |
| Phase 3 General Availability launch | January 2027 | Pending |
| Risk Canada Conference presence | February/March 2027 | Pending |
| 5 paying clients | March 2027 | Pending |
| OSFI Examiner Export module released | April 2027 | Pending |
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

---

*This document must be updated after every strategic session, product decision, customer conversation, or architecture change. The goal is that any new team member can read this document and understand exactly what we are building, why, who we are building it for, and what decisions have already been made.*

*Next scheduled update: After first customer discovery call, or after any Phase 2 feature work begins.*
