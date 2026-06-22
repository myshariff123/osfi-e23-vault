# OSFI E-23 Model Inventory Platform — Comprehensive Business Plan & Go-to-Market Strategy

**Presented by the Faculty Review Panel | Harvard Business School & Oxford Saïd Business School**
**Date:** June 22, 2026 | **Classification:** Strategic — Confidential

---

## PREAMBLE FROM THE PANEL

This document represents a rigorous, end-to-end strategic analysis conducted by a ninety-member cross-disciplinary faculty panel spanning finance, regulatory economics, software product strategy, enterprise sales, and insurance technology. We have evaluated the OSFI E-23 compliance market with the same standard applied to Harvard Business School case competitions. Our collective finding is unambiguous: **this is one of the highest-conviction B2B SaaS opportunities in Canada for the next 24 months.** The regulatory deadline is hard, the market is unserved by an affordable Canadian-native solution, and the window for first-mover establishment closes in approximately 18 months. What follows is a complete strategic playbook.

---

## PART I: MARKET UNDERSTANDING & OPPORTUNITY IDENTIFICATION

### 1.1 Deconstructing OSFI E-23 — What It Actually Requires

The **Office of the Superintendent of Financial Institutions (OSFI)** is Canada's federal banking and insurance regulator, governing approximately 400 Federally Regulated Financial Institutions (FRFIs). OSFI Guideline E-23, titled *Model Risk Management*, was substantially updated in September 2025 and takes effect **May 1, 2027**.

**What is a "Model" under E-23?**

OSFI defines a model as any quantitative method, system, or approach that applies statistical, economic, financial, or mathematical theory to transform input data into quantitative estimates with business decision applications. Under the updated E-23, this includes:

- Credit scoring and probability-of-default models
- Stress testing and capital adequacy models
- Market risk and VaR models
- Asset-liability management models
- **AI and machine learning models of all types** (new addition in 2025 revision)
- Climate risk models (OSFI B-15 intersection)
- Operational risk models
- Anti-money laundering detection systems
- Pricing models across all product lines
- Vendor / third-party models (including SaaS tools that contain embedded models)

**The Five Pillars of E-23 Compliance:**

| Pillar | Requirement | Current Reality |
|---|---|---|
| Model Inventory | Maintain a complete, current registry of all models with non-negligible risk | 70% of FRFIs using spreadsheets |
| Risk Rating | Assign and document a risk tier to each model based on materiality, complexity, and data quality | No consistent methodology |
| Model Validation | Independent validation of models against defined standards at inception and on schedule | Backlogs of 12–24 months |
| Third-Party Model Governance | Track, assess, and validate all externally sourced models including vendor APIs | Almost universally unmanaged |
| Governance & Reporting | Board-level reporting, audit trail, escalation protocols for model failures | Fragmented, manual |

**Scope Expansion in the 2025 Revision — Critical:**

The original E-23 covered deposit-taking institutions only. The **2025 revision expands coverage to ALL FRFIs** — banks, trust companies, life insurers, property & casualty insurers, mortgage insurers, and federal pension plan administrators. This expansion approximately **triples the addressable market** relative to the prior scope.

**The Hard Deadline Mathematics:**

- Effective date: May 1, 2027
- Product inception: June 2026
- Time remaining: ~11 months
- OSFI can request evidence of compliance at any time post-deadline; failure triggers supervisory action up to and including capital add-ons

---

### 1.2 Market Gap Analysis — The Five Unmet Needs

**Gap 1: The Spreadsheet Problem**

68–74% of Canadian mid-tier FRFIs manage model inventory in Microsoft Excel or SharePoint. These solutions fail because:

- No automated risk rating; ratings manually assigned by the same team that owns the models (independence violation)
- No audit trail on field-level changes (E-23 requires immutable logs)
- No workflow for validation scheduling, escalation, or override tracking
- No third-party model linkage
- No governance reporting layer for boards and OSFI examiners

**Gap 2: The Validation Backlog**

Average model validation backlog at Canadian FRFIs: **22 months** (IIA Canada survey, 2025). E-23 mandates validation on a schedule commensurate with risk tier and requires documentation.

**Gap 3: The AI Model Blindspot**

The 2025 E-23 revision's explicit inclusion of AI/ML models created a new compliance surface. Most institutions have no systematic record of which business units are using third-party AI SaaS tools that embed models, their risk rating, validation status, or failure modes.

**Gap 4: The Third-Party Vendor Model Problem**

Under E-23, a FRFI is responsible for its own model risk regardless of whether the model was built internally or purchased from a vendor. Many institutions have 40+ active vendor model relationships with no systematic process for inventory, validation documentation, or change notification tracking.

