CREATE TABLE candidates (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),

    location VARCHAR(255),

    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),

    source VARCHAR(50) NOT NULL DEFAULT 'MANUAL',

    resume_file_name VARCHAR(255),
    resume_url VARCHAR(1000),

    notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_candidates_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_candidates_tenant_email
        UNIQUE (tenant_id, email)
);

CREATE INDEX idx_candidates_tenant_id
    ON candidates(tenant_id);

CREATE INDEX idx_candidates_tenant_created_at
    ON candidates(tenant_id, created_at DESC);

CREATE INDEX idx_candidates_tenant_name
    ON candidates(tenant_id, last_name, first_name);