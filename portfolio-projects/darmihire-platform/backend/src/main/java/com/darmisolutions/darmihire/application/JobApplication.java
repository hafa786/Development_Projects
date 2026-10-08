package com.darmisolutions.darmihire.application;

import com.darmisolutions.darmihire.candidate.Candidate;
import com.darmisolutions.darmihire.job.Job;
import com.darmisolutions.darmihire.tenant.Tenant;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(
    name = "job_applications",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_job_applications_tenant_job_candidate",
            columnNames = {
                "tenant_id",
                "job_id",
                "candidate_id"
            }
        )
    },
    indexes = {
        @Index(
            name = "idx_job_applications_tenant",
            columnList = "tenant_id"
        ),
        @Index(
            name = "idx_job_applications_job",
            columnList = "tenant_id,job_id"
        ),
        @Index(
            name = "idx_job_applications_candidate",
            columnList = "tenant_id,candidate_id"
        ),
        @Index(
            name = "idx_job_applications_stage",
            columnList = "tenant_id,job_id,stage"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class JobApplication extends com.darmisolutions.darmihire.common.entity.BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStage stage = ApplicationStage.APPLIED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStatus status = ApplicationStatus.ACTIVE;

    @Column(name = "applied_at", nullable = false)
    private Instant appliedAt;

    @Column(name = "rejected_at")
    private Instant rejectedAt;

    @Column(name = "rejection_reason", length = 1000)
    private String rejectionReason;

    @Column(name = "withdrawn_at")
    private Instant withdrawnAt;

    @Column(name = "hired_at")
    private Instant hiredAt;
}