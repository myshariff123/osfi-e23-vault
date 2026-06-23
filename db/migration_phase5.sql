-- ClearMRM Phase 5 Migration (God-Level AI + Policy Generator + NLS)
-- psql "host=<DB_HOST> dbname=clearmrm user=<DB_USER> password=<DB_PASSWORD> sslmode=require" -f migration_phase5.sql

-- MRM Policy Generator (board-submittable AI-generated policy documents)
CREATE TABLE IF NOT EXISTS mrm_policies (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id),
  version      TEXT DEFAULT 'v1.0',
  status       TEXT DEFAULT 'draft' CHECK (status IN ('draft','approved')),
  inputs       JSONB,
  policy_text  TEXT,
  approved_by  TEXT,
  approved_at  TIMESTAMPTZ,
  created_by   TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mrm_policies_tenant ON mrm_policies(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mrm_policies_created ON mrm_policies(created_at DESC);

-- Store AI-generated validation reports on each validation
ALTER TABLE validations ADD COLUMN IF NOT EXISTS generated_report      JSONB;
ALTER TABLE validations ADD COLUMN IF NOT EXISTS report_generated_at   TIMESTAMPTZ;
ALTER TABLE validations ADD COLUMN IF NOT EXISTS report_generated_by   TEXT;
