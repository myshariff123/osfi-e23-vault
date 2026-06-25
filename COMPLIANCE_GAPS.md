# ClearMRM — OSFI E-23 Regulatory Compliance Gap Analysis

**Source:** OSFI Guideline E-23 – Model Risk Management (2027), official text from the Office of the Superintendent of Financial Institutions (OSFI), effective May 1, 2027.  
**Cross-referenced against:** ClearMRM codebase (server.js, schema.sql, frontend/index.html), Strategic Roadmap (Phases 1–11), and Competitive Landscape.  
**Last reviewed:** June 2026

---

## Part A — Honest Competitive Duplication Assessment

Before listing gaps, this section answers a critical strategic question: **what does ClearMRM duplicate from existing platforms, and what does no existing player provide?**

### What ClearMRM Shares With Existing Competitors
The following capabilities exist in some form at ValidMind, IBM OpenPages, Archer GRC, Collibra, or Yields.io. ClearMRM is NOT unique in building them — but must have them for basic OSFI compliance credibility:

| Capability | Competitor(s) With This |
|---|---|
| Model inventory / registry | ValidMind, IBM, Archer, Collibra, Yields.io |
| Risk tiering / rating | ValidMind, Yields.io, IBM, Archer |
| Validation workflow | ValidMind, IBM, Yields.io |
| Audit trail | ValidMind, IBM, Archer |
| Board / examiner reporting | IBM, Archer, Yields.io |
| AI-generated commentary | ValidMind, IBM OpenPages |
| Vendor assessment | Archer GRC, IBM |
| Drift / PSI monitoring | Fiddler AI, Arthur (not in MRM governance context) |
| SHAP / LIME explainability | Fiddler AI, Arthur, ValidMind |

**These are compliance parity items.** ClearMRM must have them to be taken seriously, but they are NOT the reason a Canadian FRFI will choose ClearMRM over IBM or ValidMind. They are table stakes.

### What No Existing Player Provides in the Canadian Market
These are the only things worth competing on. Zero existing MRM platforms in Canada offer these:

| Unique Capability | Why No Competitor Has It |
|---|---|
| **Validator Marketplace** — $20K/model vs $75K market rate | Requires Canadian validator network + two-sided platform. No competitor has built this anywhere in the world for Canadian OSFI validation. |
| **OSFI Examination Simulator** — reproduces the actual examination | Requires deep OSFI examination methodology knowledge baked into AI. US-based competitors have no incentive to build for OSFI specifically. |
| **Insurance Actuarial Model Governance** — IBNR, cat, MCT, ORSA, IFRS 17 as first-class model types | ValidMind/Yields.io serve data scientists and banks. No platform treats the actuary as the primary user. |
| **OSFI Regulatory Intelligence Feed** — auto-parse OSFI publications → flag affected models | Requires Canadian regulatory data access and OSFI-specific domain mapping. Only a Canadian-focused platform builds this. |
| **AMF Quebec Dual-Compliance Overlay** — OSFI E-23 + Quebec Law 25 + AMF in one platform | 40+ Quebec FRFIs, no solution exists anywhere. |
| **OSFI B-15 Climate Risk Module** — climate model governance under B-15, same buyer as E-23 | No MRM platform has combined E-23 + B-15 for the same CRO buyer. |
| **B-10 Vendor Portal (Reverse Flow)** — AI vendors self-register, share docs with multiple FRFI clients | No platform addresses the vendor side of B-10. Vendors currently email PDFs. |
| **Canadian Insurance Bias Detection** — postal code proxy detection per GISA + provincial guidelines | Generic bias tools (Fiddler AI) don't know Canadian insurance pricing regulation. |

**These 8 capabilities are the product.** Everything else is infrastructure that makes the product credible.

---

## Part B — OSFI E-23 Line-by-Line Gap Analysis

Every requirement below is taken verbatim from the official OSFI E-23 text. Status reflects the current codebase state as of June 2026.

