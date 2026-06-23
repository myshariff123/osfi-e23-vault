-- ClearMRM Phase 4 Migration
-- Run against clearmrm DB:
--   psql "host=<DB_HOST> dbname=clearmrm user=<DB_USER> password=<DB_PASSWORD> sslmode=require" -f migration_phase4.sql

-- ── Model Change Management ───────────────────────────────────────────────────
ALTER TABLE models ADD COLUMN IF NOT EXISTS current_version       TEXT DEFAULT 'v1.0';
ALTER TABLE models ADD COLUMN IF NOT EXISTS revalidation_required BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS model_versions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id),
  model_id              UUID NOT NULL REFERENCES models(id),
  version_label         TEXT NOT NULL,
  change_type           TEXT NOT NULL CHECK (change_type IN ('major','minor','patch')),
  change_category       TEXT DEFAULT 'other',
  change_reason         TEXT NOT NULL,
  is_material           BOOLEAN DEFAULT FALSE,
  requires_revalidation BOOLEAN DEFAULT FALSE,
  changed_by_email      TEXT NOT NULL,
  snapshot              JSONB,
  ai_materiality        JSONB,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_model_versions_model_id  ON model_versions(model_id);
CREATE INDEX IF NOT EXISTS idx_model_versions_tenant_id ON model_versions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_model_versions_created   ON model_versions(created_at DESC);

-- ── Exam Sprint Sessions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_sprints (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id),
  created_by_email    TEXT NOT NULL,
  status              TEXT DEFAULT 'active',
  overall_score       INTEGER,
  exam_risk_level     TEXT,
  gap_analysis        JSONB,
  sprint_plan         JSONB,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_sprints_tenant_id ON exam_sprints(tenant_id);
CREATE INDEX IF NOT EXISTS idx_exam_sprints_created   ON exam_sprints(created_at DESC);
