package com.darmisolutions.darmihire.offer;

import com.darmisolutions.darmihire.application.JobApplication;
import com.darmisolutions.darmihire.common.entity.*;
import com.darmisolutions.darmihire.job.EmploymentType;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantUser;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(
        name = "offers",
        indexes = {
                @Index(
                        name = "idx_offers_tenant",
                        columnList = "tenant_id"
                ),
                @Index(
                        name = "idx_offers_application",
                        columnList = "application_id"
                ),
                @Index(
                        name = "idx_offers_tenant_status",
                        columnList = "tenant_id,status"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Offer extends BaseEntity {

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "tenant_id",
            nullable = false
    )
    private Tenant tenant;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "application_id",
            nullable = false
    )
    private JobApplication application;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false,
            length = 30
    )
    private OfferStatus status =
            OfferStatus.DRAFT;

    /*
     * Compensation
     */

    @Column(
            name = "salary",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal salary;

    @Column(
            name = "currency",
            nullable = false,
            length = 3
    )
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "salary_period",
            nullable = false,
            length = 20
    )
    private SalaryPeriod salaryPeriod;

    /*
     * Employment
     */

    @Enumerated(EnumType.STRING)
    @Column(
            name = "employment_type",
            nullable = false,
            length = 30
    )
    private EmploymentType employmentType;

    @Column(
            name = "start_date"
    )
    private LocalDate startDate;

    @Column(
            name = "expiration_date"
    )
    private LocalDate expirationDate;

    /*
     * Offer terms
     */

    @Column(
            name = "probation_period",
            length = 200
    )
    private String probationPeriod;

    @Column(
            name = "benefits",
            columnDefinition = "TEXT"
    )
    private String benefits;

    @Column(
            name = "additional_terms",
            columnDefinition = "TEXT"
    )
    private String additionalTerms;

    /*
     * Ownership / approval
     */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "created_by_id"
    )
    private TenantUser createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "approved_by_id"
    )
    private TenantUser approvedBy;

    /*
     * Lifecycle timestamps
     */

    @Column(
            name = "submitted_for_approval_at"
    )
    private Instant submittedForApprovalAt;

    @Column(
            name = "approved_at"
    )
    private Instant approvedAt;

    @Column(
            name = "rejected_at"
    )
    private Instant rejectedAt;

    @Column(
            name = "sent_at"
    )
    private Instant sentAt;

    @Column(
            name = "accepted_at"
    )
    private Instant acceptedAt;

    @Column(
            name = "declined_at"
    )
    private Instant declinedAt;

    @Column(
            name = "withdrawn_at"
    )
    private Instant withdrawnAt;

    /*
     * Lifecycle reasons
     */

    @Column(
            name = "rejection_reason",
            columnDefinition = "TEXT"
    )
    private String rejectionReason;

    @Column(
            name = "decline_reason",
            columnDefinition = "TEXT"
    )
    private String declineReason;

    @Column(
            name = "withdrawal_reason",
            columnDefinition = "TEXT"
    )
    private String withdrawalReason;
}