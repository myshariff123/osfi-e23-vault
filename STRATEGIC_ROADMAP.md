# ClearMRM Strategic Roadmap
## From Crawling to Dominant — The SpaceX Analogy

**Last updated:** June 25, 2026  
**Author:** Nimblestride Inc.

> **New in this revision (June 25, 2026):** Added Phase 12 (OSFI E-23 Regulatory Completeness — compliance parity items sourced from the official guideline text line by line) and Phase 13 (Unique Differentiator Services — the 8 capabilities no existing competitor provides in the Canadian market). Cross-referenced against COMPLIANCE_GAPS.md. All prior phases unchanged.

---

## THE INFLECTION POINT

SpaceX launched Falcon 1 four times. Three failures. On the fourth launch — the last funded attempt — it succeeded. The lesson Elon Musk distilled from those failures was not to work harder. It was to ruthlessly identify which assumptions were wrong and invalidate them faster than competitors.

ClearMRM faces its own inflection point. A key validator prospect rejected the platform at $200K/year, willing to offer only $300–$400/month. The feedback was precise: "It's just another SharePoint folder to park documents. I can't see what has been eliminated."

This is not a pricing objection. It is a value proposition failure. The platform was built as a tool (stores data, comments on it). A $200K/year contract requires a system (runs the compliance program, generates the deliverables, eliminates the consultants).

That gap has been closed. This document maps how.

---

## FAILURE ANALYSIS

| Failure Mode | SpaceX Equivalent | ClearMRM Manifestation |
|---|---|---|
| Wrong fuel mixture | Wrong propellant ratio | AI added commentary, not deliverables |
| Engine not tested at full thrust | Tested on a simulator, not a real flight | Demoed to admins, not validators |
| Payload spec not validated with customer | Customer didn't review requirements | Assumed $200K ACV before proving $72K value |
| No marketing before launch | No pre-launch hype | Login page was the first impression |

---

## PHASE PROGRESSION: CRAWL → SPRINT → WIN

### Phase 1–3: Crawl (Document Management + Workflow)
*June 22, 2026 — COMPLETE*

Built the foundation: model registry, risk rating, audit trail, validation workflow, vendor assessments, OSFI examiner export, multi-tenant onboarding, SSO. This was the rocket body — necessary but not sufficient. A validator correctly identified it as "document parking."

**What worked:** Architecture, data model, OSFI alignment, Cognito/Bedrock/RDS stack.  
**What failed:** No demonstrable elimination of consultant labor.

---

### Phase 4: Crawl+ (AI Across Every Workflow)
*June 22, 2026 — COMPLETE*

Added AI commentary to model change management, exam sprint, regulatory calendar, risk appetite, and ongoing monitoring. Still additive — AI was generating text, not artifacts.

**What worked:** Proved AI integration pattern with Bedrock ca-central-1.  
**What failed:** AI output was still advisory. A consultant's deliverable still required human effort.

---

### Phase 5: First Sprint (AI Generates Deliverables)
*June 23, 2026 — COMPLETE*

The pivot. Transformed all AI from commentary → automation. AI now generates:

- **Validation Reports** at $15K–$50K consultant replacement value per report
- **MRM Policy** at $25K–$50K regulatory counsel replacement value
- **Portfolio Health Assessment** (Portfolio Doctor) — A-F health grade, critical gaps, quick wins
- **AI Action Queue** — prioritized work directives replacing passive dashboard KPIs
- **Natural Language Search** — plain English query against model inventory
- **Document Intelligence** — paste a Word/PDF doc → AI extracts structured model data → pre-fills forms

**ROI math for prospect conversations:**
- 6 validations/year × $15K avg report = $90K consultant fees eliminated
- 1 MRM Policy review/year = $25K–$50K regulatory counsel eliminated
- Staff time freed: ~$75K/year in triage and manual reporting
- **Total eliminated: $190K–$215K/year vs ClearMRM at $72K/year = 2.6–3.0× ROI Year 1**

**What worked:** Value proposition shifted from "document parking" to "consultation automation."  
**What remained:** No enterprise security posture, no public marketing presence.

---

### Phase 6: Sprint (Enterprise Trust + Market Entry)
*June 23, 2026 — COMPLETE*

Three enterprise-grade additions that justify a $200K annual contract:

#### 1. Marketing Landing Page
A prospect's first impression is now a full product story — not a login form. The landing page communicates:
- 90-second onboarding to first AI analysis
- OSFI E-23 compliance deadline (May 1, 2027) with live countdown
- Specific labor eliminated and consultant fees replaced
- 4-tier pricing (Community $12K → Regional $72K → National $120K → Enterprise custom)
- 6-feature grid with per-feature ROI callouts
- Clear CTAs: "Start 30-Day Pilot" for new prospects, "Sign In" for existing clients

#### 2. Session Security (Defense-in-Depth)
Enterprise prospects buying a $72K–$200K compliance platform will ask: "What are your access controls?"
- **Client-side:** 15-minute inactivity warning + 20-minute auto-logout (aligned with OSFI B-13 §4)
- **Server-side:** JWT expiry enforcement — `claims.exp` checked on every authenticated request; expired tokens return `401 SESSION_EXPIRED` even if signature is valid