### Status Legend
- ✅ **Built** — requirement met in current codebase
- ⚠️ **Partial** — foundation exists but requirement not fully satisfied
- ❌ **Missing** — not built, not in roadmap
- 🗓️ **Roadmapped** — not built, but planned in existing roadmap (Phases 9–11)

---

### Section A.4 — Key Terms (Definitions that must be tracked per model)

OSFI defines six distinct roles. All six must be captured per model in the inventory.

| Role | OSFI Definition | ClearMRM Status |
|---|---|---|
| Model Owner | "unit(s) or individual(s) responsible for coordinating model development, implementation, deployment, ongoing monitoring and maintaining documentation" | ✅ `model_owner_name/email` tracked |
| Model Developer | "unit(s) or individual(s) responsible for designing, developing, evaluating, and documenting a model's methodology" | ❌ Not a distinct field — collapsed into owner |
| Model Reviewer | "unit(s) or individual(s) responsible for reviewing conceptual soundness, inputs, methodology, assumptions, and performance" | ✅ `assigned_to_email` in validations |
| Model Approver | "unit(s) or individual(s) with authority to approve model use" | ⚠️ `approved_by_email` in validations only — not tracked as a standing model-level role |
| Model User | "unit(s) or individual(s) that rely on model outputs to inform business decisions" | ❌ Not tracked |
| Model Stakeholder | "all parties involved in model lifecycle, use and governance (including legal, compliance)" | ❌ No stakeholder tracking |

**Build required:** Add `model_developer`, `model_users[]`, `model_stakeholders[]` fields to `models` table and model detail form.

---

### Section B.1 — Organizational Enablement (Principle 1.1)

> "MRM should involve a multi-disciplinary team representing a wide range of expertise and functions from across the organization, including legal or ethics professionals as appropriate."

> "Institutions should be able to provide evidence that they are structured and resourced to support a sound governance framework."

| Requirement | Status | Gap |
|---|---|---|
| Multi-disciplinary team involvement documented | ❌ | No per-model stakeholder discipline tracking (legal, ethics, compliance, IT, data science, business, risk). An examiner will ask: "Who from Legal reviewed this AI model?" |
| Evidence of adequate resourcing | ❌ | No resource allocation evidence module |

---

### Section B.2 — MRM Framework (Principle 1.2)

> "In cases where model risk falls outside the institution's risk appetite, the institution should establish appropriate remediation actions."

| Requirement | Status | Gap |
|---|---|---|
| Risk appetite thresholds defined | ⚠️ | Risk Appetite Statement Wizard generates a document but does not define machine-readable thresholds that auto-flag models |
| Model-level breach of risk appetite flagged | ❌ | No `outside_risk_appetite` flag, no remediation plan field, no breach dashboard |
| Remediation actions tracked for out-of-appetite models | ❌ | Not built |

---

### Section C.1 — Model Identification (Principle 2.1)

> "Institutions should have defined processes to periodically survey operations to identify all models."

> "inclusive of decommissioned models for a period the institution considers reasonable."

| Requirement | Status | Gap |
|---|---|---|
| Periodic model survey process | ❌ | No survey workflow, no business unit declaration form, no shadow model reconciliation |
| Decommissioned models retained with retention period | ❌ | Archive/soft-delete ≠ formal decommission with retention period. Decommissioned models disappear from the active inventory with no retention tracking. |

---

### Section C.2 — Model Risk Rating (Principle 2.2)

> "Institutions may include a risk rating category that implies a negligible level of inherent model risk and therefore exempts such models from full model lifecycle governance requirements. There should be a robust process to approve and track such exemptions."

> "Externally developed models should be assessed for model risk ratings on a standalone basis."

> "Visibility of both the inherent and residual model risk, however, provides a view of the extent of risk mitigation and is useful for reporting to senior management."

| Requirement | Status | Gap |
|---|---|---|
| Negligible / Tier 0 risk category with exemption tracking | ❌ | Only Tier 1, 2, 3 exist. No mechanism to formally exempt low-significance models with audit trail. |
| External model standalone risk assessment | ✅ | `is_third_party` flag, vendor assessments enforce separate rating |
| Residual model risk visibility (separate from inherent) | ❌ | Only inherent tier shown. No `residual_risk_rating` field or residual risk narrative separate from the validation findings. |

