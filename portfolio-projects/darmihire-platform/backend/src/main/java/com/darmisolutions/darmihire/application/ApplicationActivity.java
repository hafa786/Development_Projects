package com.darmisolutions.darmihire.application;

import com.darmisolutions.darmihire.common.entity.BaseEntity;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantUser;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "application_activities",
    indexes = {
        @Index(
            name = "idx_application_activities_tenant",
            columnList = "tenant_id"
        ),
        @Index(
            name = "idx_application_activities_application",
            columnList = "tenant_id,application_id"
        ),
        @Index(
            name = "idx_application_activities_created",
            columnList = "tenant_id,application_id,created_at"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class ApplicationActivity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "tenant_id",
        nullable = false
    )
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "application_id",
        nullable = false
    )
    private JobApplication application;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "activity_type",
        nullable = false,
        length = 50
    )
    private ApplicationActivityType activityType;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "from_stage",
        length = 30
    )
    private ApplicationStage fromStage;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "to_stage",
        length = 30
    )
    private ApplicationStage toStage;

    @Column(
        name = "description",
        length = 1000
    )
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by_id")
    private TenantUser performedBy;
}