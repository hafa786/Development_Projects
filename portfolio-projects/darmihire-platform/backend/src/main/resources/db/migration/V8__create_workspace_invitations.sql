CREATE TABLE invitations (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,

    email VARCHAR(320) NOT NULL,

    role VARCHAR(50) NOT NULL,

    token_hash VARCHAR(64) NOT NULL,

    status VARCHAR(30) NOT NULL,

    invited_by UUID NOT NULL,

    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    accepted_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,

    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_invitations_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_invitations_invited_by
        FOREIGN KEY (invited_by)
        REFERENCES users(id),

    CONSTRAINT uk_invitations_token_hash
        UNIQUE (token_hash)
);

CREATE INDEX idx_invitations_tenant
    ON invitations(tenant_id);

CREATE INDEX idx_invitations_email
    ON invitations(email);

CREATE INDEX idx_invitations_status
    ON invitations(status);