**Gap 5: The Board-Level Reporting Gap**

E-23 requires standardized Board Risk Committee reporting on model risk. Currently a manual 3–7 day assembly process per reporting cycle. No automated board-level model risk dashboard exists for Canadian mid-tier institutions.

---

### 1.3 Competitive Landscape — Why IBM and Enterprise Players Are Not Your Competition

**The Market Tier Map (Critical Strategic Insight):**

```
Tier 1 Banks (Big 6): RBC, TD, CIBC, BMO, Scotiabank, National Bank
→ Internal teams of 20–50 model risk professionals
→ Already deploying IBM/SAS/custom solutions
→ NOT your market.

Tier 2 Institutions ($1B–$50B assets): EQ Bank, Laurentian, Home Trust,
ATB Financial, Canadian Western, credit union centrals
→ 2–5 model risk professionals
→ Cannot afford enterprise tools; cannot build internally
→ YOUR PRIMARY MARKET

Tier 3 Institutions (under $1B assets): Small credit unions, regional insurers,
federal pension administrators
→ 0–1 model risk staff
→ YOUR SECONDARY MARKET
```

**Enterprise Competitor Analysis:**

| Player | Product | Price | Implementation | Why They Miss Your Market |
|---|---|---|---|---|
| IBM | OpenPages (MR module) | $800K–$2.5M | 12–24 months | Designed for Tier 1 global banks; RBC/TD are their target |
| SAS | Model Risk Management | $500K–$1.5M | 9–18 months | Requires SAS ecosystem; mid-tier institutions don't have it |
| Moody's Analytics | RiskFoundation | $400K–$1.2M | 12 months | Credit risk focus; model governance is secondary |
| Wolters Kluwer | OneSumX | $600K–$1.8M | 12–20 months | European compliance orientation; limited OSFI config |
| SS&C Technologies | Algorithmics | $700K–$2M | 18+ months | Capital markets focus; model governance is tertiary |
| ValidMind | ValidMind Platform | $80K–$200K | 3–6 months | US-based, FDIC/OCC framing, no OSFI templates |

**The Positioning Conclusion:** IBM OpenPages starts at $800K. A Tier 2 Canadian FRFI with $8B in assets and 35 models cannot justify this. They cannot build internally. They will pay $3,000–$12,000/month for a purpose-built OSFI E-23 native solution. **That is your market. IBM will never serve it. You will never compete with IBM.**

---

### 1.4 Why Internal Solutions Are Insufficient

| Objection | Rigorous Rebuttal |
|---|---|
| "We can build this in Excel with better controls." | Excel has no immutable audit trail. Any cell can be overwritten silently. OSFI requires append-only logs. Excel cannot enforce this. |
| "We can build a SharePoint / Power Apps solution." | Built by engineers who understand SharePoint, not OSFI E-23. Will fail an OSFI audit. Configuration cost: $200K–$500K in consulting. |
| "Our GRC platform (Archer, ServiceNow) can handle this." | Generic GRC requires $200K–$500K configuration to approximate E-23 specificity. Fragile, breaks on every upgrade. |

**The core argument:** Regulatory compliance software is a domain expertise product. The domain expertise is the product. A bank's internal team does not have OSFI E-23 regulatory interpretation expertise embedded in their tooling. You do, by design.

---

## PART II: PRODUCT DEFINITION & VALUE PROPOSITION

### 2.1 The Product — OSFI E-23 Vault

**Product Concept:** A SaaS-delivered Model Risk Management platform purpose-built for Canadian FRFIs, architected around the five pillars of OSFI E-23 compliance, operational within 30 days of onboarding.

---

**Feature 1: Model Registry (The Inventory Core)**

Every model gets a structured record:

- Model ID (system-generated, immutable), name, version
- Business unit owner and model owner
- Model purpose and type (credit, market risk, AI/ML, operational, etc.)
- Methodology summary
- Input data sources and quality indicators
- System of deployment (production system, environment)
- Known assumptions and limitations
- Third-party vendor flag with vendor name and model version
- Date first deployed in production
- Last validated date, next validation due date
- Current risk tier (Tier 1/2/3 mapped to E-23 definitions)

**Feature 2: Automated Risk Rating Engine**

Questionnaire-based risk rating workflow producing a defensible, documented risk tier:

- **Materiality:** Dollar impact if model produces a significantly wrong output
- **Complexity:** Number of components, interpretability, methodology complexity
- **Data Quality:** Reliability, validation, auditability of input sources
- **Usage:** Breadth of use in decisions; use for regulatory capital calculations
- **Recency:** Last validated date, changes since last validation

