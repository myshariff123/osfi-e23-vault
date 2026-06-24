# ClearMRM — User Guide & Operational Manual
### OSFI E-23 Model Risk Management Platform
**Version 5.0 | Last Updated: June 24, 2026 | For Canadian FRFIs**

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
19. [Module 13 — Action Queue (AI-Powered Dashboard)](#19-module-13--action-queue)
20. [Module 14 — AI Portfolio Doctor](#20-module-14--ai-portfolio-doctor)
21. [Module 15 — AI Validation Report Generator](#21-module-15--ai-validation-report-generator)
22. [Module 16 — MRM Policy Generator](#22-module-16--mrm-policy-generator)
23. [Module 17 — Policy Gap Checker](#23-module-17--policy-gap-checker)
24. [Module 18 — Natural Language Search](#24-module-18--natural-language-search)
25. [Module 19 — Document Intelligence](#25-module-19--document-intelligence)
26. [Module 20 — Cryptographic Audit Integrity](#26-module-20--cryptographic-audit-integrity)
27. [Module 21 — Insurance-Specific MRM](#27-module-21--insurance-specific-mrm)
28. [Module 22 — Actuarial Assumption Register](#28-module-22--actuarial-assumption-register)
29. [Module 23 — Structured Backtesting Log](#29-module-23--structured-backtesting-log)
30. [Module 24 — Model Dependency Map](#30-module-24--model-dependency-map)
31. [Module 25 — B-10 Third-Party Risk Package](#31-module-25--b-10-third-party-risk-package)
32. [Module 26 — AI Audit Summary](#32-module-26--ai-audit-summary)
33. [Module 27 — AI Examiner Prep Brief](#33-module-27--ai-examiner-prep-brief)
34. [Module 28 — AI Compliance Check (Risk Appetite)](#34-module-28--ai-compliance-check-risk-appetite)
35. [Module 29 — AI Portfolio Impact (Calendar)](#35-module-29--ai-portfolio-impact-calendar)
36. [Module 30 — AI Peer Benchmark (Validations)](#36-module-30--ai-peer-benchmark-validations)
37. [Role-by-Role Operational Guide](#37-role-by-role-operational-guide)

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

---

## 19. Module 13 — Action Queue

**Nav:** 🎯 Action Queue (Dashboard)

The Action Queue is the first screen after login and the operational hub of ClearMRM. It replaces the static dashboard with an AI-prioritized list of actions requiring attention across your entire model portfolio.

### What the Action Queue Shows

The queue is generated by Claude Sonnet, which reads your model inventory, validation states, monitoring history, and regulatory calendar to produce:

- **Prioritized action items** — Each item has a risk level (Critical / High / Medium), a clear action statement, the affected model or entity, and the OSFI E-23 section that makes this item mandatory.
- **Risk Pulse Score (0–100)** — A portfolio-level health indicator. Score below 50 means at least one critical compliance gap requires immediate escalation. Score above 80 means your portfolio is in strong compliance posture.
- **Context per item** — Each action explains what will happen if it is not addressed and provides a recommended immediate next step.

### How to Use the Action Queue

1. Open the Action Queue each morning as the first step of your working day.
2. Sort by risk level — address Critical items before anything else.
3. Click through to the referenced model or workflow to take the recommended action.
4. Refresh the queue weekly or after any significant change in your model inventory.

> **Best Practice:** The Action Queue should be reviewed in your weekly model risk committee meeting. Print it or screenshot it before the meeting — it provides the agenda. Items that remain in the queue for more than two weeks with no action are an audit concern.

---

## 20. Module 14 — AI Portfolio Doctor

**Nav:** 🗂️ Model Inventory → "Run Portfolio Doctor" button

The AI Portfolio Doctor performs a comprehensive health assessment of your entire model portfolio, analyzing all active models simultaneously and returning a portfolio-level diagnosis.

### What Portfolio Doctor Returns

- **Portfolio Health Grade (A–F)** — Overall compliance posture rating
- **High-Priority Findings** — Models or patterns requiring immediate escalation
- **Systemic Gaps** — Issues that affect multiple models (e.g., "23% of Tier 1 models have no monitoring history")
- **Recommended Actions** — Prioritized 30-day action list with OSFI section references
- **Regulatory Risk Summary** — Examiner-facing narrative of the portfolio's compliance position

### When to Use Portfolio Doctor

- At the start of each quarter as a compliance health check
- After any major portfolio change (new model class, business acquisition, regulatory change)
- 90 days before an expected OSFI examination
- When onboarding — to understand your starting compliance gap

> **Best Practice:** Save the Portfolio Doctor output as a PDF (Ctrl+P) and store it as a quarterly compliance record. OSFI examiners may ask to see evidence of ongoing portfolio-level oversight.

---

## 21. Module 15 — AI Validation Report Generator

**Nav:** ✅ Validations → Open a validation → "Generate Report" button

Generates a complete, formally structured Model Validation Report (MVR) directly from your validation record. The report is written in standard MRM report language — executive summary, scope, methodology, findings, recommendations, and conclusion.

### Report Structure

| Section | Content |
|---|---|
| Executive Summary | 3-sentence compliance position and validation outcome |
| Validation Scope | Model being validated, validation type, period covered |
| Validation Methodology | How the validation was conducted (AI summarized from findings) |
| Model Assessment | Risk tier confirmation, adequacy of documentation |
| Findings | Each finding with severity, description, and OSFI reference |
| Recommendations | Remediation actions with suggested timelines |
| Validation Conclusion | Pass / Conditional Pass / Fail with rationale |
| Governance | Independence confirmation, validator identity |

### Human-in-the-Loop Requirement

The AI-generated report is a draft. Before treating this report as final:
1. Have the assigned validator review all sections for factual accuracy
2. Ensure all findings are accurately captured from the validation workflow
3. The validator signs off in the validation workflow (state: approved) — this sign-off is the authoritative governance record, not the report text itself
4. The report is a communication document. The audit trail is the compliance record.

> **Important:** AI-generated text in the report should be reviewed by a qualified validator before external use. ClearMRM provides the structural framework and language; domain expertise must be applied by the human reviewer.

---

## 22. Module 16 — MRM Policy Generator

**OSFI Reference:** §3 — MRM Framework; §4 — Model Risk Management  
**Nav:** 📜 MRM Policy

The MRM Policy Generator creates a complete, board-ready Model Risk Management Policy document — one of the most important governance documents an FRFI must maintain under OSFI E-23.

### The 10 Input Questions

Before generation, ClearMRM asks 10 questions to tailor the policy to your institution:

| Question | Purpose |
|---|---|
| Institution name | Personalizes all policy references |
| Institution type | Tailors regulatory framework citations |
| Asset size | Scales proportionality language |
| Primary model types | Includes relevant model-class governance |
| Validation frequency | Sets minimum cycle requirements |
| Risk tolerance | Drives appetite and escalation language |
| Third-party posture | Sets §5 governance strength |
| Board committee name | Identifies the oversight body |
| CRO title | Personalizes governance roles |
| Effective date | Sets the policy review cycle |

### The 13 Policy Sections Generated

1. Purpose and Scope
2. Model Definition and Classification
3. Model Inventory Management
4. Model Risk Tiering Framework
5. Model Development Standards
6. Model Validation Requirements
7. Model Approval and Deployment
8. Ongoing Monitoring Program
9. Third-Party Model Governance
10. Model Change Management
11. Model Risk Reporting (Board and Management)
12. Model Risk Appetite
13. Governance, Roles and Responsibilities

### Approval and Version Control

After generating the policy:
1. Review each section for accuracy against your institution's actual practices
2. Have legal or compliance review the final text
3. Click **"Approve Policy"** — this records the approver identity and timestamp in the audit trail
4. The approved version is version-locked and stored; use **"New Version"** for future updates

> **Best Practice:** Generate an initial policy in your first week on ClearMRM. Use it as the foundation and refine it over the following weeks with your compliance team. An AI-drafted policy is a faster starting point than a blank page — but it must be reviewed against your actual governance practices before Board approval.

---

## 23. Module 17 — Policy Gap Checker

**Nav:** 🔬 Policy Gap Check

The Policy Gap Checker compares your current approved MRM Policy against the full requirements of OSFI Guideline E-23 (September 2025) and returns a prioritized list of gaps.

### What It Returns

- **Compliance Score (0–100)** — How completely your policy addresses OSFI E-23 requirements
- **Overall Assessment** — 2-sentence summary of the policy's compliance posture
- **Gap List** — Each gap with:
  - The OSFI E-23 section it corresponds to
  - The specific requirement that is missing or inadequate
  - Severity (Critical / High / Medium / Low)
  - Specific recommended language to add
- **Priority Additions** — The top 3–5 additions that would most improve compliance

### When to Run It

- After generating a new policy (to confirm completeness)
- After any OSFI guideline update
- 90 days before an examination
- Annually as part of the policy review cycle

> **Best Practice:** A Critical gap in the Policy Gap Checker means an OSFI examiner is likely to identify this gap during examination. Address all Critical and High gaps before submitting the policy to the Board for approval.

---

## 24. Module 18 — Natural Language Search

**Nav:** 🔍 Smart Search

The Natural Language Search allows you to ask questions about your model inventory in plain English and receive AI-powered answers from your live data.

### Example Queries

- "Show me all Tier 1 credit models that haven't been validated in the last 12 months"
- "Which models are in the retail banking business unit with high data quality risk?"
- "Find all third-party vendor models with overdue assessments"
- "What IFRS 17 models do we have and what is their validation status?"

### How It Works

Your query is sent to Claude Haiku, which interprets the intent, constructs the appropriate filters, and searches your model inventory. Results are returned as a filtered model list with the matched criteria highlighted.

### Best Practices

- Be specific — "Tier 1 models with no monitoring" returns better results than "risky models"
- Use regulatory terminology — "validation overdue", "high risk tier", "third-party vendor"
- Use it as a quick cross-check before board meetings or examinations
- Results do not filter the main Model Inventory view — use them as a reference alongside your main inventory

---

## 25. Module 19 — Document Intelligence

**Nav:** 🧾 Doc Intelligence

Document Intelligence extracts structured model data from existing documents — model validation reports, technical specifications, vendor documentation, internal memos — and pre-populates the model registration form, eliminating manual re-keying.

### How to Use It

1. Navigate to **Doc Intelligence**
2. Paste the text of your existing document into the text area (paste from Word, PDF, or email)
3. Click **"Extract Model Data"**
4. ClearMRM AI extracts: model name, purpose, methodology type, business unit, data sources, risk considerations, and any validation history
5. Click **"Open Pre-filled Form"** — the Model Inventory form opens pre-populated with extracted data
6. Review and adjust each field before saving

### What It Can Extract

| Field | Extraction Quality | Notes |
|---|---|---|
| Model Name | High | Usually explicit in document |
| Purpose | High | From purpose/scope sections |
| Methodology Type | High | From methodology sections |
| Business Unit | Medium | May need manual confirmation |
| Owner | Medium | From signatory/contact sections |
| Data Sources | Medium | From inputs sections |
| Risk Flags | Low-Medium | Inferred from context |

> **Best Practice:** Use Document Intelligence when onboarding an institution with existing documentation (validation reports, model inventories in Word, technical specs). It can significantly reduce manual data entry time. Always review extracted fields — the AI may misinterpret abbreviations or institution-specific terminology.

---

## 26. Module 20 — Cryptographic Audit Integrity

**OSFI Reference:** §4.4 — Immutable Audit Trail  
**Nav:** 📋 Audit Trail → "Verify Integrity" panel

ClearMRM's audit trail is not just append-only at the database level — it is cryptographically sealed using a Merkle hash chain, making tampering mathematically detectable.

### How the Hash Chain Works

Each audit event receives a SHA-256 hash computed from the event content combined with the hash of the prior event. This creates a chain where any modification to any historical event invalidates all subsequent hashes — the modification is detectable without knowing the original content.

### Using the Verify Integrity Panel

1. In the Audit Trail screen, expand the **"Verify Integrity"** panel
2. Click **"Verify Chain"**
3. ClearMRM replays the full hash chain and returns:
   - **Merkle Root** — The final hash representing the entire audit history
   - **Chain Status** — Valid (green) or Tampered (red)
   - **First Breach Point** — If tampered, the exact event where the chain breaks
   - **Total Events Verified** — Number of events in the chain

### Hash Pills on Individual Events

Each event in the audit log shows a hash pill — a truncated version of its individual hash. Click any pill to copy the full hash. If you need to prove to an OSFI examiner that a specific event was not modified, provide its hash and the Merkle root at the time of the event.

### For OSFI Examiners

The cryptographic audit trail demonstrates that your compliance records are tamper-proof — a stronger evidence standard than a conventional database audit log. If asked, you can provide the Merkle root from any point in time as evidence of audit trail integrity.

---

## 27. Module 21 — Insurance-Specific MRM

**OSFI Reference:** §3.1 — Model Inventory; IFRS 17; OSFI Capital Frameworks  
**Nav:** 🗂️ Model Inventory → Add/Edit Model (Insurance fields)

ClearMRM includes dedicated support for insurance company model governance, reflecting the significantly broader and more technically complex model inventory typical of Canadian insurers.

### Insurance Model Taxonomy

The Model Inventory includes 14 insurance-specific model categories:

| Category | Examples |
|---|---|
| Reserving Models | IBNR, IBER, Claims Development |
| Pricing & Actuarial | Product pricing, loss ratio models |
| Catastrophe Models | Cat XL, flood, earthquake |
| Capital Models | LICAT, IRB, ICAAP |
| ALM / Interest Rate Risk | Duration matching, liquidity stress |
| IFRS 17 Components | GMM, VFA, PAA measurement models |
| Reinsurance | Treaty pricing, retrocession analysis |
| Lapse/Persistency | Policyholder behaviour models |
| Embedded Value | EV projection models |
| Credit Models | Default, migration, recovery |
| Fraud Detection | Claims fraud, application fraud |
| AML/Financial Crime | Transaction monitoring |
| Operational Risk | Scenario models, loss distribution |
| Climate/ESG Risk | Physical and transition risk models |

### IFRS 17 Component Fields

For IFRS 17 models, additional fields are available:
- **IFRS 17 Component** — General Measurement Model (GMM) / Variable Fee Approach (VFA) / Premium Allocation Approach (PAA)
- **Capital Framework Linked** — Whether this model feeds into a capital calculation
- **Capital Framework** — LICAT / IRB / ICAAP / B-3 / Other

### Spreadsheet Model Governance

Insurance institutions often have material models in Excel. Toggle **"Spreadsheet Model"** to flag these — they appear with a warning badge in the inventory, reminding the governance team that spreadsheet-based models require additional controls under OSFI E-23 (documentation of formulas, version control, access controls).

---

## 28. Module 22 — Actuarial Assumption Register

**OSFI Reference:** §4.1 — Model Documentation; Actuarial Standards of Practice  
**Nav:** 🗂️ Model Detail → Actuarial Assumption Register section

The Assumption Register provides a formal, auditable record of every key assumption used in a model — with change tracking across assumption revisions.

### When to Use It

Use the Assumption Register for any model where key inputs are assumptions set by judgment or methodology (as opposed to observed data). This includes:
- All reserving models (mortality, morbidity, lapse, discount rate)
- IFRS 17 measurement models (CSM unlock assumptions)
- Capital models (scenario severity, correlation assumptions)
- Pricing models (loss ratio, expense ratio)

### What to Record per Assumption

| Field | Guidance |
|---|---|
| Assumption Name | Descriptive and consistent with actuarial practice |
| Current Value | The value currently used in the model |
| Prior Value | The value from the previous review cycle |
| Unit | What the value represents (%, bps, multiplier, etc.) |
| Approved By | The actuary or committee that approved this value |
| Effective Date | When this value took effect |
| Change Reason | Why the value changed from prior — must be documented |

### AI Assumption Sensitivity Analysis

Click **"AI Sensitivity Analysis"** to identify:
- Which assumptions have the highest sensitivity (small change → large model output change)
- Stress test recommendations for each high-sensitivity assumption
- Comparison to industry benchmarks
- OSFI Section 4.1 documentation requirements for sensitive assumptions

> **Best Practice for Actuaries:** Run the sensitivity analysis after every assumption review cycle. High-sensitivity assumptions flagged by the AI should have documented stress scenarios in the validation report.

---

## 29. Module 23 — Structured Backtesting Log

**OSFI Reference:** §4.3 — Validation Evidence; §4.5 — Performance Monitoring  
**Nav:** ✅ Validations → Open validation → Backtesting Log section

The Backtesting Log provides a structured record of all backtesting tests conducted as part of a model validation — replacing free-form notes with a queryable, AI-analyzable test record.

### Recording a Backtesting Test

| Field | Guidance |
|---|---|
| Test Name | Descriptive (e.g., "2022 Holdout Gini Test", "Q4 PSI Population Check") |
| Period Start / End | The historical period being backtested |
| Predicted Value | What the model predicted for this period |
| Actual Value | What was observed in reality |
| Tolerance Threshold | The acceptable deviation (e.g., ±5%) |
| Variance % | Auto-calculated or manually entered |
| Verdict | Pass / Fail / Inconclusive |
| Notes | Any qualitative context |
| Conducted By | The validator who ran the test |

### AI Backtesting Narrative

After logging all tests, click **"AI Backtesting Narrative"** to generate:
- A formal written narrative of the backtesting program
- Overall verdict (pass / fail / inconclusive) across all tests
- OSFI §4.3 and §4.5 implications of the backtesting results
- Recommendations for follow-up validation work
- Whether the backtesting results support or challenge validation approval

This narrative becomes a section of the AI Validation Report (Module 15) if generated after backtesting is complete.

---

## 30. Module 24 — Model Dependency Map

**OSFI Reference:** §3.1 — Model Inventory (model chains)  
**Nav:** 🗂️ Model Detail → Model Dependencies section

OSFI E-23 explicitly requires institutions to track model chains — where the output of one model becomes the input of another. The Model Dependency Map operationalizes this requirement.

### Recording Dependencies

For each model, you can define:
- **Upstream models** — Models whose outputs feed into this model
- **Downstream models** — Models that consume this model's output

Example: A Cat Model (upstream) → Capital Model (downstream). If the Cat Model fails or produces unreliable outputs, the Capital Model's outputs are also compromised.

### AI Cascade Risk Analysis

Click **"AI Cascade Risk"** on any model to get:
- **Cascade Severity** — If this model fails, what is the downstream risk to the portfolio?
- **Affected Downstream Models** — The full cascade chain with model names and risk tiers
- **Mitigation Actions** — Specific steps to reduce cascade risk
- **Examiner Note** — How an OSFI examiner would characterize this dependency structure

> **Best Practice:** Map all dependencies for Tier 1 models first. Any Tier 1 model that feeds into a capital or regulatory reporting model creates a cascade that OSFI examiners will scrutinize. Document the dependency, the data flow, and what controls prevent errors from propagating downstream.

---

## 31. Module 25 — B-10 Third-Party Risk Package

**OSFI Reference:** OSFI B-10 — Third-Party Risk Management  
**Nav:** 📦 B-10 Package

The B-10 Package generates a board-ready summary of your institution's third-party model governance, structured for OSFI B-10 reporting requirements.

### What It Contains

The AI-generated B-10 report includes seven sections:

1. **Third-Party Model Inventory** — All vendor models with risk ratings
2. **Concentration Risk Assessment** — Whether any single vendor provides too many critical models
3. **Due Diligence Status** — Summary of §5 checklist completion across all vendor assessments
4. **High-Risk Vendor Findings** — Specific governance gaps for red-rated vendors
5. **Action Plan** — Prioritized remediation steps for vendor risk reduction
6. **Regulatory Compliance Summary** — How current vendor governance meets B-10 requirements
7. **Board Narrative** — Executive-level summary paragraph for board reporting

### When to Generate It

- Annually as part of the B-10 annual risk review
- Before any OSFI examination
- When a material vendor relationship changes (new vendor, contract renewal, vendor incident)
- As part of the board's annual third-party risk review

> **Best Practice:** ClearMRM itself is a third-party vendor to your institution under OSFI B-10. Request ClearMRM's B-10 vendor package from myousufshariff@gmail.com — it documents our data residency, AI provider, sub-processors, SLA terms, and PIPEDA compliance to complete your own B-10 due diligence on the platform.

---

## 32. Module 26 — AI Audit Summary

**Nav:** 📊 Audit Summary

The AI Audit Summary generates a formal narrative of your audit trail activity for any period, structured for examiner and board review.

### What It Contains

- **Activity Summary** — Total events, unique actors, model additions, status changes
- **Significant Events Narrative** — AI-written prose describing the most material governance events in the period
- **Key Activities** — The top 5 events by governance significance
- **Compliance Observations** — How the audit activity demonstrates OSFI E-23 compliance

### When to Use It

- As a quarterly internal audit artifact
- In preparation for board reporting
- As part of examination response materials
- When OSFI requests evidence of ongoing governance activity

> **Best Practice:** Generate the Audit Summary at the end of each quarter and retain it as a compliance record. Pair it with the Examiner Export PDF for a complete quarterly compliance package.

---

## 33. Module 27 — AI Examiner Prep Brief

**Nav:** 🎓 Examiner Prep AI

The AI Examiner Prep Brief performs a comprehensive readiness assessment and generates a tailored preparation guide for OSFI examination.

### What It Returns

- **Readiness Score (0–100)** — Aggregate compliance posture
- **Critical Findings** — The gaps most likely to generate MRA (Matter Requiring Attention) designations
- **Likely Examiner Questions** — Predicted questions based on your portfolio's compliance gaps, with recommended responses
- **30-Day Action Checklist** — Prioritized actions before examination day
- **Exam Day Checklist** — What to have ready when OSFI walks in

### Difference from Exam Sprint

| Feature | Exam Sprint | Examiner Prep |
|---|---|---|
| Focus | Remediation planning | Examination readiness |
| Output | 30/60/90-day plan | Day-of checklist + Q&A prep |
| AI Model | Claude Sonnet | Claude Sonnet |
| Best used | 90 days before exam | 2 weeks before exam |
| Key output | Priority action plan | Predicted examiner questions |

> **Best Practice:** Run Exam Sprint first (90 days out). Then run Examiner Prep 14 days before the examination. Together they give you both the remediation plan and the examination day preparation.

---

## 34. Module 28 — AI Compliance Check (Risk Appetite)

**Nav:** ⚖️ Risk Appetite → "Run Compliance Check" button

After generating a Risk Appetite Statement, the AI Compliance Check scores the statement against OSFI E-23 requirements and identifies specific gaps.

### What It Returns

- **Compliance Score (0–100)** and **Grade (A–F)**
- **Examiner Risk** — Low / Medium / High / Critical (likelihood of examiner finding)
- **Overall Assessment** — 2-3 sentence compliance summary
- **Specific Gaps** — Each gap with the OSFI section, finding description, severity, and recommended language
- **Suggested Additions** — Text or sections missing from the statement
- **Examiner Comment** — What an OSFI examiner would likely note about this statement

### When to Run It

Run the compliance check immediately after generating or editing the Risk Appetite Statement, and before presenting it to the Board for approval. A Grade below B indicates the statement should be revised before approval.

---

## 35. Module 29 — AI Portfolio Impact (Calendar)

**Nav:** 📅 Reg. Calendar → "⚡ Impact" button on any event

For each upcoming regulatory event in the calendar, the Portfolio Impact analysis identifies which models in your portfolio are directly affected and what actions are required.

### What It Returns

Per event:
- **Impacted Models** — List of models affected by this regulation, with their risk tier
- **Key Risks** — What could go wrong for each affected model if the event is not addressed
- **Overall Effort** — Low / Medium / High estimate of the portfolio-wide remediation effort
- **Impact Summary** — 2-sentence CRO-ready description of the event's portfolio impact

### How to Use It

1. In the Regulatory Calendar, click **"⚡ Impact"** on any upcoming event
2. Review impacted models — these are the models that need attention before the deadline
3. For each impacted model, open the model detail and check its current validation and monitoring status
4. Use the 90-day Action Queue to track required actions

> **Best Practice:** Run Portfolio Impact on the top 3–5 upcoming events each quarter. Use the results to brief the CRO and set quarterly model governance priorities.

---

## 36. Module 30 — AI Peer Benchmark (Validations)

**Nav:** ✅ Validations → Open validation → "Run Benchmark" button

The AI Peer Benchmark rates the quality of a completed validation against OSFI E-23 best practices for model validation documentation.

### What It Returns

- **Benchmark Score (0–100)** and **Grade (A–F)**
- **Examiner Rating** — Satisfactory / Needs Improvement / Unsatisfactory
- **Overall Assessment** — How this validation compares to OSFI expectations
- **Examiner Comment** — What an OSFI examiner would say about this validation's documentation
- **Quality Gaps** — Each gap with area, finding, OSFI requirement, and specific recommendation

### When to Use It

- After completing a validation but before formal approval — to identify documentation gaps before closing the record
- After receiving an OSFI finding on a prior validation — to ensure the current validation addresses the cited deficiency
- As a training tool for new validators — the benchmark provides specific guidance on what "good" OSFI E-23 validation documentation looks like

> **Best Practice:** A Grade below B before approval means the validation record should be supplemented before sign-off. An OSFI examiner applies similar criteria when reviewing validation records during examination. Use the Quality Gaps list as a checklist for improving the validation documentation before approval.

---

## 37. Role-by-Role Operational Guide

This section describes the recommended workflow for each role within the ClearMRM platform. Use it to onboard new team members or to confirm that your team is using the platform to its full potential.

---

### Chief Risk Officer (CRO) / Head of Model Risk

**Primary objectives:** Portfolio visibility, board reporting, examination readiness, regulatory compliance confirmation

**Daily:**
- Review the **Action Queue** — address any Critical items before your first meeting
- Check **Risk Pulse Score** — below 70 requires team briefing

**Weekly:**
- Review the **Regulatory Calendar** for upcoming deadlines in the next 30 days
- Run **Portfolio Impact** on any event due in the next 60 days
- Confirm that Tier 1 model monitoring is current (Monitoring section on Model Detail)

**Monthly:**
- Generate and review the **Board Report** — review AI executive summary for accuracy before presenting
- Review the **AI Audit Summary** for the prior month
- Run **Exam Sprint** to refresh your readiness score

**Quarterly:**
- Run **Portfolio Doctor** for portfolio-level health assessment
- Generate **Examiner Export** and review for gaps
- Present Board Report to Board Risk Committee
- Review and refresh the **Risk Appetite Statement** (run Compliance Check after any edit)

**Annually:**
- Approve updated **MRM Policy** (after Policy Gap Check confirms completeness)
- Approve new **Risk Appetite Statement**
- Conduct **Exam Sprint** 90 days before any expected OSFI review

**Key screens:** Action Queue, Board Report, Examiner Export, Risk Appetite, Exam Sprint, Examiner Prep

---

### Model Risk Analyst

**Primary objectives:** Model inventory accuracy, risk rating, change tracking, monitoring compliance

**First week:**
- Register all active models in **Model Inventory** (use CSV Import for bulk)
- Run **Risk Rating Wizard** on every model
- Tag all third-party/vendor models for §5 governance

**Ongoing (model lifecycle):**
- When a new model enters production: register in inventory, run risk rating, create monitoring schedule
- When a model changes: log change in **Change History**, run AI Materiality Check
- When monitoring cycle is due: log metrics in **Monitoring** section, run AI Trend Analysis if amber/red
- When a model is decommissioned: set status to "archived" (never delete)

**Monthly:**
- Review all Tier 1 models for overdue monitoring
- Check the Regulatory Calendar for upcoming validation deadlines
- Run Portfolio Doctor to identify emerging gaps

**For insurance institutions:**
- Classify all models using the 14-category insurance taxonomy
- Record IFRS 17 component for applicable models
- Maintain the **Actuarial Assumption Register** for reserving and capital models
- Map model dependencies (especially Cat → Capital chains)

**Key screens:** Model Inventory, Risk Rating Wizard, Change History, Ongoing Monitoring, Actuarial Assumptions, Model Dependencies, Regulatory Calendar, Portfolio Doctor

---

### Independent Validator

**Primary objectives:** Completing validation work with proper documentation, ensuring OSFI §4.3 independence

**When assigned a validation:**
1. Open **Validations** → find your assigned validation
2. Review the **AI Pre-Assessment** — this defines the scope and OSFI requirements for this validation
3. Review the model's full detail: risk rating, monitoring history, change history, prior validation records
4. Document your findings in the validation workflow (state: in_progress → findings_submitted)
5. Use the **AI Findings Analyzer** to classify and score your findings
6. Record all backtesting in the **Backtesting Log** with verdicts
7. Run **AI Approval Readiness Check** before requesting approval — address any red flags
8. Run **AI Peer Benchmark** — aim for Grade B or above before submitting for approval
9. Generate the **AI Validation Report** as the draft deliverable
10. Review the AI-generated report carefully — edit any factual inaccuracies before final sign-off

**Independence requirements (OSFI §4.3):**
- You must not have been involved in the development of the model you are validating
- Document your independence in the findings notes ("I confirm I had no involvement in the development of [Model Name]")
- For Tier 1 models at smaller institutions, consider using a qualified external validator

**Key screens:** Validations, Model Detail, Backtesting Log, AI Validation Report, AI Peer Benchmark

---

### Chief Compliance Officer (CCO)

**Primary objectives:** MRM policy compliance, regulatory alignment, examination readiness

**At onboarding:**
1. Generate the **MRM Policy** using the 10-question generator
2. Run **Policy Gap Checker** on the generated policy — address all Critical and High gaps before Board presentation
3. Approve the policy (Admin role required)

**Quarterly:**
- Run **Policy Gap Checker** to confirm policy still aligns with OSFI E-23 (guidelines can be updated)
- Review **Regulatory Calendar** for new Canadian regulatory events
- Generate **B-10 Package** for board risk reporting on third-party models

**Annual policy cycle:**
1. Generate a new policy version (preserves prior version)
2. Run Policy Gap Checker on the new version
3. Have compliance and legal review
4. Submit to Board for approval
5. Approve and version-lock in ClearMRM

**Examination support:**
- Generate **Examiner Export** 2 weeks before any OSFI review
- Run **Examiner Prep Brief** 14 days before examination
- Prepare written responses to "Likely Examiner Questions" from Examiner Prep

**Key screens:** MRM Policy, Policy Gap Checker, B-10 Package, Examiner Export, Examiner Prep, Regulatory Calendar

---

### Internal Audit

**Primary objectives:** Governance assurance, audit trail integrity, exception identification

**Quarterly audit procedures:**
1. Navigate to **Audit Trail** — review all events for the audit period
2. Click **"Verify Integrity"** — confirm the Merkle hash chain shows "Valid" status
3. Run **AI Anomaly Detection** — review flagged anomalies, off-hours activity, actor anomalies
4. Generate **AI Audit Summary** for the audit period — retain as audit artifact
5. Review all validation records for the period — confirm independence, completeness, and approval chain
6. Confirm all Tier 1 models have monitoring records within the required frequency

**What to look for in the audit trail:**
- Models archived without a prior validation (examine if this was appropriate)
- Validation approvals by users who were involved in model development (independence violation)
- Long gaps in monitoring records for Tier 1 models
- Materiality check overrides (where a change was logged as non-material without AI confirmation)
- Changes to a model's risk tier without re-running the Risk Rating Wizard

**For OSFI examination support:**
- Provide the Merkle root (from Audit Integrity) as evidence of tamper-proof records
- Export the Audit Trail for the period in question
- Provide AI Audit Summary as the narrative evidence of governance activity

**Key screens:** Audit Trail, AI Audit Summary, Audit Integrity, Validations, AI Anomaly Detection

---

### Administrator (System Admin)

**Primary objectives:** User provisioning, access control, SSO configuration, platform health

**At institution onboarding:**
1. Log in and complete the **Admin Panel → Institution Setup**
2. Run **AI Onboarding Plan** — review the quick wins and P1 30-day actions for your specific institution type
3. Provision all user accounts with appropriate roles (analyst, validator, admin)
4. Configure SSO if your institution uses Azure AD, Okta, or another SAML 2.0 provider
5. Import existing model inventory via **CSV Import** (download template, populate, upload)

**User management best practices:**
- Assign the minimum role needed — most users should be "analyst" or "validator"
- Never assign "admin" to model validators — admin role can approve validations, creating segregation of duties risk
- Review user list quarterly — deactivate users who have left the institution

**Access control for OSFI §4.3:**
- Ensure model owners do not have "admin" role (prevents them from approving their own models' validations)
- Ensure validators are assigned to models they did not develop (validator independence)

**Regular maintenance:**
- Check PM2 / system health via your server monitoring
- Review the audit trail monthly for any unusual system-level events
- Ensure backups are current (AWS RDS automated backups provide this)

**Key screens:** Admin Panel, CSV Import, Audit Trail, Doc Intelligence (for bulk onboarding)

---

### Updated AI Feature Map (Phases 1–9)

All AI in ClearMRM runs on **AWS Bedrock (Claude)** in **ca-central-1 (Canada)**. No data leaves Canada. Temperature:0 is used for all compliance-relevant outputs to ensure deterministic, reproducible results.

| Feature | Model | Temp | Where | OSFI Basis |
|---|---|---|---|---|
| Action Queue Briefing | Sonnet | 0.3 | Dashboard | §4 — CRO oversight |
| AI Smart Fill | Haiku | 0.3 | Add Model | §4.1 — Documentation |
| AI Remediation Advisor | Sonnet | 0.3 | Model Detail | §4.2 — Remediation |
| AI Portfolio Doctor | Sonnet | 0 | Model Inventory | §3.1 — Portfolio health |
| OSFI Readiness Assessment | Haiku | 0 | Model Detail | §3.2 — Tier readiness |
| AI Pre-Assessment | Sonnet | 0.3 | Validation request | §4.3 — Scoping |
| AI Findings Analyzer | Sonnet | 0 | Validation modal | §4.3 — Finding classification |
| AI Approval Check | Sonnet | 0 | Validation modal | §4.3 — Completeness |
| AI Validation Report | Sonnet | 0 | Validation modal | §4.3 — MVR generation |
| AI Peer Benchmark | Haiku | 0 | Validation modal | §4.3 — Quality grading |
| AI Closure Summary | Haiku | 0 | Validation close | §4.4 — Audit narrative |
| AI Backtest Narrative | Haiku | 0 | Backtesting log | §4.3/§4.5 — Test evidence |
| AI Vendor §5 Deep Dive | Sonnet | 0 | Vendor modal | §5 — Third-party |
| AI B-10 Package | Sonnet | 0 | B-10 screen | B-10 — Vendor governance |
| AI Materiality Check | Sonnet | 0 | Change History | §4.2/§4.3 — Change assessment |
| AI Drift Analysis | Sonnet | 0 | Monitoring | §4.5 — Drift detection |
| PSI Analysis | Haiku | 0 | Monitoring | §4.5 — Quantitative drift |
| AI Assumption Sensitivity | Sonnet | 0 | Assumption Register | §4.1 — Documentation |
| AI Cascade Risk | Haiku | 0 | Dependencies | §3.1 — Model chains |
| AI Calendar Briefing | Haiku | 0.3 | Reg. Calendar | §4.3 — Deadline prioritization |
| AI Portfolio Impact | Haiku | 0 | Reg. Calendar | §4.3 — Event impact |
| AI MRA Statement | Sonnet | 0.3 | Risk Appetite | §3 — MRA generation |
| AI MRA Compliance Check | Sonnet | 0 | Risk Appetite | §3 — Compliance scoring |
| AI Exam Sprint | Sonnet | 0 | Exam Sprint | All §§ — Gap analysis |
| AI Examiner Prep Brief | Sonnet | 0 | Examiner Prep | All §§ — Exam readiness |
| AI Audit Anomaly | Haiku | 0 | Audit Trail | §4.4 — Anomaly detection |
| AI Audit Summary | Haiku | 0 | Audit Summary | §4.4 — Period narrative |
| AI Examiner Narrative | Sonnet | 0 | Examiner Export | All §§ — Supervisory |
| AI Board Pack Summary | Sonnet | 0.3 | Board Report | §4 — Board reporting |
| AI MRM Policy | Sonnet | 0 | MRM Policy | §3/§4 — Policy generation |
| AI Policy Gap Check | Sonnet | 0 | Policy Gap | §3/§4 — Gap analysis |
| AI Onboarding Plan | Sonnet | 0 | Admin Panel | All §§ — Onboarding |
| Natural Language Search | Haiku | 0.3 | Smart Search | §3.1 — Inventory query |
| Document Intelligence | Sonnet | 0.3 | Doc Intelligence | §4.1 — Data extraction |
| Validation Sprint Brief | Haiku | 0 | Validations | §4.3 — Scope estimate |

---

*This guide is maintained by the ClearMRM team. For the latest version, visit https://clearmrm.nimblestride.ca or contact myousufshariff@gmail.com.*

*ClearMRM is developed by Nimblestride Inc. and operates on AWS Canada (ca-central-1). All AI processing uses AWS Bedrock (Claude by Anthropic) and complies with PIPEDA and Quebec Law 25.*

*Version 5.0 — June 24, 2026 — Phases 1–9 complete including Insurance MRM, Cryptographic Audit Integrity, AI Portfolio Doctor, Validation Report Generator, Policy Generator, and all AI+ capabilities.*
