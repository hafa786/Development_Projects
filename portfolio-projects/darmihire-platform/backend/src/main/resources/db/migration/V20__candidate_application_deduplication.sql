-- =========================================================
-- Candidate deduplication
-- =========================================================

CREATE UNIQUE INDEX IF NOT EXISTS
    ux_candidates_tenant_email_lower
ON candidates (
    tenant_id,
    LOWER(email)
);


-- =========================================================
-- Job application deduplication
-- =========================================================

CREATE UNIQUE INDEX IF NOT EXISTS
    ux_job_applications_tenant_job_candidate
ON job_applications (
    tenant_id,
    job_id,
    candidate_id
);