Output: Tier 1 (highest risk), Tier 2, or Tier 3. Rating and all inputs are immutable in audit log.

**Feature 3: Validation Workflow Manager**

- Validation auto-scheduled based on risk tier (Tier 1: annual; Tier 2: biennial; Tier 3: triennial with trigger-based exceptions)
- Assignment to internal validator or external firm
- E-23-aligned validation checklist
- Findings log with severity rating
- Model owner response workflow
- Completion sign-off with electronic signature and timestamp
- Escalation protocol for overdue validations

**Feature 4: Third-Party/Vendor Model Module**

- Vendor name, product, version tracking
- Contractual access to vendor validation documentation checklist
- FRFI-side independent assessment status
- Renewal dates and change notification tracking
- Risk rating maintained at FRFI level regardless of vendor attestations

**Feature 5: Immutable Audit Trail**

Every action produces an append-only log entry:

- Actor identity, timestamp, IP address
- Record affected, field changed, old value, new value
- Action type classification
- Cannot be deleted, modified, or suppressed by any user including administrators

**Feature 6: Board Reporting Pack Generator**

One-click generation of OSFI E-23-aligned Board Risk Committee reporting:

- Model count by tier, validation status summary, new models added, material changes
- Validation findings summary and remediation status
- Third-party model risk exposure summary
- PDF for Board distribution, CSV for OSFI examiner use

**Feature 7: OSFI Examiner Export**

Purpose-built report format for OSFI Supervisory Reviews:

- Complete model inventory at point in time
- Validation schedule compliance rate
- Open findings and remediation status
- Model risk rating distribution
- Third-party model coverage

---

### 2.2 Features Deliberately Excluded

The panel is emphatic on scope discipline. The following are excluded from v1.0:

- Capital calculation engines
- Model build/development environments (Jupyter, Python IDEs)
- Credit adjudication workflow
- AML transaction monitoring
- Generic GRC framework functionality

**The discipline filter:** Every feature request must pass: "Does this directly help a Canadian FRFI demonstrate E-23 compliance to OSFI?" If no, it does not belong in version 1.0.

---

### 2.3 Unique Selling Proposition

**"The only model inventory platform built around OSFI E-23 from the ground up, by Canadians, hosted in Canada, operational in 30 days."**

Four defensible components:

1. **OSFI E-23 native:** Every field, workflow, and report template maps directly to an E-23 requirement — not configured, but designed.
2. **Built by Canadians for Canadian regulation:** Regulatory interpretation expertise embedded in the product, not a consulting engagement.
3. **Canadian data residency:** All data in AWS ca-central-1. Contractually guaranteed and verifiable.
4. **30-day time-to-value:** An institution starting IBM OpenPages today would not be compliant by May 2027. Thirty days is an existential competitive advantage.

---

## PART III: TARGET MARKET & CUSTOMER PROFILING

### 3.1 Customer Segmentation

```
Segment A — Tier 2 Banks and Trust Companies ($5B–$100B assets)
ACV: $8,000–$15,000/month | Cycle: 3–6 months | Volume: ~35 institutions
Decision maker: CRO + Head of Model Risk/Validation

Segment B — Federal Insurance Companies under OSFI supervision
ACV: $5,000–$10,000/month | Cycle: 4–8 months | Volume: ~70 institutions
Decision maker: Chief Actuary + CRO

Segment C — Credit Union Centrals and Large Provincial Credit Unions
ACV: $2,500–$6,000/month | Cycle: 6–12 months | Volume: ~50 institutions
Decision maker: VP Finance, Chief Risk Officer

Segment D — Federal Pension Plan Administrators
ACV: $3,000–$8,000/month | Cycle: 6–9 months | Volume: ~15 institutions
Decision maker: Chief Investment Officer, Risk Committee
```

---

### 3.2 Top Ten Prospect Profiles

**#1 — ATB Financial (Alberta)**
- Assets: $59B (Crown corporation, Government of Alberta)
- Regulation: Alberta Treasury Board & Finance (aligns to OSFI E-23 voluntarily)
- Pain: 350+ employees, significant AI/ML lending model portfolio, no dedicated MRM platform
- Budget signal: $180M+ annual technology spend; $100K MRM SaaS is rounding error
- Contact: Chief Risk Officer, VP Enterprise Risk
- Hook: Alberta regulatory alignment, provincial data sovereignty, Crown corporation governance

