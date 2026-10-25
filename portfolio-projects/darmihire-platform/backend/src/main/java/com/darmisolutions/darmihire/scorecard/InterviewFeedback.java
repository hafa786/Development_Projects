package com.darmisolutions.darmihire.scorecard;

import com.darmisolutions.darmihire.common.entity.*;
import com.darmisolutions.darmihire.interview.Interview;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantUser;
import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
    name = "interview_feedback",
    indexes = {
      @Index(name = "idx_interview_feedback_tenant", columnList = "tenant_id"),
      @Index(name = "idx_interview_feedback_interview", columnList = "interview_id"),
      @Index(name = "idx_interview_feedback_interviewer", columnList = "interviewer_id")
    },
    uniqueConstraints = {
      @UniqueConstraint(
          name = "uk_interview_feedback_interviewer",
          columnNames = {"interview_id", "interviewer_id"})
    })
@Getter
@Setter
public class InterviewFeedback extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "tenant_id", nullable = false)
  private Tenant tenant;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "interview_id", nullable = false)
  private Interview interview;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "interviewer_id", nullable = false)
  private TenantUser interviewer;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "template_id", nullable = false)
  private InterviewScorecardTemplate template;

  @Enumerated(EnumType.STRING)
  @Column(name = "recommendation", length = 30)
  private HiringRecommendation recommendation;

  @Column(name = "overall_comments", columnDefinition = "TEXT")
  private String overallComments;

  @Column(name = "strengths", columnDefinition = "TEXT")
  private String strengths;

  @Column(name = "concerns", columnDefinition = "TEXT")
  private String concerns;

  @Column(name = "submitted_at")
  private Instant submittedAt;
}
