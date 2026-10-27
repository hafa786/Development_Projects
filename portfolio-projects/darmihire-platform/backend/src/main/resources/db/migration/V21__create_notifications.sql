CREATE TABLE notifications (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,

    channel VARCHAR(30) NOT NULL,

    type VARCHAR(60) NOT NULL,

    status VARCHAR(30) NOT NULL,

    recipient VARCHAR(320) NOT NULL,

    subject VARCHAR(500) NOT NULL,

    related_entity_type VARCHAR(100),

    related_entity_id UUID,

    provider_message_id VARCHAR(500),

    failure_reason VARCHAR(1000),

    sent_at TIMESTAMPTZ,

    failed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL,

    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_notifications_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_notifications_tenant_created
    ON notifications (
        tenant_id,
        created_at
    );


CREATE INDEX idx_notifications_tenant_status
    ON notifications (
        tenant_id,
        status
    );


CREATE INDEX idx_notifications_related_entity
    ON notifications (
        tenant_id,
        related_entity_type,
        related_entity_id
    );