---

### Section C.3 — Risk Management Intensity (Principle 2.3)

> "limits or constraints on model usage (for example, limiting the model's scope, implementing additional safeguards, or even pursuing a different modeling approach)"

> "controls and mitigants used to manage residual model risk (for example, allocating capital reserves to cover potential losses, enhancing model's conservatism, and contingency planning)"

| Requirement | Status | Gap |
|---|---|---|
| Usage limits/constraints per model | ❌ | No `usage_limits` field (max dollar exposure, max decision volume, approved business units, override threshold) |
| Contingency plans per model | ❌ | No `contingency_plan` structure (backup model, manual override procedure, escalation contact, fallback data source) |
| Capital reserve / conservatism documentation for residual risk | ❌ | Not built |
| AI/ML: "extensive use of AI/ML should have correspondingly mature governance" | ⚠️ | AI/ML models have no distinct governance intensity beyond risk tier. No AI-specific governance maturity assessment. |

---

### Section D.1 — Policies, Procedures, and Controls (Principle 3.1)

> "identify and involve key stakeholders—such as data science teams, business units, compliance, ethics and legal teams, information technology, and risk management—early in the model lifecycle process"

> "be sufficiently flexible to accommodate evolving technologies, different model types (especially crucial given the 'black box' and autonomous nature of many AI/ML models)"

| Requirement | Status | Gap |
|---|---|---|
| Key stakeholder involvement tracked at model level | ❌ | Roles exist in Cognito/admin, but no per-model record of who from which discipline was involved |
| Black box model accommodation with alternative controls | ❌ | No `is_black_box` flag, no alternative controls documentation |

---

### Section D.2 — Model Rationale

> "articulating a well-defined purpose—including the model's scope, coverage, and how its outputs are to be used"

> "identifying the specific business use case and assessing the risk of the model's intended usage"

> For AI/ML: "level of transparency and explainability required", "need for alternative controls, especially for 'black box approaches' or autonomous models", "potential for the model to lead to biased outcomes, negative social and ethical implications, or privacy risks"

| Requirement | Status | Gap |
|---|---|---|
| Structured model purpose (scope, coverage, usage intent) | ⚠️ | Free-text `description` and `purpose`. No structured fields for scope, coverage, intended outputs. |
| Specific business use case identification | ⚠️ | `purpose` field exists but is narrative text. No structured `business_use_case` with `usage_risk_assessment`. |
| AI/ML design-phase: explainability level required | ❌ | No `explainability_level_required` enum (not_required / limited / standard / full_regulatory) captured at design. SHAP/LIME is planned for Phase 11 as output; the design-phase determination of *what level is needed* is different. |
| AI/ML design-phase: black box alternative controls needed | ❌ | No `is_black_box` flag, no `alternative_controls_description` field |
| AI/ML design-phase: bias potential assessment | ❌ | No bias potential field at model design time. The bias concern must be documented *before* the model is built, not only in monitoring. |
| AI/ML design-phase: ethical/privacy risk assessment | ❌ | No ethics or privacy risk field at design stage |

---

### Section D.2 — Model Data (Principle 3.2)

> Data must be: "accurate and fit-for-use... relevant and representative... compliant... traceable (having documented lineage and provenance)... timely (updated at an appropriate frequency)"

> "regularly perform thorough data quality checks (for example, outlier detection, missing value analysis, and consistency evaluations)"

> "implement controls to ensure quality and document provenance and use of synthetic data and proxy data"

> "Consideration needs be given to the potential for unwanted bias within the data which can translate into unfair model outputs with associated reputational risks."

