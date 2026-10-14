package com.darmisolutions.darmihire.scorecard;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InterviewFeedbackRepository
        extends JpaRepository<InterviewFeedback, UUID> {

    List<InterviewFeedback> findAllByTenantIdAndInterviewIdOrderByCreatedAtAsc(
            UUID tenantId,
            UUID interviewId);

    Optional<InterviewFeedback> findByIdAndTenantId(
            UUID id,
            UUID tenantId);

    Optional<InterviewFeedback> findByTenantIdAndInterviewIdAndInterviewerId(
            UUID tenantId,
            UUID interviewId,
            UUID interviewerId);

    boolean existsByTenantIdAndInterviewIdAndInterviewerId(
            UUID tenantId,
            UUID interviewId,
            UUID interviewerId);

    boolean existsByTenantIdAndTemplateIdAndSubmittedAtIsNotNull(
            UUID tenantId,
            UUID templateId);

    boolean existsByTenantIdAndTemplateId(
            UUID tenantId,
            UUID templateId);
}