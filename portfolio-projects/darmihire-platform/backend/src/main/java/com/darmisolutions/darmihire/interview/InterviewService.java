package com.darmisolutions.darmihire.interview;

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
import com.darmisolutions.darmihire.tenant.TenantUser;
import com.darmisolutions.darmihire.tenant.TenantUserRepository;
import com.darmisolutions.darmihire.tenant.context.TenantContext;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.zone.ZoneRulesException;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;

    private final InterviewInterviewerRepository
        interviewInterviewerRepository;

    private final JobApplicationRepository
        jobApplicationRepository;

    private final TenantUserRepository
        tenantUserRepository;

    private final TenantContext tenantContext;

    private final AuthorizationService
        authorizationService;

    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<InterviewResponse> findAll() {

        UUID tenantId =
            requireTenantId();

        authorizationService.require(
            Permission.MANAGE_INTERVIEWS
        );

        return interviewRepository
            .findAllByTenantIdOrderByStartTimeDesc(
                tenantId
            )
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public InterviewResponse findById(
        UUID interviewId
    ) {

        UUID tenantId =
            requireTenantId();

        authorizationService.require(
            Permission.MANAGE_INTERVIEWS
        );

        return toResponse(
            requireInterview(
                interviewId,
                tenantId
            )
        );
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse>
        findByApplication(
            UUID applicationId
        ) {

        UUID tenantId =
            requireTenantId();

        authorizationService.require(
            Permission.MANAGE_INTERVIEWS
        );

        requireApplication(
            applicationId,
            tenantId
        );

        return interviewRepository
            .findAllByTenantIdAndApplicationIdOrderByStartTimeAsc(
                tenantId,
                applicationId
            )
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse>
        findUpcoming(
            Instant from,
            Instant to
        ) {

        UUID tenantId =
            requireTenantId();

        authorizationService.require(
            Permission.MANAGE_INTERVIEWS
        );

        if (from == null) {
            from = Instant.now();
        }

        if (to == null) {
            to = from.plusSeconds(
                60L * 60 * 24 * 30
            );
        }

        if (!to.isAfter(from)) {
            throw new IllegalArgumentException(
                "End of range must be after start of range"
            );
        }

        return interviewRepository
            .findAllByTenantIdAndStartTimeBetweenOrderByStartTimeAsc(
                tenantId,
                from,
                to
            )
            .stream()
            .filter(
                interview ->
                    interview.getStatus()
                        != InterviewStatus.CANCELLED
            )
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public InterviewResponse create(
        CreateInterviewRequest request
    ) {

        UUID tenantId =
            requireTenantId();

        authorizationService.require(
            Permission.MANAGE_INTERVIEWS
        );

        validateSchedule(
            request.startTime(),
            request.endTime(),
            request.timezone()
        );

        JobApplication application =
            requireApplication(
                request.applicationId(),
                tenantId
            );

        Interview interview =
            new Interview();

        interview.setTenant(
            application.getTenant()
        );

        interview.setApplication(
            application
        );

        interview.setTitle(
            request.title().trim()
        );

        interview.setInterviewType(
            request.interviewType()
        );

        interview.setStatus(
            InterviewStatus.SCHEDULED
        );

        interview.setStartTime(
            request.startTime()
        );

        interview.setEndTime(
            request.endTime()
        );

        interview.setTimezone(
            request.timezone().trim()
        );

        interview.setLocation(
            trimToNull(
                request.location()
            )
        );

        interview.setMeetingUrl(
            trimToNull(
                request.meetingUrl()
            )
        );

        interview.setNotes(
            trimToNull(
                request.notes()
            )
        );

        Interview saved =
            interviewRepository.save(
                interview
            );

        if (
            request.interviewerIds()
                != null
        ) {
            LinkedHashSet<UUID>
                uniqueInterviewerIds =
                    new LinkedHashSet<>(
                        request.interviewerIds()
                    );

            for (
                UUID interviewerId :
                    uniqueInterviewerIds
            ) {
                addInterviewerInternal(
                    saved,
                    interviewerId,
                    tenantId
                );
            }
        }

        auditService.log(
            AuditAction.INTERVIEW_CREATED,
            "Interview",
            saved.getId()
        );

        return toResponse(saved);
    }

    @Transactional
    public InterviewResponse update(
        UUID interviewId,
        UpdateInterviewRequest request
    ) {

        UUID tenantId =
            requireTenantId();

        authorizationService.require(
            Permission.MANAGE_INTERVIEWS
        );

        Interview interview =
            requireInterview(
                interviewId,
                tenantId
            );

        requireEditable(interview);

        validateTimezone(
            request.timezone()
        );

        interview.setTitle(
            request.title().trim()
        );

        interview.setInterviewType(
            request.interviewType()
        );

        interview.setTimezone(
            request.timezone().trim()
        );

        interview.setLocation(
            trimToNull(
                request.location()
            )
        );

        interview.setMeetingUrl(
            trimToNull(
                request.meetingUrl()
            )
        );

        interview.setNotes(
            trimToNull(
                request.notes()
            )
        );

        Interview saved =
            interviewRepository.save(
                interview
            );

        auditService.log(
            AuditAction.INTERVIEW_UPDATED,
            "Interview",
            saved.getId()
        );

        return toResponse(saved);
    }

    @Transactional
    public InterviewResponse reschedule(
        UUID interviewId,
        RescheduleInterviewRequest request
    ) {

        UUID tenantId =
            requireTenantId();

        authorizationService.require(
            Permission.MANAGE_INTERVIEWS
        );

        Interview interview =
            requireInterview(
                interviewId,
                tenantId
            );

        requireEditable(interview);

        validateSchedule(
            request.startTime(),
            request.endTime(),
            request.timezone()
        );

        interview.setStartTime(
            request.startTime()
        );

        interview.setEndTime(
            request.endTime()
        );

        interview.setTimezone(
            request.timezone().trim()
        );

        Interview saved =
            interviewRepository.save(
                interview
            );

        auditService.log(
            AuditAction.INTERVIEW_RESCHEDULED,
            "Interview",
            saved.getId()
        );

        return toResponse(saved);
    }

    @Transactional
    public InterviewResponse cancel(
        UUID interviewId,
        CancelInterviewRequest request
    ) {

        UUID tenantId =
            requireTenantId();

        authorizationService.require(
            Permission.MANAGE_INTERVIEWS
        );

        Interview interview =
            requireInterview(
                interviewId,
                tenantId
            );

        if (
            interview.getStatus()
                == InterviewStatus.CANCELLED
        ) {
            throw new ConflictException(
                "Interview is already cancelled"
            );
        }

        if (
            interview.getStatus()
                == InterviewStatus.COMPLETED
        ) {
            throw new ConflictException(
                "Completed interview cannot be cancelled"
            );
        }

        interview.setStatus(
            InterviewStatus.CANCELLED
        );

        interview.setCancellationReason(
            trimToNull(
                request.reason()
            )
        );

        interview.setCancelledAt(
            Instant.now()
        );

        Interview saved =
            interviewRepository.save(
                interview
            );

        auditService.log(
            AuditAction.INTERVIEW_CANCELLED,
            "Interview",
            saved.getId()
        );

        return toResponse(saved);
    }

    @Transactional
    public InterviewResponse complete(
        UUID interviewId
    ) {

        UUID tenantId =
            requireTenantId();

        authorizationService.require(
            Permission.MANAGE_INTERVIEWS
        );

        Interview interview =
            requireInterview(
                interviewId,
                tenantId
            );

        if (
            interview.getStatus()
                == InterviewStatus.CANCELLED
        ) {
            throw new ConflictException(
                "Cancelled interview cannot be completed"
            );
        }

        if (
            interview.getStatus()
                == InterviewStatus.COMPLETED
        ) {
            throw new ConflictException(
                "Interview is already completed"
            );
        }

        interview.setStatus(
            InterviewStatus.COMPLETED
        );

        interview.setCompletedAt(
            Instant.now()
        );

        Interview saved =
            interviewRepository.save(
                interview
            );

        auditService.log(
            AuditAction.INTERVIEW_COMPLETED,
            "Interview",
            saved.getId()
        );

        return toResponse(saved);
    }

    @Transactional
    public InterviewResponse addInterviewer(
        UUID interviewId,
        AddInterviewerRequest request
    ) {

        UUID tenantId =
            requireTenantId();

        authorizationService.require(
            Permission.MANAGE_INTERVIEWS
        );

        Interview interview =
            requireInterview(
                interviewId,
                tenantId
            );

        requireEditable(interview);

        addInterviewerInternal(
            interview,
            request.interviewerId(),
            tenantId
        );

        auditService.log(
            AuditAction.INTERVIEW_INTERVIEWER_ADDED,
            "Interview",
            interview.getId()
        );

        return toResponse(interview);
    }

    @Transactional
    public InterviewResponse removeInterviewer(
        UUID interviewId,
        UUID interviewerId
    ) {

        UUID tenantId =
            requireTenantId();

        authorizationService.require(
            Permission.MANAGE_INTERVIEWS
        );

        Interview interview =
            requireInterview(
                interviewId,
                tenantId
            );

        requireEditable(interview);

        InterviewInterviewer assignment =
            interviewInterviewerRepository
                .findByTenantIdAndInterviewIdAndInterviewerId(
                    tenantId,
                    interviewId,
                    interviewerId
                )
                .orElseThrow(
                    () ->
                        new ResourceNotFoundException(
                            "Interview interviewer not found"
                        )
                );

        interviewInterviewerRepository
            .delete(assignment);

        auditService.log(
            AuditAction.INTERVIEW_INTERVIEWER_REMOVED,
            "Interview",
            interview.getId()
        );

        return toResponse(interview);
    }

    private void addInterviewerInternal(
        Interview interview,
        UUID interviewerId,
        UUID tenantId
    ) {

        boolean exists =
            interviewInterviewerRepository
                .existsByTenantIdAndInterviewIdAndInterviewerId(
                    tenantId,
                    interview.getId(),
                    interviewerId
                );

        if (exists) {
            throw new ConflictException(
                "Interviewer is already assigned to this interview"
            );
        }

        TenantUser interviewer =
            tenantUserRepository
                .findByIdAndTenantId(
                    interviewerId,
                    tenantId
                )
                .orElseThrow(
                    () ->
                        new ResourceNotFoundException(
                            "Interviewer not found"
                        )
                );

        InterviewInterviewer assignment =
            new InterviewInterviewer();

        assignment.setTenant(
            interview.getTenant()
        );

        assignment.setInterview(
            interview
        );

        assignment.setInterviewer(
            interviewer
        );

        interviewInterviewerRepository
            .save(assignment);
    }

    private Interview requireInterview(
        UUID interviewId,
        UUID tenantId
    ) {

        return interviewRepository
            .findByIdAndTenantId(
                interviewId,
                tenantId
            )
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Interview not found"
                    )
            );
    }

    private JobApplication
        requireApplication(
            UUID applicationId,
            UUID tenantId
        ) {

        return jobApplicationRepository
            .findByIdAndTenantId(
                applicationId,
                tenantId
            )
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Job application not found"
                    )
            );
    }

    private void requireEditable(
        Interview interview
    ) {

        if (
            interview.getStatus()
                == InterviewStatus.CANCELLED
        ) {
            throw new ConflictException(
                "Cancelled interview cannot be modified"
            );
        }

        if (
            interview.getStatus()
                == InterviewStatus.COMPLETED
        ) {
            throw new ConflictException(
                "Completed interview cannot be modified"
            );
        }
    }

    private void validateSchedule(
        Instant startTime,
        Instant endTime,
        String timezone
    ) {

        if (
            !endTime.isAfter(
                startTime
            )
        ) {
            throw new IllegalArgumentException(
                "Interview end time must be after start time"
            );
        }

        validateTimezone(timezone);
    }

    private void validateTimezone(
        String timezone
    ) {

        if (
            timezone == null ||
            timezone.isBlank()
        ) {
            throw new IllegalArgumentException(
                "Timezone is required"
            );
        }

        try {
            ZoneId.of(
                timezone.trim()
            );
        }
        catch (
            ZoneRulesException exception
        ) {
            throw new IllegalArgumentException(
                "Invalid timezone: "
                    + timezone
            );
        }
    }

    private String trimToNull(
        String value
    ) {

        if (value == null) {
            return null;
        }

        String trimmed =
            value.trim();

        return trimmed.isEmpty()
            ? null
            : trimmed;
    }

    private UUID requireTenantId() {

        UUID tenantId =
            tenantContext.getTenantId();

        if (tenantId == null) {
            throw new IllegalStateException(
                "Tenant context is required"
            );
        }

        return tenantId;
    }

    private InterviewResponse toResponse(
        Interview interview
    ) {

        List<InterviewInterviewerResponse>
            interviewers =
                interviewInterviewerRepository
                    .findAllByTenantIdAndInterviewIdOrderByCreatedAtAsc(
                        interview
                            .getTenant()
                            .getId(),
                        interview.getId()
                    )
                    .stream()
                    .map(
                        this::toInterviewerResponse
                    )
                    .toList();

        JobApplication application =
            interview.getApplication();

        return new InterviewResponse(
            interview.getId(),

            application.getId(),

            application
                .getJob()
                .getId(),

            application
                .getJob()
                .getTitle(),

            application
                .getCandidate()
                .getId(),

            application
                .getCandidate()
                .getFirstName()
                + " "
                + application
                    .getCandidate()
                    .getLastName(),

            application
                .getCandidate()
                .getEmail(),

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

            interview.getUpdatedAt()
        );
    }

    private InterviewInterviewerResponse
        toInterviewerResponse(
            InterviewInterviewer assignment
        ) {

        TenantUser interviewer =
            assignment.getInterviewer();

        /*
         * Adjust these two accessors if your
         * TenantUser stores profile data
         * through a nested User entity.
         */
        return new InterviewInterviewerResponse(
            assignment.getId(),
            interviewer.getId(),
            interviewer.getName(),
            interviewer.getEmail()
        );
    }
}