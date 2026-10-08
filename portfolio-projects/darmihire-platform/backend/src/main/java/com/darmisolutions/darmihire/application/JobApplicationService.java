package com.darmisolutions.darmihire.application;

import com.darmisolutions.darmihire.application.dto.CreateJobApplicationRequest;
import com.darmisolutions.darmihire.application.dto.JobApplicationResponse;
import com.darmisolutions.darmihire.application.dto.RejectApplicationRequest;
import com.darmisolutions.darmihire.application.dto.UpdateApplicationStageRequest;
import com.darmisolutions.darmihire.audit.AuditAction;
import com.darmisolutions.darmihire.audit.AuditService;
import com.darmisolutions.darmihire.candidate.Candidate;
import com.darmisolutions.darmihire.candidate.CandidateRepository;
import com.darmisolutions.darmihire.exception.ConflictException;
import com.darmisolutions.darmihire.exception.ResourceNotFoundException;
import com.darmisolutions.darmihire.job.Job;
import com.darmisolutions.darmihire.job.JobRepository;
import com.darmisolutions.darmihire.security.AuthorizationService;
import com.darmisolutions.darmihire.security.Permission;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantRepository;
import com.darmisolutions.darmihire.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final TenantRepository tenantRepository;
    private final TenantContext tenantContext;
    private final AuthorizationService authorizationService;
    private final AuditService auditService;
    private final ApplicationActivityService activityService;

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> findAll() {
        UUID tenantId = requireTenantId();

        return applicationRepository
            .findAllByTenantIdOrderByCreatedAtDesc(tenantId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public JobApplicationResponse findById(UUID id) {
        UUID tenantId = requireTenantId();

        return toResponse(
            findApplication(id, tenantId)
        );
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> findByJob(
        UUID jobId
    ) {
        UUID tenantId = requireTenantId();

        // Ensure this job actually belongs to this tenant.
        findJob(jobId, tenantId);

        return applicationRepository
            .findAllByTenantIdAndJobIdOrderByCreatedAtDesc(
                tenantId,
                jobId
            )
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> findByCandidate(
        UUID candidateId
    ) {
        UUID tenantId = requireTenantId();

        // Ensure candidate belongs to this tenant.
        findCandidate(candidateId, tenantId);

        return applicationRepository
            .findAllByTenantIdAndCandidateIdOrderByCreatedAtDesc(
                tenantId,
                candidateId
            )
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public JobApplicationResponse create(
        CreateJobApplicationRequest request
    ) {
        authorizationService.require(
            Permission.MANAGE_APPLICATIONS
        );

        UUID tenantId = requireTenantId();

        Job job = findJob(
            request.jobId(),
            tenantId
        );

        Candidate candidate = findCandidate(
            request.candidateId(),
            tenantId
        );

        boolean exists =
            applicationRepository
                .existsByTenantIdAndJobIdAndCandidateId(
                    tenantId,
                    job.getId(),
                    candidate.getId()
                );

        if (exists) {
            throw new ConflictException(
                "Candidate has already applied for this job"
            );
        }

        Tenant tenant = tenantRepository
            .findById(tenantId)
            .orElseThrow(
                () -> new ResourceNotFoundException(
                    "Tenant not found"
                )
            );

        JobApplication application =
            new JobApplication();

        application.setTenant(tenant);
        application.setJob(job);
        application.setCandidate(candidate);

        application.setStage(
            ApplicationStage.APPLIED
        );

        application.setStatus(
            ApplicationStatus.ACTIVE
        );

        application.setAppliedAt(
            Instant.now()
        );

        JobApplication saved =
            applicationRepository.save(application);

        activityService.recordCreated(
            saved,
            null
        );

        
        auditService.log(
            AuditAction.APPLICATION_CREATED,
            "JobApplication",
            saved.getId()
        );

        return toResponse(saved);
    }

    @Transactional
    public JobApplicationResponse updateStage(
        UUID id,
        UpdateApplicationStageRequest request
    ) {
        authorizationService.require(
            Permission.MANAGE_APPLICATIONS
        );

        UUID tenantId = requireTenantId();

        JobApplication application =
            findApplication(id, tenantId);

        requireActive(application);

        ApplicationStage previousStage = application.getStage();

        ApplicationStage newStage =
            request.stage();

        validateStageTransition(
            application.getStage(),
            newStage
        );

        application.setStage(newStage);

        if (newStage == ApplicationStage.HIRED) {
            application.setStatus(
                ApplicationStatus.HIRED
            );

            application.setHiredAt(
                Instant.now()
            );
        }

        JobApplication saved =
            applicationRepository.save(application);

        auditService.log(
            newStage == ApplicationStage.HIRED
                ? AuditAction.APPLICATION_HIRED
                : AuditAction.APPLICATION_STAGE_CHANGED,
            "JobApplication",
            saved.getId()
        );

        return toResponse(saved);
    }

    @Transactional
    public JobApplicationResponse reject(
        UUID id,
        RejectApplicationRequest request
    ) {
        authorizationService.require(
            Permission.MANAGE_APPLICATIONS
        );

        UUID tenantId = requireTenantId();

        JobApplication application =
            findApplication(id, tenantId);

        requireActive(application);

        application.setStatus(
            ApplicationStatus.REJECTED
        );

        application.setRejectedAt(
            Instant.now()
        );

        application.setRejectionReason(
            normalizeOptional(request.reason())
        );

        JobApplication saved =
            applicationRepository.save(application);

        auditService.log(
            AuditAction.APPLICATION_REJECTED,
            "JobApplication",
            saved.getId()
        );

        return toResponse(saved);
    }

    @Transactional
    public JobApplicationResponse withdraw(
        UUID id
    ) {
        authorizationService.require(
            Permission.MANAGE_APPLICATIONS
        );

        UUID tenantId = requireTenantId();

        JobApplication application =
            findApplication(id, tenantId);

        requireActive(application);

        application.setStatus(
            ApplicationStatus.WITHDRAWN
        );

        application.setWithdrawnAt(
            Instant.now()
        );

        JobApplication saved =
            applicationRepository.save(application);

        auditService.log(
            AuditAction.APPLICATION_WITHDRAWN,
            "JobApplication",
            saved.getId()
        );

        return toResponse(saved);
    }

    private void validateStageTransition(
        ApplicationStage current,
        ApplicationStage target
    ) {
        if (current == target) {
            throw new ConflictException(
                "Application is already in this stage"
            );
        }

        boolean valid = switch (current) {
            case APPLIED ->
                target == ApplicationStage.SCREENING;

            case SCREENING ->
                target == ApplicationStage.INTERVIEW;

            case INTERVIEW ->
                target == ApplicationStage.OFFER;

            case OFFER ->
                target == ApplicationStage.HIRED;

            case HIRED -> false;
        };

        if (!valid) {
            throw new ConflictException(
                "Invalid application stage transition from "
                    + current
                    + " to "
                    + target
            );
        }
    }

    private void requireActive(
        JobApplication application
    ) {
        if (
            application.getStatus()
                != ApplicationStatus.ACTIVE
        ) {
            throw new ConflictException(
                "Only active applications can be modified"
            );
        }
    }

    private JobApplication findApplication(
        UUID applicationId,
        UUID tenantId
    ) {
        return applicationRepository
            .findByIdAndTenantId(
                applicationId,
                tenantId
            )
            .orElseThrow(
                () -> new ResourceNotFoundException(
                    "Job application not found"
                )
            );
    }

    private Job findJob(
        UUID jobId,
        UUID tenantId
    ) {
        return jobRepository
            .findByIdAndTenantId(
                jobId,
                tenantId
            )
            .orElseThrow(
                () -> new ResourceNotFoundException(
                    "Job not found"
                )
            );
    }

    private Candidate findCandidate(
        UUID candidateId,
        UUID tenantId
    ) {
        return candidateRepository
            .findByIdAndTenantId(
                candidateId,
                tenantId
            )
            .orElseThrow(
                () -> new ResourceNotFoundException(
                    "Candidate not found"
                )
            );
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

    private String normalizeOptional(
        String value
    ) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isEmpty()
            ? null
            : normalized;
    }

    private JobApplicationResponse toResponse(
        JobApplication application
    ) {
        Candidate candidate =
            application.getCandidate();

        Job job =
            application.getJob();

        String fullName =
            candidate.getFirstName()
                + " "
                + candidate.getLastName();

        return new JobApplicationResponse(
            application.getId(),

            job.getId(),
            job.getTitle(),
            job.getJobCode(),

            candidate.getId(),
            candidate.getFirstName(),
            candidate.getLastName(),
            fullName,
            candidate.getEmail(),
            candidate.getPhone(),
            candidate.getLocation(),

            application.getStage(),
            application.getStatus(),

            application.getAppliedAt(),

            application.getRejectedAt(),
            application.getRejectionReason(),

            application.getWithdrawnAt(),
            application.getHiredAt(),

            application.getCreatedAt(),
            application.getUpdatedAt()
        );
    }
}