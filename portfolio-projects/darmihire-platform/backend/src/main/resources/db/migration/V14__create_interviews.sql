CREATE TABLE interview_interviewers (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,

    interview_id UUID NOT NULL,

    tenant_user_id UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_interview_interviewers_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_interview_interviewers_interview
        FOREIGN KEY (interview_id)
        REFERENCES interviews(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_interview_interviewers_user
        FOREIGN KEY (tenant_user_id)
        REFERENCES tenant_users(id),

    CONSTRAINT uk_interview_interviewer
        UNIQUE (
            interview_id,
            tenant_user_id
        )
);

CREATE INDEX idx_interview_interviewers_interview
    ON interview_interviewers(interview_id);

CREATE INDEX idx_interview_interviewers_user
    ON interview_interviewers(tenant_user_id);

CREATE INDEX idx_interview_interviewers_tenant
    ON interview_interviewers(tenant_id);