#### 3. Cryptographic Audit Integrity (Merkle Hash Chain)
The audit trail was already immutable (PostgreSQL trigger prevents UPDATE/DELETE). Phase 6 adds mathematical proof that no one has altered the data since it was inserted:
- Every audit event stores a SHA-256 hash of `(previousHash + eventData)`
- The chain links every event since genesis; any manual database edit breaks the chain
- `GET /api/audit/verify-integrity` replays the entire chain and returns a Merkle root — a single 32-byte fingerprint of all audit history
- The UI shows per-event hash pills and a one-click "Verify Integrity" panel
- **Examiner talking point:** "Show me audit events since January." → "Here is the Merkle root for that period. If any record was altered after insertion, this hash would be different."

---

### Phase 7: Insurance Depth (COMPLETE — June 23, 2026)
*Insurance-specific gaps identified through MRM gap analysis against published actuarial and regulatory literature*

| Feature | Value Delivered | Status |
|---|---|---|
| Insurance Model Taxonomy (14 categories) | Actuarial reserving, pricing/rating, cat models, IFRS 17, capital/ORSA, underwriting, fraud, ALM | LIVE |
| Actuarial Assumption Register | Full CRUD: assumption versioning, prior vs. current, approved-by, change reason | LIVE |
| Structured Backtesting Log | Predicted vs. actual, variance %, pass/fail/inconclusive verdict per validation cycle | LIVE |
| Model Dependency Map | Cascade risk chains (cat → reinsurance → capital/MCT → ORSA), tier badges | LIVE |
| Insurance Profile Card | IFRS 17 component, capital framework, spreadsheet warning on model detail page | LIVE |

---

### Phase 8: Tesla-Style Landing Page (COMPLETE — June 23, 2026)

Replaced feature-dump marketing page with outcome-focused, Tesla-minimal design:
- **Removed:** All prices, all technical stack mentions, ROI calculator, 9-card feature grid
- **Added:** Live OSFI deadline countdown, three-pillar outcome narrative, competitor comparison table (IBM / SAS / Excel / ClearMRM), 30-day pilot CTA, "Contact us for pricing" mailto link
- **Rationale:** First prospect feedback plus strategic assessment confirmed that exposing pricing and technology details creates confusion, not conviction

---

### Phase 9: Go-to-Market & Managed Service Layer
*Target: July–October 2026 — MOST CRITICAL PHASE*

This phase does not require code. It requires execution.

#### 9A — Immediate Sales Enablement (July 2026)

| Deliverable | Purpose | Owner |
|---|---|---|
| ClearMRM B-10 Vendor Package | OSFI B-10 requires FRFIs to conduct due diligence on ClearMRM as a third-party. Without this package, every enterprise deal stalls in procurement. Must include: AWS ca-central-1 data residency attestation, AI provider disclosure (Bedrock, not OpenAI), sub-processor list, SLA terms, incident response summary. | Founder + Counsel |
| "Human-in-the-Loop" messaging layer | Every marketing surface must add: "ClearMRM AI generates drafts. Your team approves and signs." This eliminates the regulatory concern that ClearMRM is a fully automated sign-off engine (OSFI E-23 prohibits full automation). This is a messaging fix, not a product fix. | Marketing |
| Whitepaper #1: OSFI E-23 Credit Union Guide | "How a Canadian Credit Union Can Demonstrate OSFI E-23 Compliance Before May 2027." Gated behind email form, distributed via CASL-compliant LinkedIn outreach to CRO / Head of Model Risk / CCO contacts at Canadian credit unions. | Founder |
| 3 Partnership Outreach Letters | Target: MNP LLP (credit union risk practice), RSM Canada, and one Big-4 (EY or KPMG) risk advisory practice. Proposal: co-delivery model where they provide the validator, ClearMRM provides the platform, the FRFI gets 60% cost reduction vs. traditional consulting. This is the Validator Marketplace in its earliest commercial form. | Founder |

#### 9B — Product: Validation Sprint Service Tier (August 2026)

A service SKU, not a product feature. When an FRFI needs independent validation of a specific model:

- **ClearMRM Validation Sprint:** $20,000–$35,000 per model (vs. $75,000 market rate)
- Includes: ClearMRM platform access + AI-generated validation report draft + certified human validator review and sign-off from ClearMRM's Validator Network
- Delivered in 10 business days
- OSFI-grade output with independent validator attestation

This Sprint SKU is the bridge between the $72K/year software subscription and the $360K/year full managed service the market document prices. It creates a land-and-expand motion: start with subscription, add Sprint for high-risk models.

#### 9C — PSI Monitoring Addition (August–September 2026)

Add quantitative model monitoring metrics to the Ongoing Monitoring module:

| Metric | Description | OSFI Expectation |
|---|---|---|
| Population Stability Index (PSI) | Measures distributional shift of model inputs from training population to current scoring population. PSI > 0.1 = yellow flag. PSI > 0.25 = red flag, revalidation required. | §4.3 Ongoing Monitoring |
| Gini / AUC tracking | For credit and underwriting models, discriminatory power tracked per monitoring period with threshold alerts | §4.3 |
| Residual drift | For reserving models: predicted vs. actual adequacy delta tracked quantitatively. Links to backtesting log. | §4.3 |

