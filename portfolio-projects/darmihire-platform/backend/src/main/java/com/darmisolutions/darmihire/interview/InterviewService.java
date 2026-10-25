package com.darmisolutions.darmihire.interview;

import com.darmisolutions.darmihire.application.ApplicationActivityService;
import com.darmisolutions.darmihire.application.JobApplication;
import com.darmisolutions.darmihire.application.JobApplicationRepository;
import com.darmisolutions.darmihire.audit.AuditAction;
import com.darmisolutions.darmihire.audit.AuditService;
import com.darmisolutions.darmihire.exception.ConflictException;
import com.darmisolutions.darmihire.exception.ResourceNotFoundException;
import com.darmisolutions.darmihire.interview.dto.*;
import com.darmisolutions.darmihire.security.AuthorizationService;
import com.darmisolutions.darmihire.security.Permission;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantRepository;
import com.darmisolutions.darmihire.tenant.TenantUser;
import com.darmisolutions.darmihire.tenant.TenantUserRepository;
import com.darmisolutions.darmihire.tenant.context.*;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InterviewService {

  private final InterviewRepository interviewRepository;

  private final InterviewInterviewerRepository interviewInterviewerRepository;

  private final JobApplicationRepository jobApplicationRepository;

  private final TenantRepository tenantRepository;

  private final TenantUserRepository tenantUserRepository;

  private final TenantContext tenantContext;

  private final AuthorizationService authorizationService;

  private final AuditService auditService;

  private final ApplicationActivityService applicationActivityService;

  /*
   * ---------------------------------------------------------
   * READ
   * ---------------------------------------------------------
   */

  @Transactional(readOnly = true)
  public List<InterviewResponse> findAll() {
    authorizationService.require(Permission.MANAGE_INTERVIEWS);

    UUID tenantId = requireTenantId();

    return interviewRepository.findAllByTenantIdOrderByStartTimeDesc(tenantId).stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public InterviewResponse findById(UUID interviewId) {
    authorizationService.require(Permission.MANAGE_INTERVIEWS);

    return toResponse(requireInterview(interviewId));
  }

  @Transactional(readOnly = true)
  public List<InterviewResponse> findByApplication(UUID applicationId) {
    authorizationService.require(Permission.MANAGE_INTERVIEWS);

    UUID tenantId = requireTenantId();

    return interviewRepository
        .findAllByTenantIdAndApplicationIdOrderByStartTimeAsc(tenantId, applicationId)
        .stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<InterviewResponse> findUpcoming(Instant from, Instant to) {
    authorizationService.require(Permission.MANAGE_INTERVIEWS);

    UUID tenantId = requireTenantId();

    Instant effectiveFrom = from != null ? from : Instant.now();

    Instant effectiveTo = to != null ? to : effectiveFrom.plusSeconds(30L * 24 * 60 * 60);

    if (!effectiveTo.isAfter(effectiveFrom)) {
      throw new IllegalArgumentException("End date must be after start date");
    }

    return interviewRepository
        .findAllByTenantIdAndStartTimeBetweenOrderByStartTimeAsc(
            tenantId, effectiveFrom, effectiveTo)
        .stream()
        .map(this::toResponse)
        .toList();
  }

  /*
   * ---------------------------------------------------------
   * CREATE
   * ---------------------------------------------------------
   */

  @Transactional
  public InterviewResponse create(CreateInterviewRequest request) {
    authorizationService.require(Permission.MANAGE_INTERVIEWS);

    UUID tenantId = requireTenantId();

    validateSchedule(request.startTime(), request.endTime(), request.timezone());

    Tenant tenant =
        tenantRepository
            .findById(tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));

    JobApplication application =
        jobApplicationRepository
            .findByIdAndTenantId(request.applicationId(), tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

    Interview interview = new Interview();

    interview.setTenant(tenant);
    interview.setApplication(application);

    interview.setTitle(request.title().trim());

    interview.setInterviewType(request.interviewType());

    interview.setStatus(InterviewStatus.SCHEDULED);

    interview.setStartTime(request.startTime());

    interview.setEndTime(request.endTime());

    interview.setTimezone(request.timezone().trim());

    interview.setLocation(trimToNull(request.location()));

    interview.setMeetingUrl(trimToNull(request.meetingUrl()));

    interview.setNotes(trimToNull(request.notes()));

    Interview saved = interviewRepository.save(interview);

    /*
     * Recruiter-visible timeline event.
     */
    applicationActivityService.recordInterviewScheduled(application, saved.getTitle(), null);

    /*
     * Optional interviewer assignments supplied
     * when the interview is first created.
     */
    if (request.interviewerIds() != null) {
      for (UUID interviewerId : request.interviewerIds()) {
        addInterviewerInternal(saved, interviewerId, false);
      }
    }

    auditService.log(AuditAction.INTERVIEW_CREATED, "Interview", saved.getId());

    return toResponse(saved);
  }

  /*
   * ---------------------------------------------------------
   * UPDATE METADATA
   * ---------------------------------------------------------
   */

  @Transactional
  public InterviewResponse update(UUID interviewId, UpdateInterviewRequest request) {
    authorizationService.require(Permission.MANAGE_INTERVIEWS);

    Interview interview = requireInterview(interviewId);

    requireEditable(interview);

    interview.setTitle(request.title().trim());

    interview.setInterviewType(request.interviewType());

    interview.setTimezone(request.timezone().trim());

    validateTimezone(request.timezone());

    interview.setLocation(trimToNull(request.location()));

    interview.setMeetingUrl(trimToNull(request.meetingUrl()));

    interview.setNotes(trimToNull(request.notes()));

    Interview saved = interviewRepository.save(interview);

    auditService.log(AuditAction.INTERVIEW_UPDATED, "Interview", saved.getId());

    return toResponse(saved);
  }

  /*
   * ---------------------------------------------------------
   * RESCHEDULE
   * ---------------------------------------------------------
   */

  @Transactional
  public InterviewResponse reschedule(UUID interviewId, RescheduleInterviewRequest request) {
    authorizationService.require(Permission.MANAGE_INTERVIEWS);

    Interview interview = requireInterview(interviewId);

    requireEditable(interview);

    validateSchedule(request.startTime(), request.endTime(), request.timezone());

    interview.setStartTime(request.startTime());

    interview.setEndTime(request.endTime());

    interview.setTimezone(request.timezone().trim());

    Interview saved = interviewRepository.save(interview);

    applicationActivityService.recordInterviewRescheduled(
        saved.getApplication(), saved.getTitle(), null);

    auditService.log(AuditAction.INTERVIEW_RESCHEDULED, "Interview", saved.getId());

    return toResponse(saved);
  }

  /*
   * ---------------------------------------------------------
   * CANCEL
   * ---------------------------------------------------------
   */

  @Transactional
  public InterviewResponse cancel(UUID interviewId, CancelInterviewRequest request) {
    authorizationService.require(Permission.MANAGE_INTERVIEWS);

    Interview interview = requireInterview(interviewId);

    if (interview.getStatus() == InterviewStatus.COMPLETED) {
      throw new ConflictException("Completed interview cannot be cancelled");
    }

    if (interview.getStatus() == InterviewStatus.CANCELLED) {
      throw new ConflictException("Interview is already cancelled");
    }

    interview.setStatus(InterviewStatus.CANCELLED);

    interview.setCancellationReason(trimToNull(request.reason()));

    interview.setCancelledAt(Instant.now());

    Interview saved = interviewRepository.save(interview);

    applicationActivityService.recordInterviewCancelled(
        saved.getApplication(), saved.getTitle(), null);

    auditService.log(AuditAction.INTERVIEW_CANCELLED, "Interview", saved.getId());

    return toResponse(saved);
  }

  /*
   * ---------------------------------------------------------
   * COMPLETE
   * ---------------------------------------------------------
   */

  @Transactional
  public InterviewResponse complete(UUID interviewId) {
    authorizationService.require(Permission.MANAGE_INTERVIEWS);

    Interview interview = requireInterview(interviewId);

    if (interview.getStatus() == InterviewStatus.CANCELLED) {
      throw new ConflictException("Cancelled interview cannot be completed");
    }

    if (interview.getStatus() == InterviewStatus.COMPLETED) {
      throw new ConflictException("Interview is already completed");
    }

    interview.setStatus(InterviewStatus.COMPLETED);

    interview.setCompletedAt(Instant.now());

    Interview saved = interviewRepository.save(interview);

    applicationActivityService.recordInterviewCompleted(
        saved.getApplication(), saved.getTitle(), null);

    auditService.log(AuditAction.INTERVIEW_COMPLETED, "Interview", saved.getId());

    return toResponse(saved);
  }

  /*
   * ---------------------------------------------------------
   * ADD INTERVIEWER
   * ---------------------------------------------------------
   */

  @Transactional
  public InterviewResponse addInterviewer(UUID interviewId, AddInterviewerRequest request) {
    authorizationService.require(Permission.MANAGE_INTERVIEWS);

    Interview interview = requireInterview(interviewId);

    requireEditable(interview);

    addInterviewerInternal(interview, request.interviewerId(), true);

    return toResponse(interview);
  }

  private void addInterviewerInternal(Interview interview, UUID interviewerId, boolean audit) {
    UUID tenantId = requireTenantId();

    if (interviewInterviewerRepository.existsByTenantIdAndInterviewIdAndInterviewerId(
        tenantId, interview.getId(), interviewerId)) {
      throw new ConflictException("Interviewer is already assigned");
    }

    TenantUser interviewer =
        tenantUserRepository
            .findByIdAndTenantId(interviewerId, tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Workspace member not found"));

    InterviewInterviewer assignment = new InterviewInterviewer();

    assignment.setTenant(interview.getTenant());

    assignment.setInterview(interview);

    assignment.setInterviewer(interviewer);

    interviewInterviewerRepository.save(assignment);

    applicationActivityService.recordInterviewerAdded(
        interview.getApplication(),
        interview.getTitle(),
        getInterviewerDisplayName(interviewer),
        null);

    if (audit) {
      auditService.log(AuditAction.INTERVIEW_INTERVIEWER_ADDED, "Interview", interview.getId());
    }
  }

  /*
   * ---------------------------------------------------------
   * REMOVE INTERVIEWER
   * ---------------------------------------------------------
   */

  @Transactional
  public InterviewResponse removeInterviewer(UUID interviewId, UUID interviewerId) {
    authorizationService.require(Permission.MANAGE_INTERVIEWS);

    UUID tenantId = requireTenantId();

    Interview interview = requireInterview(interviewId);

    requireEditable(interview);

    InterviewInterviewer assignment =
        interviewInterviewerRepository
            .findByTenantIdAndInterviewIdAndInterviewerId(tenantId, interviewId, interviewerId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview interviewer not found"));

    String interviewerName = getInterviewerDisplayName(assignment.getInterviewer());

    interviewInterviewerRepository.delete(assignment);

    applicationActivityService.recordInterviewerRemoved(
        interview.getApplication(), interview.getTitle(), interviewerName, null);

    auditService.log(AuditAction.INTERVIEW_INTERVIEWER_REMOVED, "Interview", interview.getId());

    return toResponse(interview);
  }

  /*
   * ---------------------------------------------------------
   * VALIDATION
   * ---------------------------------------------------------
   */

  private void validateSchedule(Instant startTime, Instant endTime, String timezone) {
    if (startTime == null || endTime == null) {
      throw new IllegalArgumentException("Interview start and end time are required");
    }

    if (!endTime.isAfter(startTime)) {
      throw new IllegalArgumentException("Interview end time must be after start time");
    }

    validateTimezone(timezone);
  }

  private void validateTimezone(String timezone) {
    if (timezone == null || timezone.isBlank()) {
      throw new IllegalArgumentException("Timezone is required");
    }

    try {
      ZoneId.of(timezone.trim());
    } catch (Exception exception) {
      throw new IllegalArgumentException("Invalid timezone: " + timezone);
    }
  }

  private void requireEditable(Interview interview) {
    if (interview.getStatus() == InterviewStatus.COMPLETED) {
      throw new ConflictException("Completed interview cannot be modified");
    }

    if (interview.getStatus() == InterviewStatus.CANCELLED) {
      throw new ConflictException("Cancelled interview cannot be modified");
    }
  }

  private Interview requireInterview(UUID interviewId) {
    UUID tenantId = requireTenantId();

    return interviewRepository
        .findByIdAndTenantId(interviewId, tenantId)
        .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
  }

  /*
   * ---------------------------------------------------------
   * RESPONSE
   * ---------------------------------------------------------
   */

  private InterviewResponse toResponse(Interview interview) {
    List<InterviewInterviewerResponse> interviewers =
        interviewInterviewerRepository
            .findAllByTenantIdAndInterviewIdOrderByCreatedAtAsc(
                requireTenantId(), interview.getId())
            .stream()
            .map(this::toInterviewerResponse)
            .toList();

    JobApplication application = interview.getApplication();

    return new InterviewResponse(
        interview.getId(),
        application.getId(),
        application.getJob().getId(),
        application.getJob().getTitle(),
        application.getCandidate().getId(),
        application.getCandidate().getFirstName(),
        application.getCandidate().getEmail(),
        interview.getTitle(),
        interview.getInterviewType(),
        interview.getStatus(),
        interview.getStartTime(),
        interview.getEndTime(),
        interview.getTimezone(),
        interview.getLocation(),
        interview.getMeetingUrl(),
        interview.getNotes(),
        interview.getCancellationReason(),
        interview.getCancelledAt(),
        interview.getCompletedAt(),
        interviewers,
        interview.getCreatedAt(),
        interview.getUpdatedAt());
  }

  private InterviewInterviewerResponse toInterviewerResponse(InterviewInterviewer assignment) {
    TenantUser interviewer = assignment.getInterviewer();

    return new InterviewInterviewerResponse(
        assignment.getId(),
        interviewer.getId(),
        getInterviewerDisplayName(interviewer),
        getInterviewerEmail(interviewer));
  }

  /*
   * Adapt these two methods to your actual
   * TenantUser/User model if necessary.
   */
  private String getInterviewerDisplayName(TenantUser interviewer) {
    String name = interviewer.getName();

    if (name == null || name.isBlank()) {
      return "Interviewer";
    }

    return name.trim();
  }

  private String getInterviewerEmail(TenantUser interviewer) {
    return interviewer.getEmail();
  }

  private String trimToNull(String value) {
    if (value == null) {
      return null;
    }

    String trimmed = value.trim();

    return trimmed.isEmpty() ? null : trimmed;
  }

  private UUID requireTenantId() {
    UUID tenantId = tenantContext.getTenantId();

    if (tenantId == null) {
      throw new IllegalStateException("Tenant context is required");
    }

    return tenantId;
  }
}
