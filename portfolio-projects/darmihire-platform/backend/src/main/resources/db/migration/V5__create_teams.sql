CREATE TABLE teams (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_teams_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_teams_tenant_name
        UNIQUE (tenant_id, name)
);

CREATE TABLE team_members (
    id UUID PRIMARY KEY,
    team_id UUID NOT NULL,
    tenant_user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_team_members_team
        FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_team_members_tenant_user
        FOREIGN KEY (tenant_user_id)
        REFERENCES tenant_users(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_team_member
        UNIQUE(team_id, tenant_user_id)
);

CREATE INDEX idx_teams_tenant
ON teams(tenant_id);