| Requirement | Status | Gap |
|---|---|---|
| Structured data lineage (source system, table, refresh frequency, data owner) | ❌ | `input_data_sources` is free text only. No structured `model_data_sources` table. |
| Data quality check log (outlier detection, missing value analysis, consistency) | ❌ | Not built. |
| Synthetic/proxy data documentation and controls | ❌ | No flag or documentation field for synthetic or proxy data used in model development. |
| Representative population documentation | ❌ | No field confirming data represents the intended target population. |
| Bias in data: documentation and management | ❌ | No structured field for "understood and managed" data biases. |

---

### Section D.2 — Model Development (Principle 3.3)

> "standards for model documentation, including: setup and running of the model, limitations and restrictions on use, detailed descriptions of data creation/access/maintenance, detailed descriptions of model assumptions and methodology, the role of expert judgment including which experts are involved and how their input affects the model output, analyses and performance tests performed by developers"

> "explainability requirements, which may vary based on the model's purpose, level of autonomy, regulatory requirements, or the potential impact on customers and stakeholders"

| Requirement | Status | Gap |
|---|---|---|
| Expert judgment register (who, what judgment, how it affects output) | ❌ | No `expert_judgments` table. Actuarial models rely heavily on expert judgment (tail factors, claim development assumptions). OSFI requires this documented. |
| Development documentation checklist/template | ❌ | No structured development documentation standards enforced at model creation. |
| Explainability requirements determined at development | ❌ | Planned for Phase 11 (SHAP/LIME outputs), but the *requirement-setting* step (what level is needed?) belongs at development, not output generation. |

---

### Section D.2 — Model Review (Principle 3.4)

> Review scope must include: "confirming or challenging the model risk rating", "reviewing third-party models and platforms or sub-components (including data and libraries) used for model development", "evaluating the level of explainability for the model workings as per the intended use of the model"

| Requirement | Status | Gap |
|---|---|---|
| Validation scope includes: risk rating confirmation | ⚠️ | Validation has findings and outcome fields but no structured scope checklist requiring the reviewer to explicitly confirm or challenge the risk rating. |
| Validation scope includes: explainability evaluation | ❌ | Explainability review is not a checklist item in the validation workflow. |
| Validation scope includes: sub-component review for vendor models | ❌ | Vendor assessments exist at the vendor level. No sub-component tracking (data libraries, foundational AI models, embedded algorithms used by the vendor). |
| Validation scope includes: data quality and appropriateness | ⚠️ | Findings field can capture this, but no structured data quality review checklist in the validation form. |

---

### Section D.2 — Model Approval

> "The model approval decision typically involves two components: (1) whether the model is suitable for production based on its intended use; (2) affirming the assigned model risk rating and residual risk assessment."

| Requirement | Status | Gap |
|---|---|---|
| Approval explicitly covers residual risk assessment | ❌ | Approval records who approved and when, but no `residual_risk_assessment` field or rating captured at approval. |
| Approval can proceed despite weaknesses if mitigants documented | ⚠️ | Conditions field exists in validations. But no formal "approved with limitations" status + mitigant documentation requirement. |

---

### Section D.2 — Model Deployment (Principle 3.5)

> "consistency between data used to develop the model and the production dataset"
> "tests demonstrating that the model operates as expected in the production environment"
> "risk assessments for related risks prior to deployment such as cybersecurity risk, infrastructure vulnerabilities" (B-13 and E-21)
> "review of explainability requirements and communication of explanatory outputs to the appropriate stakeholders"

| Requirement | Status | Gap |
|---|---|---|
| Deployment checklist (dev/prod data consistency, production tests, security assessment) | ❌ | No deployment checklist. Models transition from approved to active with no formal deployment gate. |
| Cybersecurity/infrastructure risk assessment at deployment | ❌ | No link to OSFI B-13 or E-21 risk assessments. |
| Explainability requirements reviewed at deployment | ❌ | Not part of any workflow. |

---

### Section D.2 — Model Monitoring (Principle 3.6)

> "monitoring standards covering frequency, scope, and evaluation criteria as applied to different risk rating levels and model types"
> "both quantitative measures (performance metrics) and qualitative assessments (verifying the model is within its original scope)"
> "defining thresholds for breaches and criteria for material model modifications"
> "determining contingency plans for model unavailability, deterioration in model performance, or outright failure along with the escalation procedures"
> "implementing processes for handling AI/ML's unique challenges, such as autonomous decision making, autonomous re-parametrization, and the elevated potential for model drift"