This closes the most frequently cited gap when OSFI examiners ask about "continuous monitoring with trigger thresholds" — the gap between ClearMRM's current qualitative flags and the quantitative metrics the guideline expects.

#### 9D — SOC 2 Type I (September 2026)

Enterprise procurement and credit union IT committees block deals without this. SOC 2 Type I (description of controls at a point in time) can be achieved in 90 days with a focused effort. Begin scoping with a Canadian SOC 2 audit firm in August. Type I report removes the procurement blocker. Type II (operating effectiveness over 6+ months) follows in 2027.

---

### Phase 10: Validator Marketplace (October–December 2026)
*The Falcon 9 Moment*

SpaceX's turning point was not Falcon 1's fourth successful launch. It was the decision, after those failures, to pursue reusability — a capability no competitor was building. The expendable rocket market was crowded; the reusable rocket market was empty.

ClearMRM's equivalent is the Validator Marketplace. Not because it is a feature. Because it changes the structure of the market.

Every validation firm in Canada today works by email chains and Word documents. The engagement model is: FRFI sends model documentation → validator spends 3–4 weeks building context → validator writes a report → FRFI pays $75K. ClearMRM collapses the 3–4 weeks of context-building to zero, because ClearMRM already has the model inventory, risk ratings, assumption register, backtesting data, and audit history. The validator opens ClearMRM, reviews the AI-generated draft, adds independent judgment, and signs. The engagement takes days, not weeks. The fee drops from $75K to $20K. The FRFI saves $55K per model.

**The Marketplace math for a 100-model Tier 2 FRFI:**
- 20 high-risk models requiring annual validation × $20K per Sprint = $400K in validation services
- Plus $72K–$144K annual subscription
- **Total per-client value: $472K–$544K/year**
- ClearMRM earns: subscription + 15% platform fee on Sprint engagements = $72K + $60K = $132K per client per year
- At 10 clients: $1.32M ARR. At 25 clients: $3.3M ARR.

This is a dramatically larger business than the subscription-only model.

