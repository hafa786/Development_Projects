package com.darmisolutions.darmihire.application;

import com.darmisolutions.darmihire.application.dto.ApplicationActivityResponse;
import com.darmisolutions.darmihire.exception.ResourceNotFoundException;
import com.darmisolutions.darmihire.tenant.TenantUser;
import com.darmisolutions.darmihire.tenant.context.TenantContext;
import com.darmisolutions.darmihire.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApplicationActivityService {

    private final ApplicationActivityRepository activityRepository;
    private final JobApplicationRepository applicationRepository;
    private final TenantContext tenantContext;

    @Transactional(readOnly = true)
    public List<ApplicationActivityResponse> findByApplication(
        UUID applicationId
    ) {
        UUID tenantId = requireTenantId();

        applicationRepository
            .findByIdAndTenantId(
                applicationId,
                tenantId
            )
            .orElseThrow(
                () -> new ResourceNotFoundException(
                    "Job application not found"
                )
            );

        return activityRepository
            .findAllByTenantIdAndApplicationIdOrderByCreatedAtAsc(
                tenantId,
                applicationId
            )
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public void recordCreated(
        JobApplication application,
        TenantUser performedBy
    ) {
        ApplicationActivity activity =
            baseActivity(
                application,
                ApplicationActivityType.APPLICATION_CREATED,
                performedBy
            );

        activity.setToStage(
            ApplicationStage.APPLIED
        );

        activity.setDescription(
            "Application created"
        );

        activityRepository.save(activity);
    }

    public void recordStageChanged(
        JobApplication application,
        ApplicationStage fromStage,
        ApplicationStage toStage,
        TenantUser performedBy
    ) {
        ApplicationActivityType type =
            toStage == ApplicationStage.HIRED
                ? ApplicationActivityType.HIRED
                : ApplicationActivityType.STAGE_CHANGED;

        ApplicationActivity activity =
            baseActivity(
                application,
                type,
                performedBy
            );

        activity.setFromStage(fromStage);
        activity.setToStage(toStage);

        if (toStage == ApplicationStage.HIRED) {
            activity.setDescription(
                "Candidate hired"
            );
        } else {
            activity.setDescription(
                "Application moved from "
                    + formatStage(fromStage)
                    + " to "
                    + formatStage(toStage)
            );
        }

        activityRepository.save(activity);
    }

    public void recordRejected(
        JobApplication application,
        String reason,
        TenantUser performedBy
    ) {
        ApplicationActivity activity =
            baseActivity(
                application,
                ApplicationActivityType.REJECTED,
                performedBy
            );

        activity.setFromStage(
            application.getStage()
        );

        activity.setDescription(
            reason == null || reason.isBlank()
                ? "Application rejected"
                : "Application rejected: "
                    + reason.trim()
        );

        activityRepository.save(activity);
    }

    public void recordWithdrawn(
        JobApplication application,
        TenantUser performedBy
    ) {
        ApplicationActivity activity =
            baseActivity(
                application,
                ApplicationActivityType.WITHDRAWN,
                performedBy
            );

        activity.setFromStage(
            application.getStage()
        );

        activity.setDescription(
            "Application withdrawn"
        );

        activityRepository.save(activity);
    }

    private ApplicationActivity baseActivity(
        JobApplication application,
        ApplicationActivityType type,
        TenantUser performedBy
    ) {
        ApplicationActivity activity =
            new ApplicationActivity();

        activity.setTenant(
            application.getTenant()
        );

        activity.setApplication(
            application
        );

        activity.setActivityType(type);

        activity.setPerformedBy(
            performedBy
        );

        return activity;
    }

    private ApplicationActivityResponse toResponse(
        ApplicationActivity activity
    ) {
        TenantUser performedBy =
            activity.getPerformedBy();

        return new ApplicationActivityResponse(
            activity.getId(),

            activity
                .getApplication()
                .getId(),

            activity.getActivityType(),

            activity.getFromStage(),

            activity.getToStage(),

            activity.getDescription(),

            performedBy != null
                ? performedBy.getId()
                : null,

            performedBy != null
                ? resolveUserName(performedBy)
                : null,

            activity.getCreatedAt()
        );
    }

    private String resolveUserName(
        TenantUser user
    ) {
        /*
         * Adjust these getters to your actual
         * TenantUser entity.
         */
        String firstName =
            user.getUser().getFirstName();
        String lastName =
            user.getUser().getLastName();

        return (
            (firstName == null ? "" : firstName)
                + " "
                + (lastName == null ? "" : lastName)
        ).trim();
    }

    private String formatStage(
        ApplicationStage stage
    ) {
        if (stage == null) {
            return "";
        }

        String value =
            stage.name()
                .replace('_', ' ')
                .toLowerCase();

        return Character
            .toUpperCase(value.charAt(0))
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