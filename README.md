# ClearMRM — OSFI E-23 Model Risk Management Platform

> **Live SaaS platform for Canadian FRFIs. Purpose-built for OSFI Guideline E-23 (effective May 1, 2027).**
>
> **Live URL:** https://clearmrm.nimblestride.ca

---

## What Is ClearMRM?

ClearMRM is a production SaaS platform that helps Canadian Federally Regulated Financial Institutions (FRFIs) build, manage, and demonstrate a compliant model inventory under OSFI Guideline E-23 — *Model Risk Management* (final version, September 2025, effective May 1, 2027).

Every FRFI — banks, trust companies, insurance companies, mortgage insurers, and federal pension administrators — must maintain a comprehensive, auditable model inventory by May 2027. 70%+ currently manage this in Excel spreadsheets that cannot meet E-23's requirements.

**ClearMRM is the solution. Purpose-built. Canadian-hosted. Live today.**

---

## The Problem

| Requirement | What E-23 Demands | What Most FRFIs Have Today |
|---|---|---|
| Model Inventory | Complete registry of all models with non-negligible risk | Excel spreadsheet |
| Risk Rating | Documented, defensible risk tier per model | Manual, inconsistent |
| Validation Tracking | Scheduled validation with independent oversight | Email threads |
| Third-Party Models | Governance of all vendor/AI models | Ungoverned |
| Audit Trail | Immutable log of every change | None |
| Board Reporting | OSFI-formatted Board Risk Committee pack | 3-day manual build |

---

## Live Features (Phase 1 + Phase 2 — Production as of June 22, 2026)

### Phase 1: Core Platform

| Feature | Description | OSFI E-23 Section |
|---|---|---|
| **Model Inventory** | Structured registry with 15+ fields per model, version tracking, soft-delete | §3 |
| **Risk Rating Engine** | 8-question wizard, automated Tier 1/2/3 scoring (max 22 pts), AI reasoning | §3.2 |
| **Audit Trail** | Immutable append-only log (PostgreSQL trigger blocks UPDATE/DELETE) | §4.4 |
| **Board Report PDF** | One-click 3-page PDF: KPIs, model table, Tier 1 detail | §4 |
| **CSV Import** | Bulk model import for migration from Excel | — |
| **Dashboard** | Live KPIs: model count, Tier 1 count, pending validations, compliance score | — |

### Phase 1 AI Enhancements (Bedrock Claude, ca-central-1)

| Feature | Model | Description |
|---|---|---|
| **Dashboard Intelligence** | Claude 3 Haiku | 2-sentence CRO morning briefing — top risk, action needed |
| **AI Smart Fill** | Claude 3 Haiku | Type model name → auto-populate purpose, methodology, risk factors |
| **Remediation Advisor** | Claude 3 Sonnet | Per-model: priority actions, OSFI gaps, estimated effort, compliance score |
| **Board Report AI Summary** | Claude 3 Sonnet | Executive summary paragraph auto-generated for board pack PDF |

### Phase 2: Workflow & Vendor Governance

| Feature | Description | OSFI E-23 Section |
|---|---|---|
| **Validation Workflow** | 6-state machine: requested → assigned → in_progress → findings_submitted → approved → closed | §3.3 |
| **AI Pre-Assessment** | Haiku generates validation scope and key risk areas when validation is requested | §3.3 |
| **Vendor Assessment** | 7-question OSFI §5 checklist for third-party/vendor models, AI risk summary | §5 |

---

## Application Screens (12 total)

1. Login (Cognito / MFA)
2. Dashboard (KPIs + AI morning briefing)
3. Model Inventory (filterable table)
4. Add Model (with AI Smart Fill)
5. Edit Model
6. Model Detail (with Remediation Advisor)
7. Risk Rating Wizard (8-question, auto-scores)
8. Validations (full workflow manager)
9. Vendor Assessments
10. Audit Trail (immutable, read-only)
11. Board Report (PDF generation)
12. CSV Import

---

## Technology Stack (Deployed)

| Layer | Technology |
|---|---|
| **Frontend** | React 18.3.1 + Babel 7.27.5 (browser, single-file SPA) |
| **Backend** | Node.js + Express 5 (CommonJS), PM2 process manager |
| **Database** | PostgreSQL 15 on AWS RDS ca-central-1 |
| **AI** | AWS Bedrock — Claude 3 Haiku (fast) + Claude 3 Sonnet (primary), ca-central-1 |
| **Auth** | AWS Cognito (USER_PASSWORD_AUTH, backend-mediated) |
| **Infrastructure** | AWS EC2 (Ubuntu), Nginx reverse proxy, Let's Encrypt SSL |
| **Data Residency** | 100% AWS ca-central-1 — no data leaves Canada |