**Marketplace MVP Requirements (60-day build):**
- Validator profiles (name, credentials, specialization, OSFI-accepted validator status)
- Request-for-validation workflow within ClearMRM (FRFI selects model → requests Sprint → marketplace matches validator)
- Secure validator portal (read-only access to specific model data within FRFI's tenant)
- Attestation and sign-off workflow (validator submits signed finding → appended to validation record)
- Platform fee invoice generation (15% of Sprint fee)

---

### Phase 11: Scale Enablers (Q1 2027)

| Feature | Rationale |
|---|---|
| Fiserv DNA Connector | Used by majority of Ontario/BC credit unions; eliminates manual CSV import — the top early churn driver |
| Temenos T24 Connector | Regional bank core banking system; covers second-largest segment of target market |
| SHAP/LIME Explainability Integration | For Tier 1 (high-risk) models, OSFI expects feature-level explanability. Integration with open-source SHAP that allows clients to upload feature importance data into ClearMRM's model profile. |
| AMF Quebec Alignment Module | Quebec Law 25 + AMF overlay is a distinct regulatory layer. 40+ Quebec FRFIs need this. First mover. |
| OSFI B-15 Climate Module | Climate risk models are a new OSFI priority with same buyer (CRO). Opens cross-sell motion with existing clients and new insurer segment. |
| PostgreSQL Row-Level Security | SOC 2 Type II prerequisite; required for enterprise prospects |

---

## STRATEGIC ASSESSMENT — June 23, 2026

### Expert Market Analysis: Does ClearMRM Need to Pivot?

**Source document analyzed:** "Commercially Available Risk Management Models (MRM) — Canada (20+ Catalog)" — a comprehensive market intelligence document cataloguing 20+ procurable risk platforms, business model guidance for Canadian RaaS providers, regulatory compliance requirements, and a 12-month GTM timeline.

**Panel verdict: No fundamental pivot. Three strategic refinements.**

#### What the Document Confirms

The market intelligence document was written by a team that did the same regulatory analysis ClearMRM was built on — OSFI E-23, B-10, PIPEDA — and arrived at the same conclusions:
- Target market: Tier 2/3 credit unions and regional insurers ✓
- Regulatory drivers: E-23 + B-10 + PIPEDA ✓
- Technical requirements: Canadian cloud tenancy, encrypted pipelines, immutable audit logging ✓
- Product model: AI-assisted with human sign-off, not fully automated ✓
- Competitive gap: IBM ($400K+) and SAS ($300K+) are inaccessible to the target market ✓

**ClearMRM's thesis is validated by independent market analysis.**

#### The "God-Mode" Warning — ClearMRM is Compliant

The document explicitly warns: "A fully automated 'god-mode' (no human oversight) is not feasible under current Canadian regulatory expectations."

ClearMRM is not god-mode. The AI generates *drafts*. Every critical output (validation reports, MRM policies, examiner export) requires human review and sign-off. The 6-state validation workflow enforces human gates at every stage. The board must attest to the MRM Policy. The audit trail records every human action.

The required correction is messaging, not product: every marketing surface must explicitly communicate the human-in-the-loop architecture to avoid prospect misinterpretation.

#### The Pricing Signal

The document prices the managed service market at $30,000/month (~$360,000/year) for a RaaS subscription and $75,000 per model for one-time independent validation. ClearMRM's software subscription ($30K–$144K/year) is correctly priced for the software tier. The Validator Marketplace Sprint ($20K–$35K per model) captures the validation services market at a disruptive price point. The combined per-client value is $472K–$544K/year — a 5–7× larger opportunity than the subscription alone.

#### The Three Real Gaps

1. **Quantitative monitoring metrics (PSI, Gini/AUC drift)** — OSFI expects quantitative trigger thresholds, not only qualitative flags. Phase 9C addresses this.
2. **SHAP/LIME explainability for Tier 1 models** — Feature-level explanation expected for high-impact models. Phase 11 addresses this.
3. **Core banking connectors** — CSV import creates manual onboarding burden at scale. Phase 11 addresses this.

#### The Most Urgent Risk (Not in the Document)

The biggest risk facing ClearMRM is not regulatory alignment or product completeness. It is sales cycle length. Enterprise compliance SaaS to regulated institutions has a 3–6 month sales cycle. OSFI E-23 is enforceable May 1, 2027. The window to close clients who can implement, run a pilot, and demonstrate compliance before the deadline closes approximately October–November 2026 — four months away. **Sales outreach must begin immediately, not after Phase 9 product additions.**

---

## PRICING ARCHITECTURE (Revised — June 23, 2026)

### Software Subscription Tiers (Platform License)

| Tier | Target | ACV | Model Limit |
|---|---|---|---|
| Community | Credit unions, small trust cos, small insurers (under $1B AUM) | Contact us | 50 models |
| Regional | Regional banks, mid-size P&C and life insurers ($1B–$20B AUM) | Contact us | 500 models |
| National | National banks, large P&C/life insurers ($20B–$100B AUM) | Contact us | Unlimited |
| Enterprise | Top 6 banks, OSFI-watched institutions, reinsurers ($100B+ AUM) | Contact us | Unlimited + SLA |

*Prices removed from public-facing materials. Quoted in sales conversations. Range: $30K–$144K/year.*

### Validation Sprint Service (New)

| SKU | Description | Price | Market Rate |
|---|---|---|---|
| Model Validation Sprint | AI-generated MVR draft + certified human validator sign-off, delivered in 10 business days | $20,000–$35,000 per model | $75,000 per model |
| Portfolio Health Sprint | Full portfolio gap analysis + remediation roadmap, AI + human validated | $50,000–$75,000 | $150,000+ |
| OSFI Exam Concierge | 90-day exam-readiness program: gap analysis, remediation, examiner package, dry-run | $75,000–$150,000 | $200,000–$400,000 |

**Pilot program:** 30-day free pilot → pilot converts to Regional subscription + minimum 2 Validation Sprints. Target: 2 lighthouse pilots signed by November 1, 2026.

---

## REVENUE MODEL (Revised — June 23, 2026)

| Month | Clients | ARR (Subscription) | Sprint Revenue | Total Revenue | Key Milestone |
|---|---|---|---|---|---|
| Month 6 (Dec 2026) | 2 pilots live | — | $40K (2 sprints) | $40K | First validators onboarded to Marketplace |
| Month 9 (Mar 2027) | 5 paying | $360K | $200K (10 sprints) | $560K | OSFI deadline urgency converts pilots |
| Month 12 (Jun 2027) | 10 paying | $800K | $600K (30 sprints) | $1.4M | Marketplace live; SOC 2 Type I complete |
| Month 18 (Dec 2027) | 25 paying | $1.8M | $1.5M (75 sprints) | $3.3M | SOC 2 Type II; enterprise tier opens |
| Month 24 (Jun 2028) | 45 paying | $3.3M | $3.0M | $6.3M | B-15 climate module; AMF overlay |
| Month 36 (Jun 2029) | 80 paying | $6.0M | $6.0M | $12.0M | Market leader; Series A candidacy |

---

## IMMEDIATE NEXT STEPS (Updated June 23, 2026)

| Priority | Action | Owner | Target Date |
|---|---|---|---|
| P0 | Begin sales outreach to 5 credit union CROs/CCOs via LinkedIn (CASL-compliant) | Founder | June 30, 2026 |
| P0 | Re-invite Validator A prospect for re-demo (Tesla landing page, AI deliverables, human-in-the-loop messaging) | Founder | June 30, 2026 |
| P0 | Draft ClearMRM B-10 Vendor Package (data residency, AI provider, SLA, sub-processors) | Founder + Counsel | July 15, 2026 |
| P1 | Write Whitepaper #1: "OSFI E-23 Credit Union Compliance Guide" — gate on email, distribute on LinkedIn | Founder | July 15, 2026 |
| P1 | Identify and contact 3 Canadian validation firms (MNP, RSM, EY Risk) for Validator Marketplace partnership | Founder | July 15, 2026 |
| P1 | Draft 30-day pilot agreement with data residency addendum and DPA | Counsel | July 31, 2026 |
| P2 | Add PSI monitoring metrics to Ongoing Monitoring module | Tech | August 31, 2026 |
| P2 | SOC 2 Type I scoping engagement initiated | Founder + Counsel | August 31, 2026 |
| P2 | Build Validation Sprint service tier (service SKU, validator portal, attestation workflow) | Tech + Founder | September 30, 2026 |
| P3 | Validator Marketplace MVP live (3 vetted validators, referral fee workflow) | Tech | October 31, 2026 |
| P3 | Phase 9 product additions complete (PSI + Sprint) | Tech | October 31, 2026 |

---

## Phase 12: OSFI E-23 Regulatory Completeness
*Q3–Q4 2026 — Compliance Parity (Must Have Before First Enterprise Deal Closes)*

> **Strategic context:** These items are NOT differentiators. IBM, ValidMind, and Yields.io all have equivalent features. However, an OSFI examiner reviewing ClearMRM's own compliance posture (per B-10) and a Tier 1 FRFI's procurement checklist will verify these exist. Without them, enterprise deals stall in procurement and pilot audits fail. Build these as efficiently as possible — they are infrastructure, not product.

**Source:** Every item below is sourced directly from the OSFI E-23 official text. Detailed regulatory mapping is in COMPLIANCE_GAPS.md.

### 12A — Appendix 1 Inventory Completeness (Low Effort / High Examiner Visibility)
*An OSFI examiner's first step is pulling the model inventory and checking it against Appendix 1 field by field.*

| Item | OSFI Reference | What to Build |
|---|---|---|
| CP-01: `approved_uses` field | Appendix 1 | Structured text field on model record documenting what the model IS and IS NOT approved to do. Displayed prominently on model detail page. |
| CP-01: `limitations` field with exceptions | Appendix 1 | Structured field for known model limitations, failure modes, and documented exceptions from standard governance requirements. |
| CP-02: `monitoring_status` enum | Appendix 1 | Distinct status field separate from validation status: `active` / `breached` / `under_review` / `suspended`. Visible in inventory table. |
| CP-03: `model_developer` split from `model_owner` | Appendix 1, A.4 | Add `model_developer_name` and `model_developer_email` as distinct fields. OSFI defines these as separate roles. |
| CP-04: `residual_risk_rating` at approval | C.2, Approval | When a model is approved, require the approver to record the residual risk rating (after controls) separately from the inherent risk tier. |

### 12B — Risk Rating Completeness (Low Effort / Required for C.2)

| Item | OSFI Reference | What to Build |
|---|---|---|
| CP-05: Negligible / Tier 0 category | C.2 | Add a fourth option to the risk rating wizard: Negligible/Tier 0 (exempts model from full lifecycle governance). Requires: formal justification, approver sign-off, expiry date, trigger conditions for re-rating. Exemption register screen in admin panel. |
| CP-08: Usage limits and constraints | C.3 | `usage_limits` JSONB field per model: max_dollar_exposure, max_decision_volume, approved_business_units[], override_required_above_$. Displayed on model detail. Usage limit breach triggers monitoring alert. |
| CP-09: Contingency plans | C.3, 3.6 | `contingency_plan` JSONB field per model: backup_model_id (link to fallback model), manual_override_procedure (text), fallback_data_source (text), escalation_contact. Part of model setup form. Checklist item in periodic review. |
| Residual risk in board report | C.2 | Add "Inherent vs. Residual Risk" section to board report PDF. Show delta between what the model inherently risks and what remains after controls. |

### 12C — Model Rationale (Medium Effort / Required for Principle 3.1)
*OSFI Principle 3.1 and the Model Rationale section require a structured design-phase document. Currently only free-text description exists.*

| Item | OSFI Reference | What to Build |
|---|---|---|
| CP-07: Structured model rationale | Principle 3.1 | Replace free-text `purpose` field with structured rationale form: `model_scope` (what the model covers), `model_coverage` (geographic/product/segment scope), `intended_use_description` (how outputs will be used), `business_use_case` (specific decision the model informs), `usage_risk_notes` (risks of using this model for this purpose). |
| CP-07: AI/ML rationale extension | Model Rationale AI/ML | Additional tab shown only when `methodology_type` = AI/ML or advanced technique: `explainability_level_required` (enum: not_required / limited / standard / full_regulatory with rationale), `is_black_box` (boolean), `alternative_controls_description` (text, required when `is_black_box = true`), `bias_potential_assessment` (text), `ethical_risk_notes` (text), `privacy_risk_notes` (text). These fields are design-phase obligations — distinct from Phase 11's SHAP/LIME output capture. |

### 12D — Lifecycle Gates (Medium Effort / Required for Principles 3.5 and Decommission)

| Item | OSFI Reference | What to Build |
|---|---|---|
| CP-06: Formal decommission workflow | Decommission | New lifecycle state: `decommissioned` (distinct from archive/soft-delete). Decommission wizard: (1) reason for decommission (performance/regulatory/obsolete/cost), (2) stakeholder notification list (auto-email model owner, validators, users), (3) successor model link, (4) documentation retention period (configurable, default 36 months), (5) downstream model impact assessment (pulls dependency map, lists affected models), (6) third-party coordination checklist (if `is_third_party = true`: vendor notification, exit plan reference, data return). `model_decommissions` table. |
| CP-10: Deployment checklist | Principle 3.5 | New lifecycle gate between validation approval and model `active` status. Deployment checklist (checkbox per item, stored in `model_deployments` table): dev/prod data consistency verified, production environment tests completed, monitoring configured, explainability requirements communicated to stakeholders, cybersecurity/infrastructure risk assessed (reference to B-13/E-21 review), change control documented, exception handling documented. Cannot mark model `active` without checklist completion. |

### 12E — Data Governance (Medium Effort / Principle 3.2 and 3.3)

| Item | OSFI Reference | What to Build |
|---|---|---|
| DG-01: Structured data lineage | Principle 3.2 | `model_data_sources` table: model_id, source_system_name, source_table_or_api, refresh_frequency (real-time/daily/weekly/monthly/ad-hoc), data_owner, is_synthetic (boolean), is_proxy (boolean), lineage_validated_at, validated_by. Data Sources tab on model detail page. |
| DG-02: Data quality check log | Principle 3.2 | `model_data_quality_checks` table: model_id, check_type (outlier_detection/missing_value/consistency/bias_check/proxy_analysis), check_result, issues_found, run_date, run_by. Log visible on model detail under Data Governance tab. |
| DG-04: Expert judgment register | Principle 3.3 | `model_expert_judgments` table: model_id, judgment_description, justification, expert_name, expert_role, magnitude_of_impact (low/medium/high), applied_at, reviewed_by. Expert Judgment Register tab on model detail. Critical for actuarial models (tail factors, development factors, IBNR selections). |

### 12F — Validation Scope Completeness (Low Effort / Principle 3.4)
*The current validation workflow captures findings and outcomes but does not enforce the specific scope OSFI mandates.*

| Item | OSFI Reference | What to Build |
|---|---|---|
| Structured validation scope checklist | Principle 3.4 | Add a checklist to the validation form that reviewers must complete before submitting findings: ☐ Risk rating confirmed/challenged ☐ Model purpose and scope reviewed ☐ Conceptual soundness assessed ☐ Data quality reviewed ☐ Limitations and mitigants reviewed ☐ Explainability level evaluated (for AI/ML) ☐ Sub-components reviewed (for vendor models) ☐ Reasonableness of outcomes verified. Each item requires a checkbox + brief note. |
| Residual risk in validation approval | Principle 3.4, Approval | When a validator recommends approval, require: `residual_risk_rating` (inherent tier minus controls) + `residual_risk_narrative` (what controls reduce the residual risk, and what risk remains). |

### 12G — Governance Evidence (Medium Effort / Sections B.1 and C.1)

| Item | OSFI Reference | What to Build |
|---|---|---|
| GV-01: Multi-disciplinary stakeholder tracking | B.1, D.1 | `model_stakeholders` table: model_id, stakeholder_email, discipline (legal/ethics/compliance/IT/data_science/business/risk/other), involvement_type (reviewer/approver/consulted/informed), involved_at. Stakeholder tab on model detail. Warning displayed on AI/ML model if no legal or ethics stakeholder on record. Included in examiner export. |
| GV-02: Risk appetite breach linkage | B.2, C.2 | Risk appetite statement thresholds stored as machine-readable config (max_tier1_count, max_unvalidated_pct, max_vendor_concentration). Model-level flag `outside_risk_appetite` (boolean) + `risk_appetite_breach_reason` + `remediation_plan` + `remediation_due_date`. Dashboard banner when portfolio exceeds appetite thresholds. Board report section: "Models Operating Outside Risk Appetite." |
| GV-03: Periodic model survey workflow | C.1 | `model_surveys` table: survey_id, survey_period, business_unit, sent_to_email, completed_at, models_declared_count. Admin initiates survey (sends form link to business unit contacts). Business unit submits declaration: "We have X models in use. Here is the list." System reconciles declared models vs inventory and flags potential shadow models. Survey completion dashboard. |
| GV-04: Monitoring config persistence | C.3, 3.6 | `model_monitoring_configs` table: model_id, metric_name, metric_type, threshold_warning, threshold_breach, frequency (monthly/quarterly/semi-annual), last_checked_at, status. Tier-based defaults auto-populated on model creation (Tier 1: monthly, Tier 2: quarterly, Tier 3: semi-annual). Monitoring results history log. Stakeholder notification when threshold breached. |

---

## Phase 13: Unique Differentiator Services — The 8 Things No Competitor Builds
*Q4 2026 → 2027 — These are the reason a Canadian FRFI chooses ClearMRM over IBM, ValidMind, or Yields.io*

> **Strategic context:** Phase 12 builds the compliance floor. Phase 13 builds the competitive ceiling. The 8 services below solve problems that OSFI E-23 creates but that NO existing platform addresses in the Canadian market. These are not feature additions — they are new market categories. Each one is described in detail in COMPLIANCE_GAPS.md Part D.

### D-01: Validator Marketplace — Market-Creating, Not Market-Competing (Phase 10 — Priority Accelerate)
**The problem:** Every non-negligible model needs independent validation. At $75K/model market rate, a 100-model FRFI cannot comply before May 2027. Validators are booked 12 months out. **This is a crisis with no current solution.**

**What no competitor builds:** A two-sided marketplace connecting FRFIs with vetted Canadian validators. ClearMRM AI generates the validation draft. The validator reviews, adds independent judgment, and signs in days instead of weeks. Fee drops from $75K to $20K/model. ClearMRM earns 15% platform fee.

**Why this is structurally impossible for IBM or ValidMind to copy:** It requires a Canadian validator network + a governance platform. IBM's Big-4 partners charge $75K/model — marketplace would cannibalize their own partners. ValidMind is US-focused with no Canadian validator relationships.

**Revenue:** 20 clients × 10 sprints/year × $20K × 15% = $600K marketplace revenue. At 50 clients: $1.5M/year from marketplace alone, on top of subscription revenue.

**MVP requirements (already in Phase 10):** Validator profiles + request workflow + secure validator portal + attestation workflow + platform fee invoicing.

### D-02: OSFI Examination Simulator (Deepen Current Exam Sprint)
**The problem:** FRFIs don't know what an examination looks like until they're in one. Exam failures are not caused by non-compliance — they're caused by poor examination preparation. First-time auditees answer the wrong questions, present evidence incorrectly, and miss gaps they would have caught with preparation.

**What no competitor builds:** A full simulation of the OSFI examination methodology. Presents the actual questions an OSFI examiner would ask (sourced from examination methodology, not just the guideline). Cross-references your live model inventory to generate answers. Identifies your vulnerabilities before the examiner does. Generates the examination response document.

**Beyond current Exam Sprint:** Current Exam Sprint gives a 30/60/90-day remediation plan based on identified gaps. The Simulation goes further: it replicates the examination interview, not just the gap analysis.

**Implementation:** Expand Exam Sprint module with a "Simulation Mode" that walks through a structured examination scenario, pulls live data from the model inventory, and generates the examiner Q&A document.

### D-03: Insurance Actuarial Model Governance — Depth Needed Beyond Phase 7
**Phase 7 built:** 14-category insurance model taxonomy, assumption register, backtesting log, dependency map.

**What still needs to be built for actuarial governance parity:**

| Feature | Description |
|---|---|
| Appointed Actuary sign-off workflow | Distinct from standard model approver. Actuarial reserving and capital models require the Appointed Actuary (OSFI-defined role) to sign. ClearMRM should have an "Appointed Actuary Attestation" step separate from the standard validation approval. |
| Cat model adjustment factor tracking | When an insurer uses RMS or AIR as the vendor cat model, their internal team applies adjustment factors (EMFs, demand surge loading, climate peril loading). ClearMRM should track these internal adjustments alongside the vendor model record — creating a full audit trail of the combined cat risk view. |
| IFRS 17 CSM sensitivity analysis documentation | The Contractual Service Margin under IFRS 17 is sensitive to actuarial model assumptions. ClearMRM should allow actuaries to document which model assumptions feed the CSM and how sensitivity tests were performed. |
| ORSA model dependency chain | The Own Risk and Solvency Assessment (ORSA) depends on multiple models feeding into capital projections. ClearMRM's dependency map should have an ORSA-specific view showing the full chain from input models to ORSA outputs. |

### D-04: OSFI Regulatory Intelligence Feed
**The problem:** OSFI publishes guidance letters, FAQ updates, speeches, consultation papers, and finalized guidelines continuously. Each may affect specific model types. Today, compliance teams track this manually — someone has to read every OSFI publication and determine if it affects any of their 100+ models.

**What no competitor builds:**
- Monitor OSFI's guidance library for new publications automatically
- Parse new publications using AI to identify which OSFI E-23 sections are affected
- Cross-reference against the institution's model inventory to identify which specific models may require review
- Generate a one-page impact memo: "OSFI published [title]. This affects your [N] models of type [X]. Recommended actions: [Y]."
- Send to the MRM team automatically

**Implementation:** Scheduled job monitors OSFI guidance library RSS/sitemap. On new publication, AI parses the document, extracts affected model types, and cross-references inventory. Generates and sends impact assessment. Results visible in Regulatory Calendar.

### D-05: AMF Quebec Dual-Compliance Overlay (Phase 11 — Accelerate)
**The problem:** Quebec-domiciled FRFIs are governed by OSFI E-23 federally AND by Quebec Law 25 (privacy/AI) AND by AMF guidelines locally. No platform provides a single governance view across both frameworks simultaneously.

**Market:** 40+ Quebec FRFIs including Desjardins subsidiaries, National Bank, Laurentian Bank, and dozens of Quebec caisses. Zero existing solution.

**What to build:**
- Quebec Law 25 compliance checklist mapped to each model (privacy impact assessment, AI disclosure obligations)
- AMF-specific model governance fields for models subject to AMF oversight (insurance product pricing models)
- Combined OSFI E-23 + AMF examination package PDF
- Dual-compliance status badge on model inventory (OSFI: compliant / AMF: compliant)

### D-06: OSFI B-15 Climate Risk Module (Phase 11)
**The problem:** OSFI's B-15 Climate Risk Management guideline creates model risk obligations for physical and transition risk models. The same CRO managing E-23 compliance is responsible for B-15. But no platform provides integrated E-23 + B-15 governance.

**What to build:**
- Climate-specific model taxonomy: physical risk (flood, wildfire, severe weather), transition risk (carbon pricing, stranded asset), climate-adjusted cat model
- B-15 specific validation requirements mapped to the existing validation workflow
- Combined E-23 + B-15 board report section
- Climate model dependency chains (how physical risk models feed into cat models, capital models, ORSA)

**Cross-sell:** Every E-23 client is a natural B-15 prospect. Add-on pricing at $15K–$30K/year on top of existing subscription.

### D-07: B-10 Vendor Portal — The Reverse Flow
**The problem:** B-10 requires FRFIs to conduct due diligence on every vendor model. Vendors respond to 15–20 different FRFI due diligence requests per year, sending the same documentation 15–20 times by email.

**What no competitor builds:** A vendor-facing portal where AI vendors selling into the Canadian market:
- Register their AI/ML models once (name, methodology, training data summary, performance metrics, explainability approach, known limitations)
- Maintain their documentation (updated when model version changes)
- Grant access to specific FRFI clients who import the vendor documentation directly into their ClearMRM vendor assessment

**Revenue model:** Vendors pay ClearMRM for a portal subscription ($5K–$15K/year per vendor). FRFIs get higher-quality vendor documentation. ClearMRM earns on both sides.

**Network effect:** The more FRFIs on ClearMRM, the more valuable the vendor portal (vendors reach more clients through one registration). The more vendors on the portal, the faster FRFI vendor due diligence becomes.

### D-08: Canadian Insurance Bias Detection
**The problem:** OSFI E-23 requires bias and fairness assessment for AI/ML models. Canadian insurance regulators (FSRA in Ontario, AMF in Quebec, OSFI federally) have specific concern about geographic proxy variables. A Toronto postal code (M5V) correlates with race, ethnicity, and income in ways that may constitute prohibited discrimination in insurance pricing.

**What no competitor builds:** Fairness testing designed specifically for Canadian insurance pricing regulation:
- Postal code proxy risk detection: flag postal codes that correlate with protected characteristics per Canadian census data
- GISA grouping analysis: check if geographic rating factors align with GISA (General Insurance Statistical Agency) accepted groupings
- FSRA rating factor compliance check: compare model rating factors against FSRA's approved/prohibited factor list for Ontario auto
- AMF pricing factor check: equivalent for Quebec
- Fairness testing results stored in validation record as OSFI-required evidence

**Why Fiddler AI cannot do this:** Fiddler AI provides generic demographic parity and equalized odds metrics. It does not know Canadian insurance regulation, GISA groupings, FSRA prohibited factors, or the postal code correlation problem specific to Canadian demographics.

---

## Product Decision Record — June 25, 2026

### What Phase 12 and Phase 13 Are NOT

**Phase 12 does not make ClearMRM unique.** These are compliance parity items. They make the platform credible for OSFI examination. Build them efficiently — they are infrastructure.

**Phase 13 is the business.** The 8 differentiator services are what justify a $72K–$144K subscription, a 2.6–3.0× ROI claim, and a $12M ARR trajectory. No compliance parity item builds a moat. The Validator Marketplace, the Examination Simulator, the Actuarial Governance depth, the Regulatory Intelligence Feed, the Quebec overlay, the B-15 module, the Vendor Portal, and the Canadian Insurance Bias Detection — these are the moat.

### Build Sequence (Revised)

| Priority | Phase | Target |
|---|---|---|
| P0 | Validator Marketplace MVP (Phase 10) | October 31, 2026 |
| P0 | Phase 12 Appendix 1 fields (CP-01, CP-02, CP-03) | July 31, 2026 |
| P1 | Phase 12 Model Rationale AI/ML extension (CP-07 AI/ML) | August 31, 2026 |
| P1 | Phase 12 Decommission workflow (CP-06) | September 30, 2026 |
| P1 | Phase 12 Deployment checklist (CP-10) | September 30, 2026 |
| P1 | PSI monitoring (Phase 9C) | August 31, 2026 |
| P2 | Phase 12 Data governance (DG-01, DG-02, DG-04) | October 31, 2026 |
| P2 | Phase 12 Governance evidence (GV-01, GV-02, GV-03, GV-04) | November 30, 2026 |
| P2 | Phase 12 Validation scope checklist | October 31, 2026 |
| P2 | OSFI Examination Simulator (D-02) | November 30, 2026 |
| P3 | Phase 12 Remaining items (CP-04, CP-05, CP-08, CP-09) | December 31, 2026 |
| P3 | OSFI Regulatory Intelligence Feed (D-04) | December 31, 2026 |
| P3 | Actuarial governance depth: Appointed Actuary workflow, cat adjustment tracking (D-03) | Q1 2027 |
| P4 | AMF Quebec overlay (D-05) | Q1 2027 |
| P4 | Canadian Insurance Bias Detection (D-08) | Q1 2027 |
| P5 | B-10 Vendor Portal (D-07) | Q2 2027 |
| P5 | OSFI B-15 Climate Risk Module (D-06) | Q2 2027 |

---

*ClearMRM is built by Nimblestride Inc., a Canadian fintech company. All AI processing uses AWS Bedrock ca-central-1. Data never leaves Canada. PIPEDA and Quebec Law 25 compliant.*
