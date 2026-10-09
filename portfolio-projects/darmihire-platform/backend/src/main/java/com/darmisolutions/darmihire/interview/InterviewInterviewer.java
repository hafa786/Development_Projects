package com.darmisolutions.darmihire.interview;

import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantUser;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "interview_interviewers",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_interview_interviewer",
            columnNames = {
                "interview_id",
                "tenant_user_id"
            }
        )
    },
    indexes = {
        @Index(
            name = "idx_interview_interviewers_interview",
            columnList = "interview_id"
        ),
        @Index(
            name = "idx_interview_interviewers_user",
            columnList = "tenant_user_id"
        ),
        @Index(
            name = "idx_interview_interviewers_tenant",
            columnList = "tenant_id"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class InterviewInterviewer
    extends com.darmisolutions.darmihire.common.entity.BaseEntity {

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
        name = "interview_id",
        nullable = false
    )
    private Interview interview;

    @ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
    )
    @JoinColumn(
        name = "tenant_user_id",
        nullable = false
    )
    private TenantUser interviewer;
}