**All AI calls use AWS Bedrock in ca-central-1. OpenAI is never used (PIPEDA compliance — OPC/CAI/OIPC Joint Investigation of OpenAI, May 6, 2026).**

---

## Competitive Position

| Competitor | Price | Implementation | OSFI-Native | Canadian Hosted |
|---|---|---|---|---|
| IBM OpenPages | $800K–$2.5M | 12–24 months | No (configured) | No |
| SAS MRM | $500K–$1.5M | 9–18 months | No | No |
| ValidMind | $80K–$200K | 3–6 months | No (US-framed) | No |
| **ClearMRM** | **$30K–$180K** | **30 days** | **Yes (by design)** | **Yes (ca-central-1)** |

---

## Target Market

| Segment | Institution Type | Approx. Count | ACV Target |
|---|---|---|---|
| Primary | Tier 2 Banks & Trust Companies ($1B–$100B assets) | ~35 | $72K–$144K/yr |
| Primary | Federal Insurers under OSFI | ~70 | $60K–$120K/yr |
| Secondary | Credit Union Centrals | ~50 | $30K–$72K/yr |
| Secondary | Federal Pension Administrators | ~15 | $36K–$96K/yr |

**Total Canadian TAM: ~$28.8M ARR** (400 FRFIs × $72K avg ACV)

---

## Revenue Projections

| Period | Clients | ARR |
|---|---|---|
| Month 9 (Mar 2027) | 5 | $360K |
| Month 12 (Jun 2027) | 10 | $800K |
| Month 18 (Dec 2027) | 20 | $1.8M |
| Month 24 (Jun 2028) | 35 | $3.3M |
| Month 36 (Jun 2029) | 60 | $6M |

---

## Repository Structure

```
clearmrm/
├── backend/
│   ├── server.js          # Express 5 API — all endpoints, AI, auth, PDF
│   ├── package.json       # Node dependencies
│   └── .env.example       # Environment variable template (no secrets)
├── frontend/
│   └── index.html         # React 18 SPA — all 12 screens
├── db/
│   └── schema.sql         # PostgreSQL schema — 7 tables, triggers, indexes
├── PRODUCT_FORMULATION.md # Full product decisions, feature register, milestone tracker
├── BUSINESS_PLAN.md       # Go-to-market strategy and financial projections
└── README.md              # This file
```

---

## Development Status

| Phase | Description | Status | Completed |
|---|---|---|---|
| **Phase 0** | Foundation — architecture decisions, DB schema, infrastructure | COMPLETE | Jun 2026 |
| **Phase 1** | Core platform — Model Inventory, Risk Rating, Audit Trail, Board Report | COMPLETE | Jun 22, 2026 |
| **Phase 1 AI+** | AI enhancements — Dashboard Insight, Smart Fill, Remediation Advisor, AI Board Report | COMPLETE | Jun 22, 2026 |
| **Phase 2** | Validation Workflow + Vendor Assessment Module | COMPLETE | Jun 22, 2026 |
| **Phase 3** | Multi-tenant onboarding, OSFI Examiner Export, SSO | Planned | Q4 2026 |
| **Phase 4** | Market consolidation, Emergency Exam Sprint Package | Planned | Q1 2027 |

---

## Critical Compliance Requirements

- **Data Residency:** All data in AWS ca-central-1. No exceptions. Contractually guaranteed.
- **AI Compliance:** All AI via AWS Bedrock Claude (ca-central-1). OpenAI is prohibited.
- **Privacy Law:** PIPEDA + Quebec Law 25 compliant
- **Audit Immutability:** PostgreSQL trigger enforces append-only audit_events (OSFI E-23 §4.4)
- **SOC 2 Type I:** Target Month 4–6
- **SOC 2 Type II:** Target Month 12–18
- **Penetration Test:** Annual CREST-certified Canadian vendor

---

## Grant Opportunities (Canada)

- **SR&ED:** 35% refundable ITC for CCPC R&D → ~$140K annually on $400K eligible spend
- **NRC IRAP:** $150K–$250K non-repayable contribution
- **Alberta Innovates Voucher:** Up to $100K for market validation
- **Alberta Scaleup Program:** 50% wage subsidy on qualified employees

---

*Product: ClearMRM by Nimblestride Inc. | Live: https://clearmrm.nimblestride.ca | Last updated: June 22, 2026*
