-- ============================
-- URL Shortener — Database Schema
-- ============================

CREATE TABLE IF NOT EXISTS url_mapping (
    id              BIGSERIAL       PRIMARY KEY,
    original_url    VARCHAR(2048)   NOT NULL,
    custom_slug     VARCHAR(30)     NOT NULL UNIQUE,
    risk_score      INTEGER         NOT NULL DEFAULT 0,
    is_safe         BOOLEAN         NOT NULL DEFAULT TRUE,
    click_count     BIGINT          NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date     TIMESTAMP       NOT NULL
);

-- Index for fast slug lookups during redirect
CREATE INDEX IF NOT EXISTS idx_url_mapping_slug ON url_mapping (custom_slug);

-- Index for expiry cleanup job
CREATE INDEX IF NOT EXISTS idx_url_mapping_expiry ON url_mapping (expiry_date);
