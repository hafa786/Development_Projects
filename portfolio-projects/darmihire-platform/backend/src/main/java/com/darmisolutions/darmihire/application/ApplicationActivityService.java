package com.darmisolutions.darmihire.application;

import com.darmisolutions.darmihire.application.dto.ApplicationActivityResponse;
import com.darmisolutions.darmihire.tenant.TenantUser;
import com.darmisolutions.darmihire.tenant.context.*;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApplicationActivityService {

    private final ApplicationActivityRepository applicationActivityRepository;
    private final TenantContext tenantContext;

    @Transactional(readOnly = true)
    public List<ApplicationActivityResponse> findByApplication(
            UUID applicationId
    ) {
        UUID tenantId = requireTenantId();

        return applicationActivityRepository
                .findAllByTenantIdAndApplicationIdOrderByCreatedAtAsc(
                        tenantId,
                        applicationId
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /*
     * ---------------------------------------------------------
     * APPLICATION EVENTS
     * ---------------------------------------------------------
     */

    @Transactional
    public void recordCreated(
            JobApplication application,
            TenantUser performedBy
    ) {
        createActivity(
                application,
                ApplicationActivityType.APPLICATION_CREATED,
                null,
                application.getStage(),
                "Application created",
                performedBy
        );
    }

    @Transactional
    public void recordStageChanged(
            JobApplication application,
            ApplicationStage fromStage,
            ApplicationStage toStage,
            TenantUser performedBy
    ) {
        createActivity(
                application,
                ApplicationActivityType.STAGE_CHANGED,
                fromStage,
                toStage,
                "Application moved from "
                        + formatStage(fromStage)
                        + " to "
                        + formatStage(toStage),
                performedBy
        );
    }

    @Transactional
    public void recordRejected(
            JobApplication application,
            String reason,
            TenantUser performedBy
    ) {
        String description = "Application rejected";

        if (reason != null && !reason.isBlank()) {
            description += ": " + reason.trim();
        }

        createActivity(
                application,
                ApplicationActivityType.REJECTED,
                application.getStage(),
                null,
                description,
                performedBy
        );
    }

    @Transactional
    public void recordWithdrawn(
            JobApplication application,
            TenantUser performedBy
    ) {
        createActivity(
                application,
                ApplicationActivityType.WITHDRAWN,
                application.getStage(),
                null,
                "Application withdrawn",
                performedBy
        );
    }

    @Transactional
    public void recordHired(
            JobApplication application,
            ApplicationStage fromStage,
            TenantUser performedBy
    ) {
        createActivity(
                application,
                ApplicationActivityType.HIRED,
                fromStage,
                ApplicationStage.HIRED,
                "Candidate hired",
                performedBy
        );
    }

    /*
     * ---------------------------------------------------------
     * INTERVIEW EVENTS
     * ---------------------------------------------------------
     */

    @Transactional
    public void recordInterviewScheduled(
            JobApplication application,
            String interviewTitle,
            TenantUser performedBy
    ) {
        createActivity(
                application,
                ApplicationActivityType.INTERVIEW_SCHEDULED,
                null,
                null,
                "Interview scheduled: "
                        + safeInterviewTitle(interviewTitle),
                performedBy
        );
    }

    @Transactional
    public void recordInterviewRescheduled(
            JobApplication application,
            String interviewTitle,
            TenantUser performedBy
    ) {
        createActivity(
                application,
                ApplicationActivityType.INTERVIEW_RESCHEDULED,
                null,
                null,
                "Interview rescheduled: "
                        + safeInterviewTitle(interviewTitle),
                performedBy
        );
    }

    @Transactional
    public void recordInterviewCancelled(
            JobApplication application,
            String interviewTitle,
            TenantUser performedBy
    ) {
        createActivity(
                application,
                ApplicationActivityType.INTERVIEW_CANCELLED,
                null,
                null,
                "Interview cancelled: "
                        + safeInterviewTitle(interviewTitle),
                performedBy
        );
    }

    @Transactional
    public void recordInterviewCompleted(
            JobApplication application,
            String interviewTitle,
            TenantUser performedBy
    ) {
        createActivity(
                application,
                ApplicationActivityType.INTERVIEW_COMPLETED,
                null,
                null,
                "Interview completed: "
                        + safeInterviewTitle(interviewTitle),
                performedBy
        );
    }

    @Transactional
    public void recordInterviewerAdded(
            JobApplication application,
            String interviewTitle,
            String interviewerName,
            TenantUser performedBy
    ) {
        createActivity(
                application,
                ApplicationActivityType.INTERVIEWER_ADDED,
                null,
                null,
                safeInterviewerName(interviewerName)
                        + " assigned to interview: "
                        + safeInterviewTitle(interviewTitle),
                performedBy
        );
    }

    @Transactional
    public void recordInterviewerRemoved(
            JobApplication application,
            String interviewTitle,
            String interviewerName,
            TenantUser performedBy
    ) {
        createActivity(
                application,
                ApplicationActivityType.INTERVIEWER_REMOVED,
                null,
                null,
                safeInterviewerName(interviewerName)
                        + " removed from interview: "
                        + safeInterviewTitle(interviewTitle),
                performedBy
        );
    }

    /*
     * ---------------------------------------------------------
     * INTERNAL
     * ---------------------------------------------------------
     */

    private void createActivity(
            JobApplication application,
            ApplicationActivityType activityType,
            ApplicationStage fromStage,
            ApplicationStage toStage,
            String description,
            TenantUser performedBy
    ) {
        ApplicationActivity activity =
                new ApplicationActivity();

        activity.setTenant(application.getTenant());
        activity.setApplication(application);

        activity.setActivityType(activityType);

        activity.setFromStage(fromStage);
        activity.setToStage(toStage);

        activity.setDescription(description);

        activity.setPerformedBy(performedBy);

        applicationActivityRepository.save(activity);
    }

    private ApplicationActivityResponse toResponse(
            ApplicationActivity activity
    ) {
        TenantUser performedBy =
                activity.getPerformedBy();

        return new ApplicationActivityResponse(
                activity.getId(),
                activity.getApplication().getId(),
                activity.getActivityType(),
                activity.getFromStage(),
                activity.getToStage(),
                activity.getDescription(),

                performedBy != null
                        ? performedBy.getId()
                        : null,

                performedBy != null
                        ? getTenantUserDisplayName(performedBy)
                        : null,

                activity.getCreatedAt()
        );
    }

    private String getTenantUserDisplayName(
            TenantUser tenantUser
    ) {
        /*
         * Adapt this method ONLY if your TenantUser entity
         * exposes the person's name differently.
         *
         * For example:
         *
         * tenantUser.getUser().getFirstName()
         * tenantUser.getUser().getLastName()
         */

        try {
            String name = tenantUser.getName();

            if (name != null && !name.isBlank()) {
                return name.trim();
            }
        } catch (Exception ignored) {
            // Fall through.
        }

        return "Workspace member";
    }

    private String safeInterviewTitle(
            String title
    ) {
        if (title == null || title.isBlank()) {
            return "Interview";
        }

        return title.trim();
    }

    private String safeInterviewerName(
            String name
    ) {
        if (name == null || name.isBlank()) {
            return "Interviewer";
        }

        return name.trim();
    }

    private String formatStage(
            ApplicationStage stage
    ) {
        if (stage == null) {
            return "";
        }

        String value = stage
                .name()
                .toLowerCase()
                .replace('_', ' ');

        return Character.toUpperCase(value.charAt(0))
                + value.substring(1);
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
}