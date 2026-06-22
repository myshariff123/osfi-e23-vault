# OSFI E-23 Vault — Model Risk Management Platform for Canadian FRFIs

> **Purpose-built model inventory and compliance platform for Canada's OSFI E-23 Guideline (effective May 1, 2027)**

---

## What Is This?

OSFI E-23 Vault is a SaaS platform that helps Canadian Federally Regulated Financial Institutions (FRFIs) build, manage, and demonstrate a compliant model inventory under OSFI Guideline E-23 — *Model Risk Management* (final version, September 2025, effective May 1, 2027).

Every FRFI — banks, trust companies, insurance companies, mortgage insurers, and federal pension administrators — must maintain a comprehensive, auditable model inventory by May 2027. 70%+ currently manage this in Excel spreadsheets that cannot meet E-23's requirements.

**This platform is the solution. Purpose-built. Canadian-hosted. Operational in 30 days.**

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

## The Solution

A structured, role-based, Canadian-hosted SaaS platform with five core pillars:

1. **Model Registry** — Complete structured inventory, every model, every version
2. **Risk Rating Engine** — Automated, defensible Tier 1/2/3 classification aligned to E-23
3. **Validation Workflow** — Scheduled, tracked, signed-off, escalation-aware
4. **Third-Party Model Module** — Vendor model inventory, assessment, and governance
5. **Immutable Audit Trail + Board Reporting** — OSFI examiner-ready, one-click generation

---

## Why Now

- **OSFI E-23 effective date: May 1, 2027** — 11 months from product inception (June 2026)
- The 2025 revision **tripled the addressable market** by expanding scope from banks to all FRFIs (insurers, pension administrators)
- **No Canadian-native, purpose-built, OSFI-specific platform exists**
- Enterprise alternatives (IBM OpenPages at $800K–$2.5M) are inaccessible to 90% of FRFIs
- First-mover window closes approximately Q1 2027 when deadline urgency peaks

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

## Competitive Position

| Competitor | Price | Implementation | OSFI-Native | Canadian Hosted |
|---|---|---|---|---|
| IBM OpenPages | $800K–$2.5M | 12–24 months | No (configured) | No |
| SAS MRM | $500K–$1.5M | 9–18 months | No | No |
| ValidMind | $80K–$200K | 3–6 months | No (US-framed) | No |
| **OSFI E-23 Vault** | **$30K–$180K** | **30 days** | **Yes (by design)** | **Yes (ca-central-1)** |

---

## Technology Stack

- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Backend:** Node.js 20 LTS + TypeScript + Express / Fastify
- **Database:** PostgreSQL 15 on AWS RDS ca-central-1 (with Row-Level Security)
- **AI Layer:** AWS Bedrock + Claude (ca-central-1 — PIPEDA compliant)
- **Infrastructure:** AWS ECS Fargate, ca-central-1 exclusively
- **Auth:** AWS Cognito + MFA enforcement
- **CI/CD:** GitHub Actions → ECR → ECS

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

## Repository Contents

| File | Description |
|---|---|
| `README.md` | This file — product overview and positioning |
| `BUSINESS_PLAN.md` | Complete Harvard/Oxford faculty panel business plan and go-to-market strategy |
| `PRODUCT_FORMULATION.md` | Full product formulation conversation log — decisions made, features defined, rationale captured |
| `docs/TECH_STACK.md` | Detailed technology architecture |
| `docs/COMPETITIVE_ANALYSIS.md` | Deep competitive landscape analysis |
| `docs/TARGET_CUSTOMERS.md` | Top 10 customer profiles (Alberta + Canada) |

---

## Status

| Phase | Timeline | Status |
|---|---|---|
| Phase 0: Foundation (regulatory counsel, DPA, discovery calls) | Jun–Jul 2026 | **In Planning** |
| Phase 1: MVP Development (Model Registry + Risk Rating + Audit Trail) | Jul–Oct 2026 | Pending |
| Phase 2: Pilot Client Acquisition (2–3 lighthouse clients) | Oct 2026–Jan 2027 | Pending |
| Phase 3: General Availability (Validation Workflow + Third-Party Module) | Jan–Mar 2027 | Pending |
| Phase 4: Market Consolidation (OSFI Examiner Export, Emergency Sprint pkg) | Mar–May 2027+ | Pending |

---

## Critical Compliance Requirements

- **Data Residency:** All data in AWS ca-central-1. No exceptions. Contractually guaranteed.
- **Privacy Law:** PIPEDA + Quebec Law 25 compliant DPA in place before first enterprise client
- **SOC 2 Type I:** Target Month 4–6
- **SOC 2 Type II:** Target Month 12–18
- **Penetration Test:** Annual CREST-certified Canadian vendor, before first enterprise client
- **Regulatory Counsel Opinion:** OSFI E-23 alignment memo from Canadian counsel, Month 2

---

## Grant Opportunities (Canada)

- **SR&ED:** 35% refundable ITC for CCPC R&D → ~$140K annually on $400K eligible spend
- **NRC IRAP:** $150K–$250K non-repayable contribution
- **Alberta Innovates Voucher:** Up to $100K for market validation
- **Alberta Scaleup Program:** 50% wage subsidy on qualified employees

---

*Last updated: June 2026 | Nimblestride Inc.*
