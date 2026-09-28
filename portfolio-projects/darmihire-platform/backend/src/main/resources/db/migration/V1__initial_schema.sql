CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(1000),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE tenant_users (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,

    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,

    joined_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_tenant_users_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tenant_users_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_tenant_users
        UNIQUE (tenant_id, user_id)
);

CREATE INDEX idx_tenant_users_tenant_id
    ON tenant_users(tenant_id);

CREATE INDEX idx_tenant_users_user_id
    ON tenant_users(user_id);