| Requirement | Status | Gap |
|---|---|---|
| Monitoring frequency tied to risk tier (configurable per tier) | ⚠️ | Monitoring thresholds UI exists. Not persisted to DB with tier-based frequency enforcement (Tier 1: monthly, Tier 2: quarterly, Tier 3: semi-annual). |
| Quantitative performance metrics logged over time | 🗓️ | Phase 9C: PSI, Gini/AUC, residual drift planned. Not yet built. |
| Qualitative scope verification (is model being used within its original scope?) | ❌ | No qualitative monitoring checklist. |
| Contingency plans per model | ❌ | Not built. |
| Stakeholder notification / escalation procedures | ❌ | No automated notification when monitoring threshold is breached. |
| AI/ML: autonomous re-parametrization monitoring | ❌ | No mechanism to detect if an AI model has self-updated its parameters (relevant for self-learning models). |
| AI/ML: model drift processes | 🗓️ | Phase 9C plans PSI drift. Needs to auto-trigger revalidation on breach. |

---

### Section D.2 — Model Decommission

> "Alerting all relevant stakeholders of the planned decommission."
> "Retaining the retired model and documentation for a set period as a benchmark or fallback."
> "Determining what additional actions are needed for decommissions of any third-party models."
> "Monitoring downstream effects to ensure no residual impacts."

| Requirement | Status | Gap |
|---|---|---|
| Formal decommission lifecycle stage | ❌ | Archive/delete exists. OSFI names decommission as a formal lifecycle component with distinct requirements. Archive is not decommission. |
| Stakeholder notification on decommission | ❌ | Not built. |
| Documentation retention period tracking | ❌ | Not built. |
| Third-party model decommission coordination | ❌ | Not built. |
| Downstream model impact monitoring post-decommission | ❌ | Not built. |

---

### Appendix 1 — Model Inventory Mandatory Fields

The following fields are **explicitly listed in OSFI Appendix 1** as mandatory for non-negligible risk models:

| Appendix 1 Field | ClearMRM Status | Gap |
|---|---|---|
| Model ID | ✅ UUID in `models` table | — |
| Model name and description of key features and use | ✅ `name`, `description`, `purpose` | — |
| Model risk rating | ✅ `risk_tier` | — |
| Model owner | ✅ `model_owner_name`, `model_owner_email` | — |
| Model developer | ❌ Collapsed into owner field | Add `model_developer_name`, `model_developer_email` |
| Model origin (internally developed or vendor) | ✅ `is_third_party`, `vendor_name` | — |
| Model version | ✅ `version` field | — |
| Date of model's deployment into production | ✅ `deployed_at` | — |
| Model reviewer | ⚠️ `assigned_to_email` in validations only | Add standing `model_reviewer` role to model record |
| Model approver | ⚠️ `approved_by_email` in validations only | Add standing `model_approver` role to model record |
| Model dependencies | ✅ `model_dependencies` table | — |
| Data sources and description | ⚠️ `input_data_sources` (free text) | Structured `model_data_sources` table needed |
| **Approved uses of the model** | ❌ Missing field | Add `approved_uses` structured field |
| **Model limitations (including exceptions and additional requirements)** | ⚠️ In description | Structured `limitations` field with `exceptions` |
| Date of most recent model review | ✅ `last_validated_at` | — |
| **Monitoring status (with exceptions as applicable)** | ❌ Missing as distinct field | Add `monitoring_status` enum: active / breached / under_review / suspended |
| Next review date | ✅ `next_validation_due` | — |

---

## Part C — Sequenced Implementation Roadmap

Items are sequenced by: (1) OSFI examination likelihood of being checked, (2) effort required, (3) whether the item is a blocker for enterprise deals.

### Tier 0 — Compliance Parity (Must Have Before First Enterprise Client)
*These are table stakes. Not unique. But an OSFI examiner will check Appendix 1 on day one.*

