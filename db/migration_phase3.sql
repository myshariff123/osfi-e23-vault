-- ClearMRM Phase 3 Migration
-- Run against clearmrm DB:
--   psql "host=<DB_HOST> dbname=clearmrm user=<DB_USER> password=<DB_PASSWORD> sslmode=require" -f migration_phase3.sql

-- Phase 2 AI Enhancement columns
ALTER TABLE validations ADD COLUMN IF NOT EXISTS ai_findings_analysis JSONB;
ALTER TABLE validations ADD COLUMN IF NOT EXISTS ai_approval_check    JSONB;
ALTER TABLE validations ADD COLUMN IF NOT EXISTS ai_closure_summary   TEXT;
ALTER TABLE vendor_assessments ADD COLUMN IF NOT EXISTS ai_deepdive   JSONB;

-- Phase 3 Tenant enhancements (onboarding + SSO)
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS institution_type   TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS asset_size_tier    TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS sso_enabled        BOOLEAN DEFAULT FALSE;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS sso_provider_name  TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS sso_metadata_url   TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS status             TEXT DEFAULT 'active';

-- Index for SSO domain lookup
CREATE INDEX IF NOT EXISTS idx_tenants_domain  ON tenants(domain);
CREATE INDEX IF NOT EXISTS idx_tenants_status  ON tenants(status);
