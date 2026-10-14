package com.darmisolutions.darmihire.scorecard;

import com.darmisolutions.darmihire.common.entity.*;
import com.darmisolutions.darmihire.tenant.Tenant;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "interview_feedback_ratings",
        indexes = {
                @Index(
                        name = "idx_feedback_ratings_tenant",
                        columnList = "tenant_id"
                ),
                @Index(
                        name = "idx_feedback_ratings_feedback",
                        columnList = "feedback_id"
                ),
                @Index(
                        name = "idx_feedback_ratings_criterion",
                        columnList = "criterion_id"
                )
        },
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_feedback_rating_criterion",
                        columnNames = {
                                "feedback_id",
                                "criterion_id"
                        }
                )
        }
)
@Getter
@Setter
public class InterviewFeedbackRating
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

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "feedback_id",
            nullable = false
    )
    private InterviewFeedback feedback;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "criterion_id",
            nullable = false
    )
    private ScorecardCriterion criterion;

    @Column(
            name = "rating",
            nullable = false
    )
    private int rating;

    @Column(
            name = "comments",
            columnDefinition = "TEXT"
    )
    private String comments;
}