| Seq | Item | OSFI Reference | Effort |
|---|---|---|---|
| CP-01 | Add `approved_uses` and `limitations` structured fields to model record | Appendix 1 | Low |
| CP-02 | Add `monitoring_status` enum field (active/breached/under_review/suspended) | Appendix 1 | Low |
| CP-03 | Split `model_developer` from `model_owner` as distinct fields | Appendix 1 | Low |
| CP-04 | Add `residual_risk_rating` and `residual_risk_narrative` to model approval | C.2, Approval | Low |
| CP-05 | Add Negligible / Tier 0 risk category with exemption approval and tracking | C.2 | Medium |
| CP-06 | Formal decommission workflow (state, notifications, retention period, downstream monitoring) | Decommission | Medium |
| CP-07 | Structured model rationale form (scope, coverage, usage intent, business use case, usage risk) | Model Rationale | Medium |
| CP-08 | Usage limits and constraints per model (max $ exposure, max decisions, approved units, override threshold) | C.3 | Low |
| CP-09 | Contingency plan per model (backup model, manual override, fallback data, escalation contact) | C.3, 3.6 | Low |
| CP-10 | Deployment checklist (dev/prod consistency, production tests, security assessment, explainability review) | Principle 3.5 | Medium |

### Tier 1 — AI/ML Governance (Required for Any AI/ML Model — Highest Examiner Focus in 2027)
*OSFI E-23's most significant new obligations. Every AI/ML model will be scrutinized here.*

| Seq | Item | OSFI Reference | Effort |
|---|---|---|---|
| AI-01 | AI/ML design-phase fields: `explainability_level_required` (not_required/limited/standard/full_regulatory) | Model Rationale AI/ML | Low |
| AI-02 | AI/ML design-phase fields: `is_black_box` flag + `alternative_controls_description` | Model Rationale AI/ML | Low |
| AI-03 | AI/ML design-phase fields: `bias_potential_assessment`, `ethical_risk_notes`, `privacy_risk_notes` | Model Rationale AI/ML | Low |
| AI-04 | Explainability checklist in validation scope (evaluating explainability level vs. intended use) | Principle 3.4 | Medium |
| AI-05 | XAI artifact upload to model/validation record (SHAP, LIME, feature importance files) | Principle 3.4 | Medium (Phase 11 accelerated) |
| AI-06 | Bias testing section in validation workflow (disparate impact, calibration, proxy variable analysis) | Principle 3.2, 3.4 | High |
| AI-07 | Autonomous re-parametrization detection flag per AI/ML model | Principle 3.6 AI/ML | Medium |
| AI-08 | PSI / drift monitoring metrics with tier-based frequency and auto-revalidation on breach | Principle 3.6 (Phase 9C) | Medium (Phase 9C) |

### Tier 2 — Data Governance (Design Phase Completeness)
*Required for Principle 3.2 and 3.3 compliance. Particularly examined for actuarial and AI/ML models.*

| Seq | Item | OSFI Reference | Effort |
|---|---|---|---|
| DG-01 | Structured data lineage table: source_system, source_table, refresh_frequency, data_owner, validated_at | Principle 3.2 | Medium |
| DG-02 | Data quality check log: check_type (outlier/missing_value/consistency/bias), result, run_date | Principle 3.2 | Medium |
| DG-03 | Synthetic/proxy data flag and provenance documentation per data source | Principle 3.2 | Low |
| DG-04 | Expert judgment register: judgment_description, expert_name, impact_on_output, magnitude | Principle 3.3 | Medium |

### Tier 3 — Governance & Survey (Organizational Evidence)
*These generate the evidence that satisfies OSFI's organizational governance expectations.*

