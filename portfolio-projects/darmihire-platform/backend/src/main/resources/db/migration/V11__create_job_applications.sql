CREATE TABLE job_applications (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,
    job_id UUID NOT NULL,
    candidate_id UUID NOT NULL,

    stage VARCHAR(30) NOT NULL
        DEFAULT 'APPLIED',

    status VARCHAR(30) NOT NULL
        DEFAULT 'ACTIVE',

    applied_at TIMESTAMP WITH TIME ZONE NOT NULL,

    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason VARCHAR(1000),

    withdrawn_at TIMESTAMP WITH TIME ZONE,
    hired_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_job_applications_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_job_applications_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_job_applications_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidates(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_job_applications_tenant_job_candidate
        UNIQUE (
            tenant_id,
            job_id,
            candidate_id
        )
);

CREATE INDEX idx_job_applications_tenant
    ON job_applications(tenant_id);

CREATE INDEX idx_job_applications_job
    ON job_applications(
        tenant_id,
        job_id
    );

CREATE INDEX idx_job_applications_candidate
    ON job_applications(
        tenant_id,
        candidate_id
    );

CREATE INDEX idx_job_applications_stage
    ON job_applications(
        tenant_id,
        job_id,
        stage
    );

CREATE INDEX idx_job_applications_status
    ON job_applications(
        tenant_id,
        status
    );