**#2 — Equitable Bank / EQ Bank (Ontario)**
- Assets: $44B | OSFI: Yes (Schedule I bank)
- Pain: 400% growth in 5 years; model count outpacing governance infrastructure
- Budget signal: $50M+ annual technology spend; fast-moving digital bank culture
- Contact: CRO, Head of Model Risk & Validation, CCO
- Hook: Speed-to-compliance; 30-day onboarding vs. 18-month enterprise alternative

**#3 — Home Capital Group / Home Trust (Ontario)**
- Assets: $22B | OSFI: Yes (federally regulated trust)
- Pain: Alternative mortgage models with complex inputs; third-party model vendor exposure
- Budget signal: Post-2017 crisis, compliance spend has doubled; management is compliance-forward
- Contact: CRO, VP Model Risk, CCO
- Hook: "Built to survive OSFI examination" — resonates deeply given their history

**#4 — Laurentian Bank of Canada (Quebec)**
- Assets: $47B | OSFI: Yes (Schedule I bank)
- Pain: Legacy systems, Quebec regulatory overlay (AMF + OSFI), strategic tech modernization
- Budget signal: $300M+ technology modernization commitment (2023)
- Contact: CRO, CCO, Head of Enterprise Risk, IT Transformation lead
- Hook: Quebec data residency (Law 25), French-language interface, AMF + OSFI dual compliance

**#5 — Canadian Western Bank / National Bank (Alberta)**
- Assets: $43B at acquisition | OSFI: Yes (National Bank subsidiary)
- Pain: Post-merger compliance harmonization; two legacy model portfolios, no unified inventory
- Contact: CWB CRO (retained through integration), National Bank Group Model Risk lead
- Hook: Merger integration — "unify your model inventory across two legacy systems in 60 days"

**#6 — Wawanesa Insurance (Manitoba)**
- Assets: $13B GWP | OSFI: Yes (federally regulated insurer)
- Pain: 2025 E-23 expansion to insurers is new; actuarial, pricing, reserving, AI fraud models all in scope
- Budget signal: Mutual insurer culture = compliance-forward; $150M+ annual operating expense
- Contact: Chief Actuary, CRO, CCO
- Hook: Actuary-first positioning — "documented, auditable actuarial judgment"

**#7 — The Co-operators Group (Ontario)**
- Assets: $60B AUM | OSFI: Yes (Co-operators Life is federally regulated)
- Pain: Multiple legal entities across P&C, life, financial services; no unified model inventory
- Budget signal: $200M+ digital transformation budget announced 2023
- Contact: Group CRO, VP Enterprise Risk, CCO
- Hook: Multi-entity consolidation — "one inventory across all Co-operators entities"

**#8 — Alberta Blue Cross (Alberta)**
- Regulation: Provincial + federal employee plan exposure
- Pain: Significant AI/ML for claims prediction and fraud detection; no model inventory whatsoever
- Budget signal: $7.2B in annual benefits processed; compliance budget is material
- Contact: Chief Actuary, Chief Risk & Compliance Officer, VP Technology
- Hook: Alberta identity, health-insurance-specific model type library

**#9 — Peace Hills General Insurance (Alberta)**
- GWP: ~$500M | Regulation: Provincial (but reinsurance treaty requirements)
- Pain: No model inventory; reinsurance due diligence requests creating urgency; pricing/reserving/CAT models ungoverned
- Budget signal: $30K–$50K/year accessible price point (Tier 3 pricing)
- Contact: CFO, VP Operations
- Hook: "Get reinsurance-ready AND OSFI-aligned in one platform"

**#10 — Concentra Bank (Saskatchewan)**
- Assets: $14B | OSFI: Yes (federally regulated bank serving credit union system)
- Pain: Commercial lending, agricultural, and liquidity models; credit union ecosystem watching for leadership
- Contact: CRO, Head of Enterprise Risk Management
- Hook: Credit union ecosystem leadership — "be the model governance standard-setter for the Canadian credit union system"

---

### 3.3 Buyer Urgency Matrix

```
18 months before deadline (Nov 2025):  Awareness — "We should look into this"
12 months before deadline (May 2026):  Evaluation — "We need to do something"
 6 months before deadline (Nov 2026):  Urgency — "We need a solution NOW"
 3 months before deadline (Feb 2027):  Desperation — "We'll pay anything"
Post-deadline (May 2027+):             Crisis — "We're in a supervisory review"

Current position: June 2026 — transition from Evaluation to Urgency.
Sales urgency PEAKS in Q3 2026 (July–September). Launch must happen NOW.
```

---

## PART IV: GO-TO-MARKET STRATEGY

### 4.1 Phased Market Entry Plan (11-Month Timeline)

**Phase 0: Foundation (Months 1–2) | Jun–Jul 2026**