| Seq | Item | OSFI Reference | Effort |
|---|---|---|---|
| GV-01 | Model stakeholder tracking: per-model record of which discipline engaged (legal, ethics, compliance, IT) | B.1, D.1 | Medium |
| GV-02 | Risk appetite linkage: machine-readable thresholds → auto-flag models outside appetite + remediation tracking | B.2, C.2 | Medium |
| GV-03 | Periodic model survey workflow: admin initiates, business units declare, shadow model reconciliation | C.1 | Medium |
| GV-04 | Monitoring config persistence by tier: tier-based default frequencies, monitoring results history | C.3, 3.6 | Medium |

### Tier 4 — Vendor/Third-Party Completeness (B-10 + E-23 Overlap)
*These are needed for Tier 1 institutions with significant vendor model exposure (cat models, SaaS claims tools).*

| Seq | Item | OSFI Reference | Effort |
|---|---|---|---|
| VP-01 | Vendor sub-component tracking: foundational model provider, embedded data libraries, fourth-party dependencies | Principle 3.4, B-10 | Medium |
| VP-02 | Vendor decommission coordination checklist (triggered when third-party model archived) | Decommission, B-10 | Low |
| VP-03 | Validation scope checklist item: sub-component review for vendor models | Principle 3.4 | Low |

---

## Part D — The 8 Unique Differentiators (No Existing Competitor Has These)

These are not OSFI compliance requirements per se — they are the reason a Canadian FRFI will choose ClearMRM over IBM, ValidMind, or a spreadsheet. Each solves a real problem that OSFI E-23 creates but that no existing platform addresses.

### D-01: Validator Marketplace (Phase 10 — Accelerate)
**The problem OSFI creates:** Every non-negligible model needs independent validation. At $75K/model, a 100-model FRFI cannot comply. Validators are booked 6–12 months out heading into May 2027.

**What ClearMRM does:** A two-sided marketplace where FRFIs request validation, and vetted Canadian validators accept sprints at $20K/model using ClearMRM's AI-generated draft as a starting point. ClearMRM earns 15% platform fee.

**Why no competitor has it:** Requires both the governance platform AND a Canadian validator network. No existing GRC/MRM platform has tried to disintermediate the $75K validation fee. This is structurally impossible for IBM or ValidMind — it would cannibalize their Big-4 partner relationships.

**Revenue scale:** 100 models × $20K × 15% = $300K platform revenue per client per year. At 20 clients, $6M ARR from marketplace alone.

### D-02: OSFI Examination Simulator (Accelerate Beyond Current Exam Sprint)
**The problem OSFI creates:** FRFIs don't know what an examination looks like until they're in one. OSFI examiners follow a specific methodology — they request an inventory, sample specific models, ask specific questions, and flag specific gaps. First-time auditees fail not because they lack compliance, but because they present their compliance poorly.

**What ClearMRM does:** A full simulation that replicates the OSFI examination methodology: presents the actual questions an examiner would ask, pulls answers from your model inventory, identifies vulnerabilities before the examiner does, generates the examination response document. Not exam tips — an actual simulation.

**Why no competitor has it:** Requires deep knowledge of the specific OSFI examination methodology (not just the guideline text) and the ability to cross-reference a live model inventory against examination questions in real time.

### D-03: Insurance Actuarial Model Governance (Phase 7 built, needs depth)
**The problem OSFI creates:** Actuarial models (IBNR/BF reserving, cat models, IFRS 17 CSM, MCT capital, ORSA) are the most financially material models at a P&C insurer. But no MRM platform understands actuarial science — they're built for data scientists.

**What ClearMRM does:** First-class governance for actuarial model types. Actuarial-specific validation workflows, Appointed Actuary integration, actuarial expert judgment documentation, cat model vendor governance (RMS/AIR/Verisk), IFRS 17 CSM model risk lifecycle.

**Why no competitor has it:** ValidMind/Yields.io were built by and for data scientists and quant analysts. No platform has actuaries as the primary user persona.

**Depth needed beyond Phase 7:**
- Appointed Actuary sign-off workflow (distinct from standard model approver)
- Cat model adjustment factor tracking (EMFs, demand surge, climate loading) alongside the vendor model
- IFRS 17 CSM sensitivity analysis documentation
- ORSA model dependency chain

