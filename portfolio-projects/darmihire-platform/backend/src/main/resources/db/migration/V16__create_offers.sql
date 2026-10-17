CREATE TABLE offers
(
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,

    application_id UUID NOT NULL,

    status VARCHAR(30) NOT NULL
        DEFAULT 'DRAFT',

    salary NUMERIC(15, 2) NOT NULL,

    currency VARCHAR(3) NOT NULL,

    salary_period VARCHAR(20) NOT NULL,

    employment_type VARCHAR(30) NOT NULL,

    start_date DATE,

    expiration_date DATE,

    probation_period VARCHAR(200),

    benefits TEXT,

    additional_terms TEXT,

    created_by_id UUID,

    approved_by_id UUID,

    submitted_for_approval_at TIMESTAMPTZ,

    approved_at TIMESTAMPTZ,

    rejected_at TIMESTAMPTZ,

    sent_at TIMESTAMPTZ,

    accepted_at TIMESTAMPTZ,

    declined_at TIMESTAMPTZ,

    withdrawn_at TIMESTAMPTZ,

    rejection_reason TEXT,

    decline_reason TEXT,

    withdrawal_reason TEXT,

    created_at TIMESTAMPTZ NOT NULL,

    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_offers_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_offers_application
        FOREIGN KEY (application_id)
        REFERENCES job_applications(id),

    CONSTRAINT fk_offers_created_by
        FOREIGN KEY (created_by_id)
        REFERENCES tenant_users(id),

    CONSTRAINT fk_offers_approved_by
        FOREIGN KEY (approved_by_id)
        REFERENCES tenant_users(id),

    CONSTRAINT chk_offers_salary
        CHECK (salary >= 0),

    CONSTRAINT chk_offers_currency
        CHECK (
            char_length(currency) = 3
        ),

    CONSTRAINT chk_offers_status
        CHECK (
            status IN (
                'DRAFT',
                'PENDING_APPROVAL',
                'APPROVED',
                'REJECTED',
                'SENT',
                'ACCEPTED',
                'DECLINED',
                'WITHDRAWN'
            )
        ),

    CONSTRAINT chk_offers_salary_period
        CHECK (
            salary_period IN (
                'HOURLY',
                'MONTHLY',
                'ANNUAL'
            )
        )
);