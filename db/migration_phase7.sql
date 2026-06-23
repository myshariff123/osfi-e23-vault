-- ClearMRM Phase 7 Migration — Insurance-Specific MRM Depth
-- Features: Insurance taxonomy, Assumption Register, Backtesting Logs, Model Dependency Map
-- Run after migration_phase6.sql

-- ─── 1. Insurance-specific columns on models ──────────────────────────────────
ALTER TABLE models ADD COLUMN IF NOT EXISTS insurance_category    TEXT;
ALTER TABLE models ADD COLUMN IF NOT EXISTS is_spreadsheet_model  BOOLEAN DEFAULT FALSE;
ALTER TABLE models ADD COLUMN IF NOT EXISTS spreadsheet_location  TEXT;
ALTER TABLE models ADD COLUMN IF NOT EXISTS is_ifrs17_model       BOOLEAN DEFAULT FALSE;
ALTER TABLE models ADD COLUMN IF NOT EXISTS ifrs17_component      TEXT;
ALTER TABLE models ADD COLUMN IF NOT EXISTS regulatory_capital_linked BOOLEAN DEFAULT FALSE;
ALTER TABLE models ADD COLUMN IF NOT EXISTS capital_framework     TEXT;

-- ─── 2. Actuarial Assumption Register ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS model_assumptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id        UUID NOT NULL REFERENCES models(id),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  assumption_name TEXT NOT NULL,
  current_value   TEXT NOT NULL,
  prior_value     TEXT,
  unit            TEXT,
  approved_by     TEXT,
  approved_at     TIMESTAMPTZ,
  effective_date  DATE,
  change_reason   TEXT,
  created_by      TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_assumptions_model ON model_assumptions(model_id, tenant_id);

-- ─── 3. Backtesting Log ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS backtesting_logs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  validation_id       UUID NOT NULL REFERENCES validations(id),
  model_id            UUID NOT NULL REFERENCES models(id),
  tenant_id           UUID NOT NULL REFERENCES tenants(id),
  test_name           TEXT NOT NULL,
  period_start        DATE,
  period_end          DATE,
  predicted_value     TEXT,
  actual_value        TEXT,
  tolerance_threshold TEXT,
  variance_pct        NUMERIC(10,4),
  verdict             TEXT CHECK (verdict IN ('pass','fail','inconclusive')),
  notes               TEXT,
  conducted_by        TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_backtest_validation ON backtesting_logs(validation_id, tenant_id);

-- ─── 4. Model Dependency Map ──────────────────────────────────────────────────
-- upstream_model_id feeds INTO downstream_model_id
-- e.g. Cat Model (upstream) → Capital Model (downstream)
CREATE TABLE IF NOT EXISTS model_dependencies (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upstream_model_id    UUID NOT NULL REFERENCES models(id),
  downstream_model_id  UUID NOT NULL REFERENCES models(id),
  tenant_id            UUID NOT NULL REFERENCES tenants(id),
  dependency_type      TEXT DEFAULT 'feeds_into',
  notes                TEXT,
  created_by           TEXT NOT NULL,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(upstream_model_id, downstream_model_id)
);
CREATE INDEX IF NOT EXISTS idx_deps_up   ON model_dependencies(upstream_model_id, tenant_id);
CREATE INDEX IF NOT EXISTS idx_deps_down ON model_dependencies(downstream_model_id, tenant_id);
