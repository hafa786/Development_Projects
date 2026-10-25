package com.darmisolutions.darmihire.scorecard;

import com.darmisolutions.darmihire.audit.AuditAction;
import com.darmisolutions.darmihire.audit.AuditService;
import com.darmisolutions.darmihire.exception.ConflictException;
import com.darmisolutions.darmihire.exception.ResourceNotFoundException;
import com.darmisolutions.darmihire.interview.Interview;
import com.darmisolutions.darmihire.interview.InterviewInterviewerRepository;
import com.darmisolutions.darmihire.interview.InterviewRepository;
import com.darmisolutions.darmihire.scorecard.dto.*;
import com.darmisolutions.darmihire.tenant.*;
import com.darmisolutions.darmihire.tenant.context.TenantContext;
import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InterviewFeedbackService {

  private final InterviewFeedbackRepository feedbackRepository;
  private final InterviewFeedbackRatingRepository ratingRepository;

  private final InterviewScorecardTemplateRepository templateRepository;
  private final ScorecardCriterionRepository criterionRepository;

  private final InterviewRepository interviewRepository;
  private final InterviewInterviewerRepository interviewerRepository;

  private final TenantUserRepository tenantUserRepository;
  private final TenantContext tenantContext;

  private final AuditService auditService;

  /*
   * ---------------------------------------------------------
   * READ ALL FEEDBACK FOR INTERVIEW
   * ---------------------------------------------------------
   */

  @Transactional(readOnly = true)
  public List<InterviewFeedbackResponse> findByInterview(UUID interviewId) {

    UUID tenantId = requireTenantId();

    requireInterview(interviewId, tenantId);

    return feedbackRepository
        .findAllByTenantIdAndInterviewIdOrderByCreatedAtAsc(tenantId, interviewId)
        .stream()
        .map(feedback -> toResponse(feedback, tenantId))
        .toList();
  }

  /*
   * ---------------------------------------------------------
   * READ ONE
   * ---------------------------------------------------------
   */

  @Transactional(readOnly = true)
  public InterviewFeedbackResponse findById(UUID feedbackId) {

    UUID tenantId = requireTenantId();

    InterviewFeedback feedback = requireFeedback(feedbackId, tenantId);

    return toResponse(feedback, tenantId);
  }

  /*
   * ---------------------------------------------------------
   * CURRENT INTERVIEWER'S FEEDBACK
   * ---------------------------------------------------------
   */

  @Transactional(readOnly = true)
  public InterviewFeedbackResponse findMine(UUID interviewId) {

    UUID tenantId = requireTenantId();

    TenantUser interviewer = requireCurrentTenantUser();

    InterviewFeedback feedback =
        feedbackRepository
            .findByTenantIdAndInterviewIdAndInterviewerId(
                tenantId, interviewId, interviewer.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Interview feedback not found"));

    return toResponse(feedback, tenantId);
  }

  /*
   * ---------------------------------------------------------
   * CREATE DRAFT
   * ---------------------------------------------------------
   */

  @Transactional
  public InterviewFeedbackResponse create(CreateInterviewFeedbackRequest request) {

    UUID tenantId = requireTenantId();

    TenantUser interviewer = requireCurrentTenantUser();

    Interview interview = requireInterview(request.interviewId(), tenantId);

    requireAssignedInterviewer(tenantId, interview.getId(), interviewer.getId());

    if (feedbackRepository.existsByTenantIdAndInterviewIdAndInterviewerId(
        tenantId, interview.getId(), interviewer.getId())) {
      throw new ConflictException("You already have feedback for this interview");
    }

    InterviewScorecardTemplate template =
        templateRepository
            .findByIdAndTenantId(request.templateId(), tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Scorecard template not found"));

    if (!template.isActive()) {
      throw new ConflictException("This scorecard template is inactive");
    }

    InterviewFeedback feedback = new InterviewFeedback();

    feedback.setTenant(interview.getTenant());

    feedback.setInterview(interview);

    feedback.setInterviewer(interviewer);

    feedback.setTemplate(template);

    applyFeedbackFields(
        feedback,
        request.recommendation(),
        request.overallComments(),
        request.strengths(),
        request.concerns());

    feedback.setSubmittedAt(null);

    InterviewFeedback saved = feedbackRepository.save(feedback);

    replaceRatings(saved, request.ratings(), tenantId);

    auditService.log(AuditAction.INTERVIEW_FEEDBACK_CREATED, "InterviewFeedback", saved.getId());

    return toResponse(saved, tenantId);
  }

  /*
   * ---------------------------------------------------------
   * UPDATE DRAFT
   * ---------------------------------------------------------
   */

  @Transactional
  public InterviewFeedbackResponse update(UUID feedbackId, UpdateInterviewFeedbackRequest request) {

    UUID tenantId = requireTenantId();

    TenantUser interviewer = requireCurrentTenantUser();

    InterviewFeedback feedback = requireFeedback(feedbackId, tenantId);

    requireOwner(feedback, interviewer);

    requireDraft(feedback);

    applyFeedbackFields(
        feedback,
        request.recommendation(),
        request.overallComments(),
        request.strengths(),
        request.concerns());

    InterviewFeedback saved = feedbackRepository.save(feedback);

    if (request.ratings() != null) {
      replaceRatings(saved, request.ratings(), tenantId);
    }

    auditService.log(AuditAction.INTERVIEW_FEEDBACK_UPDATED, "InterviewFeedback", saved.getId());

    return toResponse(saved, tenantId);
  }

  /*
   * ---------------------------------------------------------
   * SUBMIT
   * ---------------------------------------------------------
   */

  @Transactional
  public InterviewFeedbackResponse submit(UUID feedbackId) {

    UUID tenantId = requireTenantId();

    TenantUser interviewer = requireCurrentTenantUser();

    InterviewFeedback feedback = requireFeedback(feedbackId, tenantId);

    requireOwner(feedback, interviewer);

    requireDraft(feedback);

    validateForSubmission(feedback, tenantId);

    feedback.setSubmittedAt(Instant.now());

    InterviewFeedback saved = feedbackRepository.save(feedback);

    auditService.log(AuditAction.INTERVIEW_FEEDBACK_SUBMITTED, "InterviewFeedback", saved.getId());

    return toResponse(saved, tenantId);
  }

  /*
   * ---------------------------------------------------------
   * RATING MANAGEMENT
   * ---------------------------------------------------------
   */

  private void replaceRatings(
      InterviewFeedback feedback, List<InterviewFeedbackRatingRequest> requests, UUID tenantId) {

    if (requests == null) {
      return;
    }

    /*
     * Prevent duplicate criterion IDs in the request.
     */
    Set<UUID> criterionIds = new HashSet<>();

    for (InterviewFeedbackRatingRequest request : requests) {

      if (!criterionIds.add(request.criterionId())) {
        throw new ConflictException("The same scorecard criterion cannot be rated more than once");
      }
    }

    List<ScorecardCriterion> templateCriteria =
        criterionRepository.findAllByTenantIdAndTemplateIdOrderBySortOrderAsc(
            tenantId, feedback.getTemplate().getId());

    Map<UUID, ScorecardCriterion> criteriaById =
        templateCriteria.stream()
            .collect(Collectors.toMap(ScorecardCriterion::getId, Function.identity()));

    /*
     * Validate everything before deleting the old ratings.
     */
    for (InterviewFeedbackRatingRequest request : requests) {

      if (!criteriaById.containsKey(request.criterionId())) {
        throw new ConflictException(
            "A rating references a criterion that does not belong to this scorecard template");
      }
    }

    ratingRepository.deleteAllByTenantIdAndFeedbackId(tenantId, feedback.getId());

    for (InterviewFeedbackRatingRequest request : requests) {

      ScorecardCriterion criterion = criteriaById.get(request.criterionId());

      InterviewFeedbackRating rating = new InterviewFeedbackRating();

      rating.setTenant(feedback.getTenant());

      rating.setFeedback(feedback);

      rating.setCriterion(criterion);

      rating.setRating(request.rating());

      rating.setComments(trimToNull(request.comments()));

      ratingRepository.save(rating);
    }
  }

  /*
   * ---------------------------------------------------------
   * SUBMISSION VALIDATION
   * ---------------------------------------------------------
   */

  private void validateForSubmission(InterviewFeedback feedback, UUID tenantId) {

    if (feedback.getRecommendation() == null) {
      throw new ConflictException("A hiring recommendation is required before submitting feedback");
    }

    List<ScorecardCriterion> criteria =
        criterionRepository.findAllByTenantIdAndTemplateIdOrderBySortOrderAsc(
            tenantId, feedback.getTemplate().getId());

    List<InterviewFeedbackRating> ratings =
        ratingRepository.findAllByTenantIdAndFeedbackIdOrderByCriterionSortOrderAsc(
            tenantId, feedback.getId());

    Set<UUID> ratedCriterionIds =
        ratings.stream().map(rating -> rating.getCriterion().getId()).collect(Collectors.toSet());

    List<String> missing =
        criteria.stream()
            .filter(ScorecardCriterion::isRequired)
            .filter(criterion -> !ratedCriterionIds.contains(criterion.getId()))
            .map(ScorecardCriterion::getName)
            .toList();

    if (!missing.isEmpty()) {
      throw new ConflictException(
          "Required scorecard criteria are missing ratings: " + String.join(", ", missing));
    }
  }

  /*
   * ---------------------------------------------------------
   * RESPONSE
   * ---------------------------------------------------------
   */

  private InterviewFeedbackResponse toResponse(InterviewFeedback feedback, UUID tenantId) {

    List<InterviewFeedbackRatingResponse> ratings =
        ratingRepository
            .findAllByTenantIdAndFeedbackIdOrderByCriterionSortOrderAsc(tenantId, feedback.getId())
            .stream()
            .map(this::toRatingResponse)
            .toList();

    return new InterviewFeedbackResponse(
        feedback.getId(),
        feedback.getInterview().getId(),
        feedback.getInterview().getApplication().getId(),
        feedback.getInterviewer().getId(),
        resolveTenantUserName(feedback.getInterviewer()),
        feedback.getTemplate().getId(),
        feedback.getTemplate().getName(),
        feedback.getRecommendation(),
        feedback.getOverallComments(),
        feedback.getStrengths(),
        feedback.getConcerns(),
        feedback.getSubmittedAt() != null,
        feedback.getSubmittedAt(),
        ratings,
        feedback.getCreatedAt(),
        feedback.getUpdatedAt());
  }

  private InterviewFeedbackRatingResponse toRatingResponse(InterviewFeedbackRating rating) {

    ScorecardCriterion criterion = rating.getCriterion();

    return new InterviewFeedbackRatingResponse(
        rating.getId(),
        criterion.getId(),
        criterion.getName(),
        criterion.getDescription(),
        criterion.getSortOrder(),
        criterion.isRequired(),
        criterion.getWeight(),
        rating.getRating(),
        rating.getComments());
  }

  /*
   * ---------------------------------------------------------
   * SECURITY / OWNERSHIP
   * ---------------------------------------------------------
   */

  private TenantUser requireCurrentTenantUser() {

    UUID tenantId = tenantContext.getTenantId();
    UUID userId = tenantContext.getUserId();

    if (tenantId == null) {
      throw new IllegalStateException("Tenant context is required");
    }

    if (userId == null) {
      throw new IllegalStateException("Authenticated user context is required");
    }

    return tenantUserRepository
        .findByTenantIdAndUserId(tenantId, userId)
        .orElseThrow(() -> new ResourceNotFoundException("Current tenant user not found"));
  }

  private void requireAssignedInterviewer(UUID tenantId, UUID interviewId, UUID interviewerId) {

    boolean assigned =
        interviewerRepository.existsByTenantIdAndInterviewIdAndInterviewerId(
            tenantId, interviewId, interviewerId);

    if (!assigned) {
      throw new ConflictException(
          "Only an assigned interviewer can create feedback for this interview");
    }
  }

  private void requireOwner(InterviewFeedback feedback, TenantUser interviewer) {

    if (!feedback.getInterviewer().getId().equals(interviewer.getId())) {
      throw new ConflictException("You can only modify your own interview feedback");
    }
  }

  private void requireDraft(InterviewFeedback feedback) {

    if (feedback.getSubmittedAt() != null) {
      throw new ConflictException("Submitted interview feedback can no longer be modified");
    }
  }

  /*
   * ---------------------------------------------------------
   * LOOKUPS
   * ---------------------------------------------------------
   */

  private Interview requireInterview(UUID interviewId, UUID tenantId) {

    return interviewRepository
        .findByIdAndTenantId(interviewId, tenantId)
        .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
  }

  private InterviewFeedback requireFeedback(UUID feedbackId, UUID tenantId) {

    return feedbackRepository
        .findByIdAndTenantId(feedbackId, tenantId)
        .orElseThrow(() -> new ResourceNotFoundException("Interview feedback not found"));
  }

  /*
   * ---------------------------------------------------------
   * FIELD HELPERS
   * ---------------------------------------------------------
   */

  private void applyFeedbackFields(
      InterviewFeedback feedback,
      HiringRecommendation recommendation,
      String overallComments,
      String strengths,
      String concerns) {

    feedback.setRecommendation(recommendation);

    feedback.setOverallComments(trimToNull(overallComments));

    feedback.setStrengths(trimToNull(strengths));

    feedback.setConcerns(trimToNull(concerns));
  }

  /*
   * IMPORTANT:
   *
   * Adapt this helper to the actual TenantUser model already
   * present in DarmiHire.
   *
   * If TenantUser wraps User, use something like:
   *
   * tenantUser.getUser().getFirstName()
   * tenantUser.getUser().getLastName()
   */
  private String resolveTenantUserName(TenantUser tenantUser) {

    return tenantUser.getUser().getFirstName() + " " + tenantUser.getUser().getLastName();
  }

  private UUID requireTenantId() {

    UUID tenantId = tenantContext.getTenantId();

    if (tenantId == null) {
      throw new IllegalStateException("Tenant context is required");
    }

    return tenantId;
  }

  private String trimToNull(String value) {

    if (value == null) {
      return null;
    }

    String trimmed = value.trim();

    return trimmed.isEmpty() ? null : trimmed;
  }

  @Transactional(readOnly = true)
  public Optional<InterviewFeedbackResponse> getMyFeedback(UUID interviewId) {
    UUID tenantId = requireTenantId();

    UUID userId = tenantContext.getUserId();

    if (userId == null) {
      throw new IllegalStateException("Authenticated user context is required");
    }

    TenantUser currentTenantUser =
        tenantUserRepository
            .findByTenantIdAndUserId(tenantId, userId)
            .orElseThrow(
                () -> new IllegalStateException("Current user is not a member of this tenant"));

    return feedbackRepository
        .findByTenantIdAndInterviewIdAndInterviewerId(
            tenantId, interviewId, currentTenantUser.getId())
        .map(feedback -> toResponse(feedback, tenantId));
  }
}
