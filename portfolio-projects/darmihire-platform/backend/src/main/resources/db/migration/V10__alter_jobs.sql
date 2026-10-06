DROP TABLE IF EXISTS jobs CASCADE;

DELETE FROM flyway_schema_history
WHERE version = '9';

CREATE TABLE jobs (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,

    title VARCHAR(200) NOT NULL,
    job_code VARCHAR(50) NOT NULL,
    description TEXT,

    department_id UUID,
    team_id UUID,
    location_id UUID,

    recruiter_id UUID,
    hiring_manager_id UUID,

    employment_type VARCHAR(30) NOT NULL,
    workplace_type VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,

    openings INTEGER NOT NULL DEFAULT 1,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_jobs_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_jobs_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id),

    CONSTRAINT fk_jobs_team
        FOREIGN KEY (team_id)
        REFERENCES teams(id),

    CONSTRAINT fk_jobs_location
        FOREIGN KEY (location_id)
        REFERENCES locations(id),

    CONSTRAINT fk_jobs_recruiter
        FOREIGN KEY (recruiter_id)
        REFERENCES tenant_users(id),

    CONSTRAINT fk_jobs_hiring_manager
        FOREIGN KEY (hiring_manager_id)
        REFERENCES tenant_users(id),

    CONSTRAINT uk_jobs_tenant_code
        UNIQUE (tenant_id, job_code),

    CONSTRAINT chk_jobs_openings
        CHECK (openings > 0)
);

CREATE INDEX idx_jobs_tenant
    ON jobs(tenant_id);

CREATE INDEX idx_jobs_status
    ON jobs(tenant_id, status);

CREATE INDEX idx_jobs_department
    ON jobs(department_id);

CREATE INDEX idx_jobs_team
    ON jobs(team_id);

CREATE INDEX idx_jobs_location
    ON jobs(location_id);