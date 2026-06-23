-- ClearMRM Phase 4b Migration (Monitoring + MRA)
-- psql "host=<DB_HOST> dbname=clearmrm user=<DB_USER> password=<DB_PASSWORD> sslmode=require" -f migration_phase4b.sql

-- Ongoing model performance monitoring
CREATE TABLE IF NOT EXISTS model_monitoring (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  model_id        UUID NOT NULL REFERENCES models(id),
  metric_name     TEXT NOT NULL,
  metric_value    NUMERIC NOT NULL,
  threshold_amber NUMERIC,
  threshold_red   NUMERIC,
  notes           TEXT,
  logged_by_email TEXT NOT NULL,
  logged_at       DATE DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_monitoring_model_id  ON model_monitoring(model_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_tenant_id ON model_monitoring(tenant_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_logged_at ON model_monitoring(logged_at DESC);

-- Model Risk Appetite statements
CREATE TABLE IF NOT EXISTS risk_appetite_statements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      UUID NOT NULL REFERENCES tenants(id),
  version        TEXT DEFAULT 'v1.0',
  status         TEXT DEFAULT 'draft',
  inputs         JSONB,
  statement_text TEXT,
  approved_by    TEXT,
  approved_at    TIMESTAMPTZ,
  created_by     TEXT NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ras_tenant_id ON risk_appetite_statements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ras_created   ON risk_appetite_statements(created_at DESC);