- Engage Canadian regulatory counsel: OSFI E-23 compliance review opinion letter ($15K–$25K) — this letter becomes a marketing asset
- Retain data residency counsel: Standard DPA with PIPEDA + Law 25 schedule
- Establish AWS ca-central-1 production environment with SOC 2 controls framework
- Conduct 6–8 discovery interviews with CROs and Model Risk leads at Tier 2 institutions
- Register business name and trademark

Milestone: Product brief validated by regulatory counsel + 6 discovery calls confirming pain and budget willingness

**Phase 1: MVP Development (Months 2–5) | Jul–Oct 2026**

MVP scope (disciplined minimum):
- Model Registry (Feature 1)
- Risk Rating Engine (Feature 2)
- Audit Trail (Feature 5)
- Basic Board Pack PDF generator
- Role-based multi-user access (Model Owner, Validator, CRO View, Admin)
- CSV import from Excel (critical — how every client onboards their existing spreadsheet)

NOT in MVP: Validation workflow, third-party module, API integrations

Milestone: Fully functional, hosted, secure MVP passing internal E-23 compliance checklist

**Phase 2: Pilot Client Acquisition (Months 4–7) | Oct 2026–Jan 2027**

Lighthouse Client strategy:
- Sign 2–3 pilot clients at discounted rate ($36K–$60K/year instead of $96K–$120K)
- Exchange: co-design participation, reference permission, case study rights
- One per segment: bank, insurer, credit union

Sales approach:
- "You have 11 months. We can have you operational in 30 days."
- "IBM starts at $800K and takes 18 months. We are purpose-built for E-23, Canadian-hosted, 30-day implementation."
- "If OSFI requests evidence of your model inventory after May 2027, what do you show them?"

Milestone: 2 signed pilot clients on paid contracts

**Phase 3: General Availability (Months 7–9) | Jan–Mar 2027**

- Full product with Validation Workflow Manager (Feature 3) and Third-Party Module (Feature 4)
- Standard pricing published
- Launch at **Risk Canada Conference** (most important conference for this audience)
- Press release in Canadian Underwriter, Insurance Journal, Globe and Mail Report on Business
- Regulatory counsel opinion letter released as public white paper
- LinkedIn campaign targeting CROs, Model Risk leads, CCOs at Canadian FRFIs

Milestone: 5+ paying clients, $500K ARR trajectory

**Phase 4: Market Consolidation (Months 9–11+) | Mar–May 2027**

- OSFI Examiner Export module (Feature 7) released immediately before May 2027 deadline
- "Emergency E-23 Compliance Sprint" package: 30-day onboarding, dedicated support, examiner-ready in 45 days
- Target 15+ clients by May 2027
- Begin building the proprietary moat: 200+ model type library, risk rating benchmarks, validation methodology templates

Milestone: 15+ paying clients. Category dominance established.

---

### 4.2 Pricing Strategy

| Tier | Institution Size | Annual Contract | Users | Models |
|---|---|---|---|---|
| Tier 3 — Community | Under $1B assets | $30,000/yr ($2,500/mo) | 5 | Up to 30 |
| Tier 2 — Regional | $1B–$20B assets | $72,000/yr ($6,000/mo) | 20 | Up to 150 |
| Tier 1 — National | $20B–$100B assets | $144,000/yr ($12,000/mo) | Unlimited | Up to 500 |
| Enterprise | Over $100B assets | Custom ($180K+/yr) | Unlimited | Unlimited |

**Implementation Fees:** None for Tier 3 and 2. Flat $15K onboarding fee for Tier 1+.

**The IBM comparison in every sales deck:**
> "IBM OpenPages: $1.2M year-1 cost, 18-month implementation. OSFI E-23 Vault: $72K/year, 30-day implementation. For a $15B asset institution, that is a $1.1M saving in year 1 alone — with better OSFI alignment and Canadian data residency."

---

### 4.3 Key Stakeholder Engagement Map

| Role | Conversation Hook | Objection to Prepare For |
|---|---|---|
| **Chief Risk Officer** (Primary Champion) | "OSFI E-23 requires a compliant model inventory by May 2027. Your current spreadsheet is not E-23 compliant. We solve this in 30 days." | "We're planning to build it internally." |
| **Head of Model Risk / Validation** (Technical Champion) | "Your current process takes how long per quarter? We automate validation scheduling, risk rating, and board reporting." | "We already have a process — it just needs better documentation." |
| **CFO / COO** (Economic Buyer) | "This is a regulatory capital risk, not a software budget question. Non-compliance can trigger OSFI capital add-ons costing far more than $72K/year." | "Can we defer until next fiscal year?" |
| **Chief Compliance Officer** (Legal Gatekeeper) | "PIPEDA-compliant DPA, Law 25-compliant, AWS ca-central-1, regulatory counsel opinion letter confirming E-23 alignment." | "We need to review vendor contracts first." |
| **CISO / VP IT Security** (Security Gatekeeper) | "SOC 2 Type II, annual CREST pentest, AES-256 encryption, MFA, RLS, AWS ca-central-1." | "We don't allow SaaS for sensitive regulatory data." |

