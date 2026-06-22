-- ClearMRM Database Schema
-- OSFI E-23 Model Risk Management Platform
-- AWS RDS PostgreSQL 15, ca-central-1
-- Run against: psql -d clearmrm

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tenants ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tenants (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  domain     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id),
  email      TEXT NOT NULL UNIQUE,
  full_name  TEXT,
  role       TEXT NOT NULL DEFAULT 'analyst',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Models ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS models (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id),
  name                  TEXT NOT NULL,
  version               TEXT NOT NULL DEFAULT '1.0',
  description           TEXT,
  purpose               TEXT,
  business_unit         TEXT,
  model_owner_name      TEXT,
  model_owner_email     TEXT,
  methodology_type      TEXT,
  input_data_sources    TEXT,
  production_system     TEXT,
  deployed_at           DATE,
  is_third_party        BOOLEAN NOT NULL DEFAULT FALSE,
  vendor_name           TEXT,
  vendor_product        TEXT,
  risk_tier             INTEGER,
  last_validated_at     DATE,
  next_validation_due   DATE,
  status                TEXT NOT NULL DEFAULT 'active',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Risk Ratings ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS risk_ratings (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id),
  model_id              UUID NOT NULL REFERENCES models(id),
  rated_by_email        TEXT,
  q_financial_impact    TEXT,
  q_complexity          TEXT,
  q_regulatory_use      BOOLEAN NOT NULL DEFAULT FALSE,
  q_decision_volume     TEXT,
  q_last_validated      TEXT,
  q_data_quality        TEXT,
  q_is_vendor           BOOLEAN NOT NULL DEFAULT FALSE,
  q_multi_business_unit BOOLEAN NOT NULL DEFAULT FALSE,
  computed_tier         INTEGER,
  score_total           INTEGER,
  score_breakdown       JSONB,
  ai_reasoning          TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Audit Events (IMMUTABLE — append-only) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_events (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     UUID NOT NULL,
  model_id      UUID,
  actor_email   TEXT,
  event_type    TEXT NOT NULL,
  field_changed TEXT,
  old_value     TEXT,
  new_value     TEXT,
  metadata      JSONB,
  ip_address    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Immutability trigger — OSFI E-23 §4.4 requirement
CREATE OR REPLACE FUNCTION prevent_audit_mutation() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'audit_events is append-only: mutations are not permitted (OSFI E-23 §4.4)';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_immutable ON audit_events;
CREATE TRIGGER audit_immutable
  BEFORE UPDATE OR DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();

-- ── Validations (Phase 2) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS validations (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id),
  model_id              UUID NOT NULL REFERENCES models(id),
  status                TEXT NOT NULL DEFAULT 'requested',
  -- Status state machine: requested → assigned → in_progress → findings_submitted → approved → closed
  validation_type       TEXT NOT NULL DEFAULT 'full',
  -- Types: full | targeted | monitoring
  scope                 TEXT,
  requested_by_email    TEXT,
  assigned_to_email     TEXT,
  assigned_at           TIMESTAMPTZ,
  started_at            TIMESTAMPTZ,
  due_date              DATE,
  findings              TEXT,
  outcome               TEXT,
  -- Outcomes: pass | conditional_pass | fail
  conditions            TEXT,
  approved_by_email     TEXT,
  approved_at           TIMESTAMPTZ,
  ai_pre_assessment     TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Vendor Assessments (Phase 2) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendor_assessments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id),
  model_id              UUID NOT NULL REFERENCES models(id),
  assessed_by_email     TEXT,
  q_sla_documented      BOOLEAN DEFAULT FALSE,
  q_data_access         BOOLEAN DEFAULT FALSE,
  q_audit_rights        BOOLEAN DEFAULT FALSE,
  q_exit_plan           BOOLEAN DEFAULT FALSE,
  q_concentration_risk  BOOLEAN DEFAULT FALSE,
  q_model_doc_received  BOOLEAN DEFAULT FALSE,
  q_override_capability BOOLEAN DEFAULT FALSE,
  risk_score            INTEGER,
  risk_level            TEXT,
  -- Risk levels: low | medium | high
  findings              TEXT,
  ai_assessment         TEXT,
  next_review_due       DATE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_models_tenant    ON models(tenant_id);
CREATE INDEX IF NOT EXISTS idx_models_tier      ON models(risk_tier);
CREATE INDEX IF NOT EXISTS idx_models_status    ON models(status);
CREATE INDEX IF NOT EXISTS idx_audit_tenant     ON audit_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_model      ON audit_events(model_id);
CREATE INDEX IF NOT EXISTS idx_audit_created    ON audit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ratings_model    ON risk_ratings(model_id);
CREATE INDEX IF NOT EXISTS idx_validations_tenant  ON validations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_validations_model   ON validations(model_id);
CREATE INDEX IF NOT EXISTS idx_validations_status  ON validations(status);
CREATE INDEX IF NOT EXISTS idx_vendor_model        ON vendor_assessments(model_id);

-- ── Updated_at triggers ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS models_updated_at ON models;
CREATE TRIGGER models_updated_at BEFORE UPDATE ON models FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS validations_updated_at ON validations;
CREATE TRIGGER validations_updated_at BEFORE UPDATE ON validations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
