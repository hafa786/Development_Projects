package com.darmisolutions.darmihire.scorecard;

import com.darmisolutions.darmihire.common.entity.*;
import com.darmisolutions.darmihire.tenant.Tenant;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "interview_scorecard_templates",
        indexes = {
                @Index(
                        name = "idx_scorecard_templates_tenant",
                        columnList = "tenant_id"
                ),
                @Index(
                        name = "idx_scorecard_templates_active",
                        columnList = "tenant_id, active"
                )
        }
)
@Getter
@Setter
public class InterviewScorecardTemplate
        extends BaseEntity {

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "tenant_id",
            nullable = false
    )
    private Tenant tenant;

    @Column(
            name = "name",
            nullable = false,
            length = 200
    )
    private String name;

    @Column(
            name = "description",
            columnDefinition = "TEXT"
    )
    private String description;

    @Column(
            name = "active",
            nullable = false
    )
    private boolean active = true;
}