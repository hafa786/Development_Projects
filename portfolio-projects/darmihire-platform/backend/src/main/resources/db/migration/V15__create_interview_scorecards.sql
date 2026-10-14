CREATE TABLE interview_scorecard_templates (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,

    name VARCHAR(200) NOT NULL,
    description TEXT,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_scorecard_template_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT uk_scorecard_template_name
        UNIQUE (tenant_id, name)
);

CREATE INDEX idx_scorecard_templates_tenant
    ON interview_scorecard_templates(tenant_id);

CREATE INDEX idx_scorecard_templates_active
    ON interview_scorecard_templates(
        tenant_id,
        active
    );


CREATE TABLE scorecard_criteria (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,
    template_id UUID NOT NULL,

    name VARCHAR(200) NOT NULL,
    description TEXT,

    sort_order INTEGER NOT NULL,

    required BOOLEAN NOT NULL DEFAULT TRUE,

    weight INTEGER NOT NULL DEFAULT 1,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_scorecard_criterion_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_scorecard_criterion_template
        FOREIGN KEY (template_id)
        REFERENCES interview_scorecard_templates(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_scorecard_criterion_name
        UNIQUE (
            template_id,
            name
        ),

    CONSTRAINT chk_scorecard_criterion_weight
        CHECK (
            weight >= 1
            AND weight <= 100
        ),

    CONSTRAINT chk_scorecard_criterion_sort_order
        CHECK (
            sort_order >= 0
        )
);

CREATE INDEX idx_scorecard_criteria_tenant
    ON scorecard_criteria(tenant_id);

CREATE INDEX idx_scorecard_criteria_template
    ON scorecard_criteria(template_id);

CREATE INDEX idx_scorecard_criteria_sort
    ON scorecard_criteria(
        template_id,
        sort_order
    );


CREATE TABLE interview_feedback (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,
    interview_id UUID NOT NULL,
    interviewer_id UUID NOT NULL,
    template_id UUID NOT NULL,

    recommendation VARCHAR(30),

    overall_comments TEXT,
    strengths TEXT,
    concerns TEXT,

    submitted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_interview_feedback_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_interview_feedback_interview
        FOREIGN KEY (interview_id)
        REFERENCES interviews(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_interview_feedback_interviewer
        FOREIGN KEY (interviewer_id)
        REFERENCES tenant_users(id),

    CONSTRAINT fk_interview_feedback_template
        FOREIGN KEY (template_id)
        REFERENCES interview_scorecard_templates(id),

    CONSTRAINT uk_interview_feedback_interviewer
        UNIQUE (
            interview_id,
            interviewer_id
        ),

    CONSTRAINT chk_interview_feedback_recommendation
        CHECK (
            recommendation IS NULL
            OR recommendation IN (
                'STRONG_NO',
                'NO',
                'NEUTRAL',
                'YES',
                'STRONG_YES'
            )
        )
);

CREATE INDEX idx_interview_feedback_tenant
    ON interview_feedback(tenant_id);

CREATE INDEX idx_interview_feedback_interview
    ON interview_feedback(interview_id);

CREATE INDEX idx_interview_feedback_interviewer
    ON interview_feedback(interviewer_id);


CREATE TABLE interview_feedback_ratings (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,
    feedback_id UUID NOT NULL,
    criterion_id UUID NOT NULL,

    rating INTEGER NOT NULL,
    comments TEXT,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_feedback_rating_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_feedback_rating_feedback
        FOREIGN KEY (feedback_id)
        REFERENCES interview_feedback(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_feedback_rating_criterion
        FOREIGN KEY (criterion_id)
        REFERENCES scorecard_criteria(id),

    CONSTRAINT uk_feedback_rating_criterion
        UNIQUE (
            feedback_id,
            criterion_id
        ),

    CONSTRAINT chk_feedback_rating
        CHECK (
            rating >= 1
            AND rating <= 5
        )
);

CREATE INDEX idx_feedback_ratings_tenant
    ON interview_feedback_ratings(tenant_id);

CREATE INDEX idx_feedback_ratings_feedback
    ON interview_feedback_ratings(feedback_id);

CREATE INDEX idx_feedback_ratings_criterion
    ON interview_feedback_ratings(criterion_id);