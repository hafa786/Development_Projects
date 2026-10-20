-- ============================================================
-- V20__update_tenant_public_slug.sql
--
-- Step 21.2 — Public Careers / Jobs Backend API
--
-- The tenants.slug column already exists.
-- This migration:
--   1. Backfills missing/blank slugs
--   2. Makes duplicate generated slugs unique
--   3. Enforces NOT NULL
--   4. Creates a unique index
-- ============================================================


-- ------------------------------------------------------------
-- 1. Generate slugs for tenants that do not currently have one.
--
-- UUID suffix guarantees uniqueness for existing tenants.
--
-- Example:
--   Darmi Solutions
--   -> darmi-solutions-a1b2c3d4
-- ------------------------------------------------------------

UPDATE tenants
SET slug =
        CASE

            -- If normalization produces an empty slug,
            -- use "company" as the fallback.
            WHEN LOWER(
                    REGEXP_REPLACE(
                        REGEXP_REPLACE(
                            TRIM(name),
                            '[^a-zA-Z0-9]+',
                            '-',
                            'g'
                        ),
                        '(^-+|-+$)',
                        '',
                        'g'
                    )
                 ) = ''
            THEN
                'company-' || SUBSTRING(id::text, 1, 8)

            ELSE
                LOWER(
                    REGEXP_REPLACE(
                        REGEXP_REPLACE(
                            TRIM(name),
                            '[^a-zA-Z0-9]+',
                            '-',
                            'g'
                        ),
                        '(^-+|-+$)',
                        '',
                        'g'
                    )
                )
                || '-'
                || SUBSTRING(id::text, 1, 8)

        END
WHERE slug IS NULL
   OR TRIM(slug) = '';


-- ------------------------------------------------------------
-- 2. Fix any duplicate slugs that may already exist.
--
-- Keep the first occurrence unchanged.
-- Add a short UUID suffix to subsequent duplicates.
-- ------------------------------------------------------------

WITH duplicate_slugs AS (

    SELECT
        id,
        slug,

        ROW_NUMBER() OVER (
            PARTITION BY LOWER(slug)
            ORDER BY id
        ) AS row_number

    FROM tenants

)
UPDATE tenants t

SET slug =
        t.slug
        || '-'
        || SUBSTRING(t.id::text, 1, 8)

FROM duplicate_slugs d

WHERE t.id = d.id
  AND d.row_number > 1;


-- ------------------------------------------------------------
-- 3. Tenant public slug must always exist.
-- ------------------------------------------------------------

ALTER TABLE tenants
    ALTER COLUMN slug SET NOT NULL;


-- ------------------------------------------------------------
-- 4. Ensure public company slugs are unique.
--
-- LOWER(slug) prevents:
--
--   darmi-solutions
--   Darmi-Solutions
--
-- from existing as separate public identifiers.
-- ------------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS uq_tenants_slug_lower
    ON tenants (LOWER(slug));