### D-04: OSFI Regulatory Intelligence Feed
**The problem OSFI creates:** OSFI publishes speeches, FAQ updates, consultation papers, and guidance letters continuously. Each new publication may affect specific model types in your inventory. Compliance teams currently track this manually.

**What ClearMRM does:** An AI-powered feed that monitors OSFI's guidance library, parses new publications, and automatically identifies which models in your ClearMRM inventory are potentially affected. "OSFI published a new FAQ on AI explainability for underwriting models. You have 4 Tier 1 models that may require review."

**Why no competitor has it:** A US-based platform has no incentive to monitor OSFI publications specifically. This is a Canadian-only moat that deepens with every new OSFI publication.

### D-05: AMF Quebec Dual-Compliance Overlay (Phase 11 — Accelerate)
**The problem OSFI creates:** OSFI E-23 applies federally. Quebec Law 25 and AMF guidelines layer on top for Quebec-domiciled institutions. No platform provides a single governance view across both regulatory frameworks simultaneously.

**What ClearMRM does:** A Quebec overlay that shows, for each model, both its OSFI E-23 compliance status and its Quebec Law 25 / AMF compliance status. A Quebec FRFI can produce a combined OSFI + AMF examination package from a single platform.

**Why no competitor has it:** No existing MRM platform has built Quebec-specific regulatory mapping. The 40+ Quebec FRFIs (Desjardins subsidiaries, Laurentian Bank, National Bank subsidiaries, Quebec credit unions) have no solution.

### D-06: OSFI B-15 Climate Risk Integration (Phase 11)
**The problem OSFI creates:** OSFI's B-15 Climate Risk Management guideline creates new model risk obligations for climate risk models (physical risk models, transition risk models, climate-adjusted cat models). The same CRO who manages E-23 compliance also manages B-15.

**What ClearMRM does:** A B-15 module that adds climate-specific model types, climate model governance workflows, and a combined E-23 + B-15 examination package. Cross-sell to existing E-23 clients at no additional sales cost.

**Why no competitor has it:** No MRM platform has combined E-23 + B-15 for a single Canadian FRFI. Separate consultants handle each.

### D-07: B-10 Vendor Portal (Reverse Flow)
**The problem OSFI creates:** B-10 requires FRFIs to conduct due diligence on every vendor model they use. Vendors currently respond to each FRFI's due diligence requests separately — the same documentation sent to 20 different insurance companies via email.

**What ClearMRM does:** AI vendors selling into the Canadian market register in ClearMRM's Vendor Portal, maintain their model documentation, and share it directly with multiple FRFI clients through the platform. FRFIs import vendor documentation directly into their ClearMRM vendor assessment, replacing the email-and-PDF process.

**Why no competitor has it:** This requires addressing both sides of the B-10 relationship. No MRM platform has ever thought about the vendor's compliance burden.

**Revenue model:** Vendors pay ClearMRM for a vendor portal subscription. FRFIs get better vendor documentation. ClearMRM earns on both sides of the marketplace.

### D-08: Canadian Insurance Bias Detection (Postal Code Proxy)
**The problem OSFI creates:** OSFI E-23 requires bias and fairness assessment for all AI/ML models. Canadian insurance regulators (FSRA, AMF, OSFI) have specific concern about geographic variables being used as proxies for protected characteristics in pricing models. A Toronto postal code correlates with race and ethnicity in ways that violate provincial insurance regulation.

**What ClearMRM does:** A fairness testing module built specifically for Canadian insurance pricing regulation — detecting postal code proxy risk against GISA groupings, FSRA guidelines, and provincial rating factor prohibitions. Not generic bias testing — Canadian insurance–specific.

**Why no competitor has it:** Fiddler AI and Arthur provide generic fairness testing. They do not know Canadian insurance regulation. An insurer using Fiddler AI for OSFI E-23 compliance would still need to translate generic fairness metrics into regulatory-specific compliance evidence.

---

*This document should be reviewed and updated each time OSFI publishes new guidance or when ClearMRM marks a gap as resolved.*
