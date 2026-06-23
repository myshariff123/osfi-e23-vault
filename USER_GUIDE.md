# ClearMRM — User Guide & Operational Manual
### OSFI E-23 Model Risk Management Platform
**Version 4.0 | Last Updated: June 2026 | For Canadian FRFIs**

---

## Table of Contents

1. [About This Guide](#1-about-this-guide)
2. [OSFI E-23 Quick Reference](#2-osfi-e-23-quick-reference)
3. [Getting Started](#3-getting-started)
4. [Module 1 — Model Inventory](#4-module-1--model-inventory)
5. [Module 2 — Risk Rating Wizard](#5-module-2--risk-rating-wizard)
6. [Module 3 — Validation Workflow](#6-module-3--validation-workflow)
7. [Module 4 — Vendor (Third-Party) Assessment](#7-module-4--vendor-third-party-assessment)
8. [Module 5 — Board Report](#8-module-5--board-report)
9. [Module 6 — OSFI Examiner Export](#9-module-6--osfi-examiner-export)
10. [Module 7 — Model Change Management](#10-module-7--model-change-management)
11. [Module 8 — Ongoing Model Monitoring](#11-module-8--ongoing-model-monitoring)
12. [Module 9 — Model Risk Appetite Statement](#12-module-9--model-risk-appetite-statement)
13. [Module 10 — Regulatory Calendar](#13-module-10--regulatory-calendar)
14. [Module 11 — Exam Sprint Mode](#14-module-11--exam-sprint-mode)
15. [Module 12 — Admin Panel & Multi-Tenant](#15-module-12--admin-panel--multi-tenant)
16. [AI Features Reference](#16-ai-features-reference)
17. [Best Practices & Industry Standards](#17-best-practices--industry-standards)
18. [OSFI E-23 Compliance Checklist](#18-osfi-e-23-compliance-checklist)

---

## 1. About This Guide

This guide is written for compliance officers, Chief Risk Officers, model validators, and risk analysts at Canadian Federally Regulated Financial Institutions (FRFIs) using ClearMRM to meet OSFI Guideline E-23 requirements.

**Who should read this:**
- **CRO / VP Model Risk** — Chapters 2, 9, 12, 13, 14, 17
- **Model Risk Analyst** — Chapters 4, 5, 6, 7, 11
- **Independent Validator** — Chapters 6, 7, 16
- **IT / System Administrator** — Chapters 3, 15
- **Internal Audit** — Chapters 6, 9, 14, 18

**Platform URL:** https://clearmrm.nimblestride.ca  
**Support:** myousufshariff@gmail.com  
**Data residency:** AWS Canada (ca-central-1) — PIPEDA compliant  
**AI provider:** AWS Bedrock (Claude) — all data stays in Canada

---

## 2. OSFI E-23 Quick Reference

OSFI Guideline E-23 (September 2025, effective **May 1, 2027**) applies to all federally regulated financial institutions in Canada. It establishes expectations for managing risk arising from the use of models.

### Key Requirements by Section

| Section | Requirement | ClearMRM Feature |
|---|---|---|
| §3.1 | Model inventory covering all material models | Model Inventory |
| §3.2 | Risk tiering (Tier 1/2/3) based on complexity and impact | Risk Rating Wizard |
| §4.1 | Model documentation standards | Model form fields, purpose, methodology |
| §4.2 | Model development and approval controls | Validation Workflow |
| §4.3 | Independent model validation program | Validation Workflow, Validator Marketplace (Phase 5) |
| §4.4 | Immutable audit trail | Audit Trail (append-only, trigger-protected) |
| §4.5 | Ongoing model performance monitoring | Ongoing Monitoring Module |
| §5 | Third-party / vendor model governance | Vendor Assessment Module |
| Board | Board-level model risk oversight reporting | Board Report, MRA Statement |

### OSFI E-23 Risk Tiers

| Tier | Description | Validation Frequency |
|---|---|---|
| **Tier 1 — High Risk** | Score ≥11, OR regulatory use, OR never validated. Complex/ML models with high financial impact. | Annual (every 12 months) |
| **Tier 2 — Medium Risk** | Score 6–10. Moderate complexity or impact. | Every 24 months |
| **Tier 3 — Lower Risk** | Score <6. Simple, low-impact models. | Every 36 months |

> **OSFI Examiner Expectation:** Every Tier 1 model must have a documented, independent validation on record. "Independent" means the validator was not involved in model development.

---

## 3. Getting Started

### First Login
1. Navigate to https://clearmrm.nimblestride.ca
2. Enter your email and password
3. If your institution uses SSO (SAML/Azure AD), click **"Sign in with SSO"** and enter your email domain

### New Institution Onboarding
1. Click **"Create Account →"** on the login screen
2. **Step 1 — Institution Details:** Enter institution name, type (bank/credit union/insurance), asset size tier, and domain
3. **Step 2 — Administrator Account:** Enter your name, email, and a secure password
4. Submit — ClearMRM automatically provisions your account and seeds 3 demo models to help you explore the platform

### First-Week Checklist
- [ ] Log in and review the 3 demo models (Credit Scoring, AML Monitor, IFRS 9 ECL)
- [ ] Run the **Risk Rating Wizard** on at least one demo model to understand the scoring
- [ ] Open the **Regulatory Calendar** to confirm it's pulling from your models
- [ ] Create your **Model Risk Appetite Statement** (Chapter 12)
- [ ] Invite your team via the **Admin Panel** (Chapter 15)
- [ ] Run an **Exam Sprint** to see your current compliance posture (Chapter 14)

---

## 4. Module 1 — Model Inventory

**OSFI Reference:** §3.1 — Model Inventory  
**Nav:** 🗂️ Model Inventory

### What Counts as a "Model" Under OSFI E-23?

OSFI defines a model as a quantitative method, system, or approach that applies statistical, economic, financial, or mathematical theories to transform input data into quantitative estimates. Common examples at Canadian FRFIs:

- Credit risk scorecards (retail, commercial, SME)
- IFRS 9 / ECL models (PD, LGD, EAD)
- AML/fraud detection models
- Capital models (IRB, ICAAP)
- Stress testing models
- Pricing models (mortgage, derivatives)
- ALM / interest rate risk models
- Insurance reserving models
- Behavioural models (prepayment, churn)
- Third-party vendor models (e.g., Moody's, FICO)

> **Best Practice:** When in doubt, include the model. OSFI examiners apply the "if it influences a significant decision, it is a model" test. An over-inclusive inventory is better than an under-inclusive one.

### Adding a New Model

1. Click **"+ Add Model"** in the Model Inventory screen
2. Use **AI Smart Fill** — enter just the model name and click **"AI Suggest Fields"**. The AI pre-populates methodology type, purpose, business unit, data sources, and an OSFI risk consideration. Review and adjust.
3. Complete required fields: Name, Business Unit, Owner Name, Owner Email, Methodology Type
4. For third-party/vendor models, toggle **"Third-Party Vendor Model"** and enter vendor name and product
5. Save — the model appears in inventory with status "active" and risk tier "Unrated"

### Best Practices for Model Inventory

- **Name models consistently:** Use a naming convention like `[BU]-[ModelType]-[Version]` (e.g., `RETAIL-CreditScore-v2.1`)
- **Assign owners:** Every model must have a named Model Owner responsible for ongoing governance
- **Document purpose clearly:** The purpose field is what OSFI examiners read first. Describe what the model does, what decisions it informs, and what would happen if it failed
- **Tag vendor models:** Third-party models require additional §5 governance — tagging them ensures they appear in Vendor Assessment tracking
- **Use CSV Import** for bulk onboarding: Download the template from the Import screen and upload up to 500 models at once

### Archive vs. Delete

ClearMRM never permanently deletes models (OSFI E-23 §4.4 requires audit trail preservation). Use **"Archive"** to retire a model — it is hidden from active views but preserved in the audit trail and available for examiner review.

---

## 5. Module 2 — Risk Rating Wizard

**OSFI Reference:** §3.2 — Model Risk Tiering  
**Nav:** Via "Rate Risk" button on any model detail page

### The 8-Question Risk Scoring Framework

| Question | Max Score | OSFI Basis |
|---|---|---|
| Financial Impact | 4 | §3.2 — Materiality |
| Model Complexity | 3 | §3.2 — Technical Risk |
| Regulatory Use | 3 | §3.2 — Regulatory Capital/Reporting |
| Decision Volume | 3 | §3.2 — Breadth of Impact |
| Last Validated | 3 | §4.3 — Validation Currency |
| Data Quality | 3 | §4.1 — Model Inputs |
| Vendor Model | 2 | §5 — Third-Party Risk |
| Multi-Business Unit | 1 | §3.2 — Cross-Entity Impact |
| **Total** | **22** | |

**Tier 1 triggers (automatic):** Score ≥11, OR regulatory use answer = Yes, OR never validated

### AI Risk Reasoning

After scoring, click **"Get AI Advice"** on the Model Detail page. The AI (Claude Sonnet) provides:
- An executive risk assessment explaining the tier determination
- Specific OSFI E-23 gaps for this model
- Immediate remediation actions
- Validation scope recommendation
- Estimated validation effort

> **Best Practice:** Run the Risk Rating Wizard within 30 days of adding a new model. All models should have a tier assigned before the May 2027 deadline. OSFI examiners expect risk tier assignment to be documented and defensible.

### Re-Rating Models

Re-rate a model when:
- A material change is logged (Change Management triggers this automatically)
- A model moves from development to production
- The model's regulatory use status changes
- Significant changes in decision volume or financial impact

---

## 6. Module 3 — Validation Workflow

**OSFI Reference:** §4.3 — Independent Model Validation  
**Nav:** ✅ Validations

### Validation States

```
requested → assigned → in_progress → findings_submitted → approved → closed
```

| State | Who Acts | What Happens |
|---|---|---|
| **requested** | Model Owner / Risk Analyst | Validation request created, pre-assessment AI runs automatically |
| **assigned** | Admin / Validator | Assigned to an independent validator |
| **in_progress** | Validator | Validator conducts review, documents findings |
| **findings_submitted** | Validator | Findings entered; AI Findings Analyzer runs |
| **approved** | Senior Validator / CRO | AI Approval Check confirms readiness; approval recorded |
| **closed** | Admin | Formal closure; AI generates audit narrative (§4.4) |

### AI Features in Validation Workflow

**1. AI Pre-Assessment** (auto-runs on request)
- Assesses validation scope, data requirements, expected effort
- Identifies OSFI §4.3 requirements that apply to this specific model type

**2. AI Findings Analyzer** (click after findings submitted)
- Classifies finding severity (critical/high/medium/low)
- Maps findings to specific OSFI E-23 sections
- Scores findings completeness (0–100)
- Recommends conditions for approval
- Suggests remediation timeline

**3. AI Approval Readiness Check** (click before approving)
- Verifies all E-23 §4.3 documentation requirements are met
- Lists what is present vs. what is missing
- Provides binary approval recommendation with rationale

**4. AI Closure Summary** (auto-generated on close)
- Creates a formal 3-sentence audit narrative per §4.4
- Stored immutably — cannot be edited after generation

### Independence Requirement

OSFI E-23 §4.3 requires validators to be **independent from model development**. ClearMRM enforces this by recording who requested, assigned, and completed each validation in the immutable audit trail. When assigning validators:
- Use a validator from a different team than the model developers
- For Tier 1 models at smaller FRFIs, consider external validators (see Phase 5 Validator Marketplace)
- Document the validator's qualifications in the findings notes field

### Validation Outcomes

| Outcome | Meaning | Next Step |
|---|---|---|
| **pass** | Model meets all validation criteria | Schedule next validation per tier cycle |
| **conditional_pass** | Model passes with conditions to be remediated | Document conditions, set remediation deadline |
| **fail** | Model fails validation | Model should be restricted or taken offline; re-validate after remediation |

---

## 7. Module 4 — Vendor (Third-Party) Assessment

**OSFI Reference:** §5 — Third-Party Model Governance  
**Nav:** 🏢 Vendor Assessments

### OSFI §5 Requirements

OSFI E-23 §5 requires FRFIs to govern third-party models with the same rigor as internally developed models. This includes:
- Understanding the model's methodology and limitations
- Obtaining documentation from the vendor
- Assessing ongoing performance
- Having a credible exit plan
- Ensuring SLA terms are documented

### The 7-Question §5 Checklist

| # | Question | OSFI §5 Basis |
|---|---|---|
| 1 | SLA documented and reviewed | §5.2 — Contractual requirements |
| 2 | Data access and transfer documented | §5.3 — Data governance |
| 3 | Audit rights established | §5.4 — Right of access |
| 4 | Exit plan documented | §5.5 — Business continuity |
| 5 | Concentration risk assessed | §5.6 — Vendor concentration |
| 6 | Model documentation received | §5.3 — Documentation standards |
| 7 | Override capability in place | §5.7 — Model governance |

### Risk Score Calculation

- Each "Yes" answer = 2 points (max 14)
- **High Risk:** Score ≤6 (4 or fewer items satisfied)
- **Medium Risk:** Score 7–10
- **Low Risk:** Score 11–14 (6–7 items satisfied)

### AI §5 Deep Dive

After completing the initial assessment, click **"AI OSFI §5 Deep Dive"** for:
- OSFI §5 compliance score (0–100)
- Critical gaps with remediation actions and timelines
- Concentration risk narrative
- Whether regulatory disclosure is required
- Trend analysis (improving/stable/deteriorating vs. prior assessments)
- Next assessment priority recommendation

> **Best Practice:** Conduct vendor assessments at least annually, or whenever the vendor makes a material change to the model. For high-risk vendors, consider quarterly reviews. Document all vendor communications in the notes field — OSFI examiners will look for evidence of active oversight.

---

## 8. Module 5 — Board Report

**OSFI Reference:** §4 — Model Risk Governance (Board Oversight)  
**Nav:** 📑 Board Report

### What the Board Report Contains

The AI-generated PDF board pack (typically 8–12 pages) includes:

1. **Executive Risk Summary** — AI-drafted 4-sentence CRO briefing with compliance posture
2. **Model Inventory KPIs** — Tier breakdown, overdue validations, unrated models
3. **Risk Concentration Analysis** — Which business units carry the most model risk
4. **Validation Pipeline** — Open workflows, completed validations, outcomes
5. **Top Risk Models** — Tier 1 models with AI reasoning for their risk designation
6. **Audit Trail Summary** — Recent material events

### Best Practices for Board Reporting

- Generate the board report **quarterly** at minimum; monthly for institutions with active model pipelines
- Present to the Board Risk Committee or Audit Committee, not just management
- Keep prior reports — OSFI examiners may ask to see a history of board reporting on model risk
- The AI narrative is a draft — review and annotate before presenting to the Board

---

## 9. Module 6 — OSFI Examiner Export

**OSFI Reference:** All sections — Supervisory Review Response  
**Nav:** 🏛️ Examiner Export

### When to Use

Use the Examiner Export when:
- OSFI has issued an examination notice (supervisory review)
- Your institution is preparing for a thematic review of model risk
- You need to respond to an OSFI information request
- You are completing an Annual Compliance Self-Assessment

### The 6-Page Supervisory Review Package

| Page | Content | OSFI Reference |
|---|---|---|
| 1 | Cover, KPI summary, AI compliance narrative | All §§ |
| 2 | Complete model inventory table with tiers | §3.1 |
| 3 | Tier 1 high-risk model detail with AI reasoning | §3.2 |
| 4 | Validation evidence (status, findings, outcomes) | §4.3 |
| 5 | Vendor assessment summary (§5 checklist, AI) | §5 |
| 6 | Management attestation with signatory lines | §4 |

> **Important:** The export is generated in real time from your live data. Ensure your model inventory, validations, and vendor assessments are current before generating the export for submission to OSFI.

---

## 10. Module 7 — Model Change Management

**OSFI Reference:** §4.2 — Model Development and Approval; §4.3 — Triggers for Re-validation  
**Nav:** Model Detail → Change History section

### What Requires a Change Log Entry

OSFI E-23 expects institutions to track **material model changes** — defined as any change that could affect model outputs, applicability, or regulatory compliance. Log a change when:

| Change Type | Example | Likely Materiality |
|---|---|---|
| **Major** | New methodology, new training data, model rebuild | High — likely material |
| **Minor** | Threshold recalibration, data pipeline update | Medium — AI assessment recommended |
| **Patch** | Bug fix, parameter correction | Low — usually non-material |

### Change Categories

- **Methodology** — Changes to the core statistical/ML approach
- **Data Source** — New, changed, or removed input data
- **Threshold / Cutoff** — Score threshold or decision boundary changes
- **Vendor** — Third-party model update from vendor
- **Regulatory** — Change driven by regulatory requirement
- **Other** — Any other operational change

### AI Materiality Check

After logging a change, click **"AI Materiality Check (OSFI §4.3)"**:

- **Materiality Score (0–100):** Quantified assessment of how significant the change is
- **Revalidation Required:** Whether OSFI E-23 §4.3 requires independent re-validation
- **Revalidation Urgency:** Immediate / Within 90 days / Next validation cycle
- **Risk Implications:** Specific consequences if the change is not validated
- **OSFI Sections Implicated:** Exact §references affected

> **Best Practice:** Never manually mark a change as "non-material" for a Tier 1 model without running the AI materiality check. OSFI examiners look for documented materiality assessments — an AI-generated assessment with OSFI §references is stronger evidence than a subjective judgment.

### Re-Validation Banner

When a material change is logged, the model's detail page shows a red **"Re-validation Required"** banner. This banner remains until a new validation reaches "approved" status. Do not submit the model to OSFI examiner review while this banner is active.

---

## 11. Module 8 — Ongoing Model Monitoring

**OSFI Reference:** §4.5 — Ongoing Monitoring  
**Nav:** Model Detail → Ongoing Monitoring section

### What OSFI §4.5 Requires

OSFI E-23 §4.5 requires FRFIs to monitor models on an ongoing basis to detect:
- Performance deterioration (model drift)
- Data quality degradation
- Changes in the operating environment that affect model applicability
- Unexpected model behaviour

### Common Monitoring Metrics by Model Type

| Model Type | Recommended Metrics |
|---|---|
| Credit Scoring | PSI (Population Stability Index), Gini, KS Statistic, Default Rate, Override Rate |
| AML/Fraud | Precision, Recall, F1 Score, False Positive Rate, Alert Volume |
| IFRS 9 / ECL | PD Accuracy, LGD Accuracy, Backtesting ratio |
| Pricing Models | Model vs. Market deviation %, Hedge effectiveness |
| Stress Testing | Sensitivity to key variables, Backtesting error |

### Threshold Guidelines

Industry standard thresholds (adapt to your institution's risk appetite):

| Metric | Amber Warning | Red Alert |
|---|---|---|
| PSI | 0.10–0.25 | >0.25 |
| Gini (delta from baseline) | 5–10 points | >10 points |
| KS Statistic (delta) | 5–10 points | >10 points |
| Override Rate | >15% | >25% |
| F1 Score (delta) | 5–10 points decline | >10 points decline |

### AI Trend Analysis

After logging multiple readings for a metric, click **"AI Trend Analysis"** to get:
- **Trend:** Improving / Stable / Deteriorating
- **Drift Assessment:** Whether the observed drift is material under OSFI E-23 §4.5
- **Recommended Actions:** Specific remediation steps
- **Escalation Flag:** Whether CRO escalation is required (automatically logged in audit trail)

> **Best Practice:** Log monitoring metrics at least **monthly** for Tier 1 models and **quarterly** for Tier 2. Document your monitoring frequency in the Model Risk Appetite Statement (Chapter 12). Threshold breaches are automatically logged in the immutable audit trail — this is the evidence OSFI examiners look for.

---

## 12. Module 9 — Model Risk Appetite Statement

**OSFI Reference:** §3 — Model Risk Management Framework  
**Nav:** 🎯 Risk Appetite

### What Is a Model Risk Appetite Statement?

The Model Risk Appetite Statement (MRA Statement) is a Board-approved document that defines:
- The maximum level of model risk the institution is willing to accept
- Quantitative limits (e.g., no more than 0% of Tier 1 models unvalidated)
- Qualitative principles for model governance
- Escalation thresholds and governance obligations

OSFI E-23 expects every FRFI to have a documented MRA Statement that is reviewed and approved at the Board level annually.

### The 6-Question Wizard

| Question | Options | Impact on Statement |
|---|---|---|
| Institution Type | Credit union / Bank / Insurance / Trust | Tailors regulatory references |
| Risk Tolerance | Zero-tolerance / Low / Moderate | Drives overall posture language |
| Max % Tier 1 Unvalidated | 0% / 5% / 10% / 15% | Sets quantitative threshold |
| Tier 1 Validation Frequency | Annual / Biennial / Event-driven | Validation cycle language |
| Third-Party Posture | Conservative / Moderate / Permissive | §5 governance language |
| Escalation Threshold | $1M to $50M | CRO escalation trigger |

### Approval Workflow

1. **Generate** — AI (Claude Sonnet) drafts the statement in formal regulatory language with OSFI §references
2. **Review** — CRO and Model Risk Officer review the draft
3. **Approve** — Admin clicks **"Approve Statement"** — recorded immutably in audit trail with approver name and timestamp
4. **Board Presentation** — Copy the statement text for inclusion in Board Risk Committee materials
5. **Annual Review** — Click **"New Version"** next year to generate an updated draft; prior versions are preserved

> **Best Practice:** The AI-generated statement is a **draft starting point**. Have your legal or compliance team review before Board approval. The statement should reflect your actual practices, not aspirational ones — OSFI will assess whether your practices match your stated appetite.

---

## 13. Module 10 — Regulatory Calendar

**OSFI Reference:** §4.3 — Validation frequency; §5 — Vendor review cycle  
**Nav:** 📅 Reg. Calendar

### What the Calendar Shows

The Regulatory Calendar aggregates all compliance deadlines across your model inventory and vendor assessments into a single, urgency-sorted view:

| Urgency | Colour | Definition |
|---|---|---|
| **Overdue** | Red | Past due date — immediate action required |
| **Due ≤ 30 days** | Amber | Critical window — begin preparation immediately |
| **Due ≤ 90 days** | Blue | Planning window — assign validators now |
| **Open Workflows** | Grey | In-progress validations without a fixed due date |

### AI Compliance Briefing

Click **"Get AI Briefing"** for a 2-sentence CRO-ready summary that:
- Identifies the single most urgent compliance action this week
- Recommends one specific delegation to the team

Refresh the briefing weekly as a standing agenda item for your model risk governance meeting.

### Best Practices

- **Assign validators at the 90-day mark** — Finding independent validators takes time. When a model appears in the "Due ≤ 90 days" bucket, immediately identify the validator and issue the validation request.
- **Review the calendar weekly** — Make it a standing item in your model risk committee
- **Don't let items go red** — An overdue validation on a Tier 1 model is a finding in any OSFI examination

---

## 14. Module 11 — Exam Sprint Mode

**OSFI Reference:** All sections — Examination preparedness  
**Nav:** 🚨 Exam Sprint

### When to Launch an Exam Sprint

Launch an Exam Sprint when:
- OSFI has issued an examination notice
- Your institution is within 90 days of a scheduled supervisory review
- You want a quarterly compliance health check
- You are onboarding and need to understand your starting compliance gaps

### Understanding the Readiness Score

| Score | Assessment | Typical Finding |
|---|---|---|
| 75–100 | Strong | Minor procedural gaps; strong documentation |
| 50–74 | Moderate | Material gaps in 1–2 areas; specific remediation needed |
| 25–49 | Weak | Systemic gaps; prioritized remediation required |
| 0–24 | Critical | Exam risk is high; immediate escalation recommended |

### The Three Tabs

**Critical Gaps** — Read this first. Each gap card shows:
- The specific compliance gap
- OSFI §reference
- Severity (Critical / High / Medium)
- Number of models affected

**Sprint Plan** — Three-column 30/60/90-day action plan:
- **Day 30 (P1):** Must-do actions to address critical gaps before examination
- **Day 60 (P2):** Medium-priority remediation to close high gaps
- **Day 90 (P2):** Process improvements and documentation to strengthen the overall posture

**Exam Prep** — Two tools for examination day:
- **Quick Wins:** Actions that can be completed today or this week with minimal effort
- **Likely Examiner Questions:** Predicted questions based on your compliance posture — prepare written responses for each

> **Best Practice:** Assign each Day 30 action item to a named owner and set a deadline. Track completion in your model risk governance meeting. Refresh the Exam Sprint analysis monthly during the examination preparation period to see your readiness score improve.

---

## 15. Module 12 — Admin Panel & Multi-Tenant

**OSFI Reference:** §4 — Governance (segregation of duties)  
**Nav:** ⚙️ Admin Panel (admin and super_admin roles only)

### User Roles

| Role | Permissions |
|---|---|
| **analyst** | View models, run AI tools, log monitoring metrics |
| **validator** | All analyst permissions + manage validation workflows, submit findings |
| **admin** | All validator permissions + manage users, approve MRA Statement, approve validations |
| **super_admin** | All admin permissions + manage all tenants (ClearMRM staff only) |

### Provisioning Users

1. Go to **Admin Panel → Users**
2. Click **"Provision User"**
3. Enter name, email, role, and a temporary password
4. The user receives their login credentials and must change their password on first login

> **Best Practice for Segregation of Duties:** Ensure the model owner (the person responsible for a model) never also serves as the validator for that same model. OSFI §4.3 requires validation independence. Use ClearMRM roles to enforce this — assign model owners the "analyst" role and validators a separate "validator" role.

### SSO Configuration (SAML 2.0)

For institutions using Azure AD, Okta, or another SAML 2.0 identity provider:

1. Go to **Admin Panel → SSO Configuration**
2. Toggle SSO to **On**
3. Enter your identity provider's **Provider Name** (e.g., "AzureAD")
4. Enter your IdP's **SAML Metadata URL**
5. Click **"Save SSO Configuration"**
6. Provide ClearMRM's SAML SP values to your IT team:
   - **Entity ID:** `https://clearmrm.nimblestride.ca`
   - **Assertion Consumer Service URL:** `https://clearmrm.nimblestride.ca/api/auth/sso-callback`

Once configured, users in your domain see the SSO button on the login screen. New users are automatically provisioned into your tenant on first SSO login.

---

## 16. AI Features Reference

All AI in ClearMRM runs on **AWS Bedrock (Claude)** in **ca-central-1 (Canada)**. No data leaves Canada. No OpenAI or external AI providers are used. This ensures full PIPEDA and Quebec Law 25 compliance.

### AI Feature Map

| Feature | Model | Where | OSFI Basis |
|---|---|---|---|
| Dashboard Briefing | Claude Haiku | Dashboard | §4 — CRO oversight |
| AI Smart Fill | Claude Haiku | Add Model | §4.1 — Documentation |
| AI Remediation Advisor | Claude Sonnet | Model Detail | §4.2 — Remediation |
| AI Pre-Assessment | Claude Sonnet | Validation request | §4.3 — Validation scoping |
| AI Findings Analyzer | Claude Sonnet | Validation modal | §4.3 — Finding classification |
| AI Approval Check | Claude Sonnet | Validation modal | §4.3 — Documentation completeness |
| AI Closure Summary | Claude Haiku | Validation close | §4.4 — Audit narrative |
| AI Vendor §5 Deep Dive | Claude Sonnet | Vendor modal | §5 — Third-party governance |
| AI Materiality Check | Claude Sonnet | Change History | §4.2/§4.3 — Material change |
| AI Monitoring Trend | Claude Sonnet | Monitoring section | §4.5 — Drift detection |
| AI Calendar Briefing | Claude Haiku | Regulatory Calendar | §4.3 — Deadline prioritization |
| AI MRA Statement | Claude Sonnet | Risk Appetite | §3 — MRA documentation |
| AI Exam Sprint | Claude Sonnet | Exam Sprint | All §§ — Gap analysis |
| AI Examiner Narrative | Claude Sonnet | Examiner Export | All §§ — Supervisory response |
| AI Board Pack Summary | Claude Sonnet | Board Report | §4 — Board reporting |

### Using AI Effectively

**Do:**
- Use AI outputs as a starting point, not a final answer
- Review AI findings against your institution's specific context
- Document when you deviate from AI recommendations and why
- Run the AI Exam Sprint quarterly, not just before examinations
- Use AI Materiality Check for every model change, even minor ones

**Don't:**
- Submit AI-generated text to OSFI without human review
- Override an AI "escalation required" flag without documenting the rationale
- Ignore AI-flagged threshold breaches in monitoring
- Use AI findings to replace independent validator judgment

---

## 17. Best Practices & Industry Standards

### Model Inventory Best Practices

1. **Complete the inventory before rating.** Get all models registered first, then run the Risk Rating Wizard in bulk. A complete-but-unrated inventory is better than a partially rated one.

2. **Use consistent naming.** OSFI examiners cross-reference model names against capital reports and other submissions. Use the same names internally as in regulatory filings.

3. **Review for completeness annually.** Compare your model inventory to your capital reports, ICAAP, and DFAST submissions. Any model that informed a number in those documents should be in your inventory.

4. **Document model interdependencies.** If Model A uses the output of Model B as an input, document this in the purpose/data sources field. OSFI E-23 §3.1 explicitly covers model chains.

### Validation Best Practices

1. **Start validation requests 90 days before due date.** Finding a qualified independent validator, scoping the engagement, and completing the work takes 30–60 days minimum.

2. **Document negative findings.** A validation that finds issues is more credible to OSFI than one that finds nothing. Document all findings — even minor ones — with the AI Findings Analyzer.

3. **Conditional passes must have tracked conditions.** When a validation results in a "conditional_pass," log the conditions as a follow-up in the audit trail. OSFI will check whether conditions were closed.

4. **Re-validate after material changes.** The AI Materiality Check will flag when re-validation is needed. Never use a model in production after a material change without completing re-validation.

### Monitoring Best Practices

1. **Set thresholds at onboarding.** When logging the first monitoring metric, set amber and red thresholds immediately. Without thresholds, the system cannot flag drift.

2. **Log monitoring even when metrics are good.** Consistent monitoring records (not just breach records) are what OSFI examiners look for. A model with 24 consecutive "good" readings is stronger evidence than one with no monitoring history.

3. **Act on red alerts immediately.** A red threshold breach logged in ClearMRM creates an audit event. If you don't respond, OSFI can see the breach was logged but not acted upon — which is worse than no monitoring.

4. **Run AI Trend Analysis quarterly.** Even stable metrics can show subtle deterioration patterns that aren't visible in individual readings. The AI trend analysis catches these.

### Exam Preparation Best Practices

1. **Run the Exam Sprint 90 days before examination.** This gives you the 30/60/90-day plan before you need it.

2. **Prepare written answers to examiner questions.** The Exam Sprint's "Likely Examiner Questions" list should be converted into a formal Q&A document reviewed by the CRO.

3. **Generate the Examiner Export 2 weeks before.** Review it carefully. Any gap visible in the export is visible to OSFI.

4. **Ensure the Board has seen the MRA Statement.** OSFI will ask whether the Board reviewed and approved your MRA Statement. Have the meeting minutes ready.

---

## 18. OSFI E-23 Compliance Checklist

Use this checklist to verify your institution's readiness for an OSFI E-23 examination.

### Model Inventory (§3.1)
- [ ] All material models are registered in ClearMRM
- [ ] Every model has a named owner with contact information
- [ ] Model purpose and methodology are documented
- [ ] Third-party/vendor models are tagged and linked to vendor assessments
- [ ] Retired/decommissioned models are archived (not deleted)
- [ ] Model inventory has been reviewed for completeness in the last 12 months

### Risk Tiering (§3.2)
- [ ] Every model in inventory has a risk tier assigned
- [ ] Tier 1 models include all models with regulatory use
- [ ] Tier 1 models include all models that have never been validated
- [ ] Risk tier reasoning is documented (AI reasoning or manual notes)
- [ ] Risk tiers have been reviewed after any material model change

### Model Validation (§4.3)
- [ ] All Tier 1 models have a completed validation on record
- [ ] All Tier 2 models are within their validation cycle
- [ ] All validations were conducted by independent validators
- [ ] Validator independence is documented in the validation record
- [ ] All findings from prior validations have been addressed
- [ ] Conditional pass conditions have been closed or documented
- [ ] Model Risk Appetite Statement sets maximum % of Tier 1 unvalidated

### Audit Trail (§4.4)
- [ ] Audit trail covers model additions, changes, validations, and approvals
- [ ] Audit trail is immutable (no modifications possible)
- [ ] AI closure summaries have been generated for all closed validations
- [ ] Examiner Export generates a clean Management Attestation page

### Ongoing Monitoring (§4.5)
- [ ] Tier 1 models have monitoring metrics logged at least monthly
- [ ] Tier 2 models have monitoring metrics logged at least quarterly
- [ ] Amber and red thresholds are set for all monitored metrics
- [ ] All red threshold breaches have been responded to and documented
- [ ] AI Trend Analysis has been run in the last 90 days for all Tier 1 models

### Third-Party Governance (§5)
- [ ] All vendor models have a completed vendor assessment
- [ ] All 7 §5 checklist items have been assessed
- [ ] High-risk vendors have an active remediation plan
- [ ] Vendor assessments are reviewed at least annually
- [ ] Concentration risk has been assessed (multiple models from same vendor)

### Governance & Board (§3, §4)
- [ ] Model Risk Appetite Statement has been drafted and Board-approved
- [ ] Board Report has been presented to the Board Risk Committee in last 12 months
- [ ] Exam Sprint has been run in the last 90 days
- [ ] CRO or equivalent has reviewed and acted on the Regulatory Calendar
- [ ] SSO/access controls are configured to enforce role-based access

---

*This guide is maintained by the ClearMRM team. For the latest version, visit https://clearmrm.nimblestride.ca or contact myousufshariff@gmail.com.*

*ClearMRM is developed by Nimblestride Inc. and operates on AWS Canada (ca-central-1). All AI processing uses AWS Bedrock (Claude by Anthropic) and complies with PIPEDA and Quebec Law 25.*