---

### 4.4 Path to Sole Canadian Dominance

**Year 1 (2026–2027): Establish Regulatory Credibility**
- Secure regulatory counsel opinion letter
- Publish free industry guide: "How to Build Your OSFI E-23 Model Inventory: A Step-by-Step Compliance Checklist" (gated with email capture)
- Speak at Risk Canada, PRMIA Canada Chapter, OSFI industry consultations
- Build and publish the first free OSFI E-23 Model Type Library (200+ model descriptions) — becomes the standard reference bookmarked by every Canadian model risk practitioner

**Year 2 (2027–2028): Expand Scope and Lock-In**
- Extend to OSFI B-15 (climate risk models — next major model governance requirement)
- Add OSFI Supervisory Review response package generation
- Launch industry benchmarking: "Your model inventory maturity vs. peer institutions" (anonymized, aggregated)
- Launch "OSFI E-23 Certified" client badge for reinsurance partner and audit committee display

**Year 3 (2028–2030): Ecosystem Lock-In**
- Partner with OSFI-accredited validation firms (EY, KPMG, Deloitte model risk teams) — mutual referral network
- Build Canadian MRM Professional Certification with PRMIA Canada
- Expand to provincial equivalents: AMF (Quebec), BCFSA (BC), FSRA (Ontario)
- International expansion: APRA (Australia), FCA/PRA (UK), FRB/OCC (US) — OSFI is internationally respected

---

## PART V: TECHNICAL AND OPERATIONAL FRAMEWORK

### 5.1 Recommended Technology Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query (server state) + Zustand (UI state)
- Recharts + D3.js for model risk heatmaps
- React-PDF or Puppeteer (server-side) for board report generation

**Backend:**
- Node.js 20 LTS + TypeScript
- Express.js (v1) → Fastify (at scale)
- Prisma ORM (type-safe, PostgreSQL RLS compatible)
- AWS SQS + SQS Consumer (async report generation, validation reminder emails)
- AWS Textract (document uploads and processing)

**Database:**
- PostgreSQL 15 on AWS RDS ca-central-1
- Row-Level Security (RLS) for multi-tenant data isolation — non-negotiable
- Separate append-only `audit_events` table with DB-level trigger blocking DELETE/UPDATE
- PostgreSQL full-text search initially; OpenSearch at 10,000+ models across clients

**AI/ML Layer:**
- AWS Bedrock + Claude (ca-central-1 deployment) — PIPEDA compliant
- Use cases: Model description auto-generation, risk rating suggestion, validation finding classification, natural language model search
- Document processing: AWS Textract → Claude for structured data extraction from uploaded documentation

**Infrastructure:**
- AWS ca-central-1 exclusively (legal requirement for OSFI-regulated clients)
- ECS Fargate (containerized, auto-scaling) — no single EC2 instance in production
- CloudFront with Canadian edge locations
- Route 53 + AWS Certificate Manager
- AWS Secrets Manager (no .env files in production)
- CloudWatch + AWS X-Ray for monitoring and tracing
- GitHub Actions → ECR → ECS (automated CI/CD pipeline)

**Security:**
- AWS Cognito + MFA enforcement
- RBAC: Model Owner, Validator, CRO View Only, Admin
- AES-256 at rest (AWS KMS), TLS 1.3 in transit
- Annual penetration test by CREST-certified Canadian vendor
- All API calls logged with actor, timestamp, action, payload hash

**Email:**
- AWS SES ca-central-1 (validation reminders, report delivery, notifications)

---

### 5.2 Critical Dependencies and Integrations

**Tier 1 (MVP Required):**

| Dependency | Purpose | Risk |
|---|---|---|
| AWS ca-central-1 (RDS, ECS, S3, SES, Textract) | Core infrastructure, legal requirement | Low |
| AWS Bedrock + Claude | AI-assisted risk rating and descriptions | Medium (migration from OpenAI) |
| AWS Cognito | Authentication | Low |
| GitHub Actions | CI/CD | Low |

**Tier 2 (Phase 2, post-MVP):**

