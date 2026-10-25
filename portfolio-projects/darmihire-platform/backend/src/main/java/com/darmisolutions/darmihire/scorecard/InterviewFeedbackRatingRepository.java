package com.darmisolutions.darmihire.scorecard;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewFeedbackRatingRepository
    extends JpaRepository<InterviewFeedbackRating, UUID> {

  List<InterviewFeedbackRating> findAllByTenantIdAndFeedbackIdOrderByCriterionSortOrderAsc(
      UUID tenantId, UUID feedbackId);

  Optional<InterviewFeedbackRating> findByTenantIdAndFeedbackIdAndCriterionId(
      UUID tenantId, UUID feedbackId, UUID criterionId);

  void deleteAllByTenantIdAndFeedbackId(UUID tenantId, UUID feedbackId);
}
