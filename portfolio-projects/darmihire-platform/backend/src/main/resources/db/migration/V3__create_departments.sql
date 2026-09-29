CREATE TABLE departments (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,

    name VARCHAR(255) NOT NULL,

    description TEXT,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_departments_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_departments_tenant_name
        UNIQUE (tenant_id, name)
);

CREATE INDEX idx_departments_tenant
ON departments(tenant_id);