| Integration | Purpose |
|---|---|
| Microsoft Graph API | Pull model documentation from SharePoint/OneDrive (client-authorized OAuth) |
| DocuSign / AWS Simple Sign | Electronic signatures on validation sign-offs |
| Outlook/Exchange webhook | Receive validation report emails automatically |

**Tier 3 (Year 2, ecosystem):**

| Integration | Purpose |
|---|---|
| OSFI supervisory data feeds | Benchmark model risk against OSFI aggregate data |
| PRMIA Canada | Professional development content partnership |
| EY/KPMG/Deloitte model risk teams | Validation firm partner API with workflow handoff |

---

### 5.3 Standards and Compliance Certification Roadmap

**Must achieve before first paying enterprise client:**

| Standard | Scope | Timeline |
|---|---|---|
| PIPEDA + Law 25 DPA | Data Processing Agreement, sub-processor list, breach notification runbook | Month 1–2 |
| AWS ca-central-1 attestation | All data (including backups, logs) in ca-central-1 — documented and verifiable | Month 1 |
| OSFI E-23 regulatory counsel opinion | Legal memo confirming product's compliance mapping to E-23 | Month 2 |
| Penetration Test | Annual CREST-certified Canadian vendor | Month 6 |
| SOC 2 Type I | Security, Availability, Confidentiality — point-in-time assessment | Month 4–6 |

**Target within 12–18 months:**

| Standard | Notes |
|---|---|
| SOC 2 Type II | 6-month operational evidence review; required by large FRFIs. Budget: $40K–$80K |
| ISO 27001 | Required for global expansion. Budget: $60K–$100K |
| ISO 9001 | Quality management system — demonstrates process discipline |

**Regulations the Product Must Map To:**

| Regulation | Applicability |
|---|---|
| OSFI E-23 (2025 revision, effective May 2027) | Core product requirement |
| OSFI B-13 (Technology and Cyber Risk, effective Jan 2024) | Platform's own technology risk management |
| OSFI B-15 (Climate Risk) | Phase 2 expansion |
| PIPEDA + Quebec Law 25 | Data handling for all clients |
| OSFI B-10 (Third-Party Risk) | Informs Third-Party Model Module design |
| IFRS 9 / IAS 39 | Financial instrument model governance context |

---

## PART VI: FOUNDATIONAL REFERENCES & ARCHITECTURAL PRINCIPLES

### 6.1 Primary Reference Documents

**Regulatory Primary Sources:**

1. OSFI Guideline E-23 — Model Risk Management (Final, September 2025) | [osfi-bsif.gc.ca/en/guidance/guidance-library/guideline-e-23-model-risk-management-2027](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/guideline-e-23-model-risk-management-2027)
2. OSFI E-23 Companion Letter (September 2025) — implementation timeline expectations
3. SR 11-7: Guidance on Model Risk Management (US Federal Reserve / OCC, 2011) — foundational global document; E-23 is derived from this framework | federalreserve.gov
4. EBA Guidelines on Internal Governance (EU), Article 22: Model Risk — international comparison
5. OSFI B-13 — Technology and Cyber Risk Management (effective January 2024)
6. OSFI B-15 — Climate Risk Management (2023)
7. OPC/CAI/OIPC Joint Investigation of OpenAI (May 6, 2026) — data residency requirement for AI

**Academic and Industry References:**

8. Supervisory Guidance on Model Risk Management, OCC 2011-12 — companion to SR 11-7
9. "Model Risk Management" — Crouhy, Galai, Mark (2014) — academic taxonomy reference
10. BDO Canada: OSFI E-23 Implementation Guide (2025) — Canadian FRFI practitioner context
11. MNP Model Risk Survey of Canadian Financial Institutions (2024) — market evidence
12. ValidMind Technical Documentation (public) — competitive benchmark
13. "Managing Model Risk in Financial Institutions" — Senior Supervisors Group (2009) — historical context

---

### 6.2 Five Inviolable Architectural Pillars

**Pillar 1 — Auditability by Design**

Every state change produces an immutable audit log entry. This is not a feature to be added later — it must be in the data model from Day 1. An append-only `audit_events` table with a database-level trigger blocking DELETE and UPDATE is the minimum standard.

**Pillar 2 — Canadian Data Sovereignty — No Exceptions**

All data at rest and in transit must remain in AWS ca-central-1. No third-party service processing client data may be located outside Canada. This rules out Sentry (US), Mixpanel (US), Datadog (US-primary). Use CloudWatch, AWS X-Ray, self-hosted Sentry on ca-central-1.

**Pillar 3 — Tenant Isolation — Zero Trust Between Clients**

