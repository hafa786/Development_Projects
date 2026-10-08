CREATE TABLE application_activities (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,
    application_id UUID NOT NULL,

    activity_type VARCHAR(50) NOT NULL,

    from_stage VARCHAR(30),
    to_stage VARCHAR(30),

    description VARCHAR(1000),

    performed_by_id UUID,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_application_activities_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_application_activities_application
        FOREIGN KEY (application_id)
        REFERENCES job_applications(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_application_activities_performed_by
        FOREIGN KEY (performed_by_id)
        REFERENCES tenant_users(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_application_activities_tenant
    ON application_activities(tenant_id);

CREATE INDEX idx_application_activities_application
    ON application_activities(
        tenant_id,
        application_id
    );

CREATE INDEX idx_application_activities_created
    ON application_activities(
        tenant_id,
        application_id,
        created_at
    );