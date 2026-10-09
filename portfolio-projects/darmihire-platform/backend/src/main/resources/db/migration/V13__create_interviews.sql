CREATE TABLE interviews (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,
    application_id UUID NOT NULL,

    title VARCHAR(200) NOT NULL,

    interview_type VARCHAR(50) NOT NULL,

    status VARCHAR(30) NOT NULL
        DEFAULT 'SCHEDULED',

    start_time TIMESTAMPTZ NOT NULL,

    end_time TIMESTAMPTZ NOT NULL,

    timezone VARCHAR(100) NOT NULL,

    location VARCHAR(500),

    meeting_url VARCHAR(1000),

    notes TEXT,

    cancellation_reason TEXT,

    cancelled_at TIMESTAMPTZ,

    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_interviews_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_interviews_application
        FOREIGN KEY (application_id)
        REFERENCES job_applications(id),

    CONSTRAINT chk_interview_times
        CHECK (end_time > start_time)
);

CREATE INDEX idx_interviews_tenant
    ON interviews(tenant_id);

CREATE INDEX idx_interviews_application
    ON interviews(application_id);

CREATE INDEX idx_interviews_start_time
    ON interviews(start_time);

CREATE INDEX idx_interviews_status
    ON interviews(status);