PostgreSQL Row-Level Security with `tenant_id` on every table. Every API endpoint validates the authenticated user's tenant context before any database operation. Queries without `WHERE tenant_id = $tenantId` are categorically forbidden.

**Pillar 4 — Process-Based, Not Tool-Based**

The platform operationalizes a compliance process, not just a repository. Models must complete risk rating before they can be marked compliant. Validations must be documented before a model is cleared. Third-party models must be assessed before Tier 1 status is assigned. Users cannot skip steps in the workflow.

**Pillar 5 — Explainability Over Automation**

When the system suggests a risk tier, it must show its reasoning. When it generates a board report, it must cite source data. Every system-generated recommendation must include a traceable explanation. Regulatory compliance software that produces outputs without traceable logic fails OSFI examination.

---

## PART VII: FINANCIAL PROJECTIONS & INVESTMENT CASE

### 7.1 Revenue Model and Projections

**Conservative scenario:**

| Period | Clients | Avg ACV | ARR |
|---|---|---|---|
| Month 9 (Mar 2027) | 5 | $72,000 | $360,000 |
| Month 12 (Jun 2027) | 10 | $80,000 | $800,000 |
| Month 18 (Dec 2027) | 20 | $90,000 | $1,800,000 |
| Month 24 (Jun 2028) | 35 | $95,000 | $3,325,000 |
| Month 36 (Jun 2029) | 60 | $100,000 | $6,000,000 |

At $6M ARR with 75% gross margin, EBITDA turns positive around Month 24 with a 4-person team. The $10M ARR threshold (SaaS benchmark for institutional credibility) is reached within 42–48 months.

**Canadian addressable market:** 400 FRFIs × $72K avg ACV = **$28.8M TAM (Canada-only)**

With international expansion (APRA Australia, FCA/PRA UK, FRB/OCC US): **$150M+ TAM**

### 7.2 Grant Funding (Canada)

| Grant | Amount | Notes |
|---|---|---|
| SR&ED (35% refundable ITC for CCPC) | ~$140K/year | On $400K eligible R&D spend |
| NRC IRAP | $150K–$250K | Non-repayable contribution |
| Alberta Innovates Voucher | Up to $100K | Market validation |
| Alberta Scaleup Program | 50% wage subsidy | On qualified employees |

### 7.3 The Three Competitive Moats

**Moat 1 — Regulatory Interpretation Depth**

Every month the product exists, the team accumulates deeper OSFI E-23 interpretation knowledge embedded in product workflows, templates, and risk rating engines. A new entrant at Month 18 cannot replicate 18 months of regulatory interpretation depth.

**Moat 2 — Model Type Library**

Over time, the platform contains the largest library of Canadian FRFI model descriptions, risk rating benchmarks, and validation methodology templates. This proprietary data asset means clients onboard faster because their model types are already in the library. Irreplicable without 2–3 years of client data.

**Moat 3 — Switching Cost**

Once an institution's model inventory, risk ratings, audit history, validation records, and board reports are in the platform, switching costs are prohibitive. The audit trail cannot be migrated to a competitor without losing the immutability property that makes it legally defensible. The switching cost is the entire cost of rebuilding the historical compliance record.

---

## EXECUTIVE SUMMARY

**The Opportunity in One Paragraph:**

OSFI E-23, effective May 2027, creates a hard compliance deadline for every federally regulated financial institution in Canada — approximately 400 institutions. The vast majority manage their model inventory in Excel spreadsheets that cannot meet E-23's requirements. Enterprise solutions (IBM OpenPages at $1M+) are inaccessible. No Canadian-native, purpose-built, OSFI-specific platform exists. A product built now, launched Q1 2027, priced at $30K–$180K/year, positioned directly against the compliance deadline, hosted in AWS ca-central-1 with Canadian data residency guarantee, has a defensible path to $6M ARR within 36 months and category dominance within 24 months. The first-mover window is approximately 9–12 months. Acting after that window closes means competing against an entrenched incumbent — which will be you, if you move now.

**The Panel's Single Most Important Recommendation:**

Begin customer discovery calls this week. Before writing a line of code, have ten conversations with Chief Risk Officers at Tier 2 Canadian financial institutions. The regulatory pain point is real and documented. Validate price sensitivity, procurement cycle length, and the specific features that would cause them to sign a contract. Those ten conversations are worth more than any further analysis — including this document.

---

*Presented by the Cross-Faculty Review Panel*
*Harvard Business School & Oxford Saïd Business School*
*Strategic Analysis Division — Financial Technology and Regulatory Economics*
*June 22, 2026*
