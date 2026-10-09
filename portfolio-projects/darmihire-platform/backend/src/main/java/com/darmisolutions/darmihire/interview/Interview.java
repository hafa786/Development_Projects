package com.darmisolutions.darmihire.interview;

import com.darmisolutions.darmihire.application.JobApplication;
import com.darmisolutions.darmihire.tenant.Tenant;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(
    name = "interviews",
    indexes = {
        @Index(
            name = "idx_interviews_tenant",
            columnList = "tenant_id"
        ),
        @Index(
            name = "idx_interviews_application",
            columnList = "application_id"
        ),
        @Index(
            name = "idx_interviews_start_time",
            columnList = "start_time"
        ),
        @Index(
            name = "idx_interviews_status",
            columnList = "status"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class Interview extends com.darmisolutions.darmihire.common.entity.BaseEntity {

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

    @Column(
        name = "title",
        nullable = false,
        length = 200
    )
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "interview_type",
        nullable = false,
        length = 50
    )
    private InterviewType interviewType;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "status",
        nullable = false,
        length = 30
    )
    private InterviewStatus status =
        InterviewStatus.SCHEDULED;

    @Column(
        name = "start_time",
        nullable = false
    )
    private Instant startTime;

    @Column(
        name = "end_time",
        nullable = false
    )
    private Instant endTime;

    @Column(
        name = "timezone",
        nullable = false,
        length = 100
    )
    private String timezone;

    @Column(
        name = "location",
        length = 500
    )
    private String location;

    @Column(
        name = "meeting_url",
        length = 1000
    )
    private String meetingUrl;

    @Column(
        name = "notes",
        columnDefinition = "TEXT"
    )
    private String notes;

    @Column(
        name = "cancellation_reason",
        columnDefinition = "TEXT"
    )
    private String cancellationReason;

    @Column(
        name = "cancelled_at"
    )
    private Instant cancelledAt;

    @Column(
        name = "completed_at"
    )
    private Instant completedAt;
}