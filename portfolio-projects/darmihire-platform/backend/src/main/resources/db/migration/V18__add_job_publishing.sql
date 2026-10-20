ALTER TABLE jobs
    ADD COLUMN published BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE jobs
    ADD COLUMN published_at TIMESTAMPTZ;

ALTER TABLE jobs
    ADD COLUMN public_slug VARCHAR(250);

ALTER TABLE jobs
    ADD COLUMN application_deadline DATE;


CREATE UNIQUE INDEX uq_jobs_tenant_public_slug
    ON jobs(tenant_id, public_slug)
    WHERE public_slug IS NOT NULL;


CREATE INDEX idx_jobs_public_listing
    ON jobs(tenant_id, published, status);


CREATE INDEX idx_jobs_public_slug
    ON jobs(public_slug)
    WHERE public_slug IS NOT NULL;