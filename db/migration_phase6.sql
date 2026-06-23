-- ClearMRM Phase 6 Migration — Audit Integrity (Merkle Hash Chain)
-- psql "host=<DB_HOST> dbname=clearmrm user=<DB_USER> password=<DB_PASSWORD> sslmode=require" -f migration_phase6.sql

-- Add hash chain columns to audit_events
-- The DB trigger already prevents UPDATE/DELETE — these columns extend the immutability guarantee
ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS event_hash TEXT;
ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS chain_seq  BIGINT;

-- Index for fast chain tip lookup (most-recent hashed event per tenant)
CREATE INDEX IF NOT EXISTS idx_audit_chain ON audit_events(tenant_id, chain_seq DESC NULLS LAST) WHERE event_hash IS NOT NULL;

-- All future events will be written with event_hash and chain_seq by the application
-- Legacy events (pre-Phase 6) remain valid and are counted separately in /api/audit/verify-integrity
