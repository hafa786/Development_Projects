package com.darmisolutions.darmihire.job;

import com.darmisolutions.darmihire.audit.AuditAction;
import com.darmisolutions.darmihire.audit.AuditService;
import com.darmisolutions.darmihire.department.Department;
import com.darmisolutions.darmihire.department.DepartmentRepository;
import com.darmisolutions.darmihire.exception.ConflictException;
import com.darmisolutions.darmihire.exception.ResourceNotFoundException;
import com.darmisolutions.darmihire.job.dto.CreateJobRequest;
import com.darmisolutions.darmihire.job.dto.JobResponse;
import com.darmisolutions.darmihire.job.dto.PublishJobRequest;
import com.darmisolutions.darmihire.job.dto.UpdateJobRequest;
import com.darmisolutions.darmihire.job.dto.UpdateJobStatusRequest;
import com.darmisolutions.darmihire.location.Location;
import com.darmisolutions.darmihire.location.LocationRepository;
import com.darmisolutions.darmihire.security.AuthorizationService;
import com.darmisolutions.darmihire.security.Permission;
import com.darmisolutions.darmihire.team.Team;
import com.darmisolutions.darmihire.team.TeamRepository;
import com.darmisolutions.darmihire.tenant.MembershipStatus;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantRepository;
import com.darmisolutions.darmihire.tenant.TenantUser;
import com.darmisolutions.darmihire.tenant.TenantUserRepository;
import com.darmisolutions.darmihire.tenant.context.TenantContext;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final TenantRepository tenantRepository;
    private final DepartmentRepository departmentRepository;
    private final TeamRepository teamRepository;
    private final LocationRepository locationRepository;
    private final TenantUserRepository tenantUserRepository;
    private final JobSlugService jobSlugService;
    private final TenantContext tenantContext;
    private final AuthorizationService authorizationService;
    private final AuditService auditService;

    /*
     * ---------------------------------------------------------
     * GET ALL
     * ---------------------------------------------------------
     */

    @Transactional(readOnly = true)
    public List<JobResponse> findAll() {

        UUID tenantId = requireTenantId();

        return jobRepository
                .findAllByTenantIdOrderByCreatedAtDesc(tenantId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /*
     * ---------------------------------------------------------
     * GET ONE
     * ---------------------------------------------------------
     */

    @Transactional(readOnly = true)
    public JobResponse findById(
            UUID id) {

        Job job = findJob(id);

        return toResponse(job);
    }

    /*
     * ---------------------------------------------------------
     * CREATE
     * ---------------------------------------------------------
     */

    @Transactional
    public JobResponse create(
            CreateJobRequest request) {

        authorizationService.require(
                Permission.MANAGE_JOBS);

        UUID tenantId = requireTenantId();

        String title = normalizeRequiredTitle(
                request.title());

        String jobCode = normalizeNullable(
                request.jobCode());

        /*
         * Generate a job code when one was not supplied.
         */
        if (jobCode == null) {
            jobCode = generateJobCode();
        }

        /*
         * Job codes must be unique inside the tenant.
         */
        if (jobRepository
                .existsByTenantIdAndJobCodeIgnoreCase(
                        tenantId,
                        jobCode)) {

            throw new ConflictException(
                    "Job code already exists");
        }

        Tenant tenant = tenantRepository
                .findById(tenantId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Tenant not found"));

        Job job = new Job();

        job.setTenant(tenant);
        job.setTitle(title);
        job.setJobCode(jobCode);

        job.setDescription(
                normalizeNullable(
                        request.description()));

        job.setDepartment(
                findDepartment(
                        tenantId,
                        request.departmentId()));

        job.setTeam(
                findTeam(
                        tenantId,
                        request.teamId()));

        job.setLocation(
                findLocation(
                        tenantId,
                        request.locationId()));

        job.setRecruiter(
                findActiveTenantUser(
                        tenantId,
                        request.recruiterId()));

        job.setHiringManager(
                findActiveTenantUser(
                        tenantId,
                        request.hiringManagerId()));

        job.setEmploymentType(
                request.employmentType());

        job.setWorkplaceType(
                request.workplaceType());

        job.setStatus(
                JobStatus.DRAFT);

        job.setOpenings(
                request.openings() == null
                        ? 1
                        : request.openings());

        /*
         * Step 21.1:
         * New jobs are never publicly published automatically.
         */
        job.setPublished(false);
        job.setPublishedAt(null);
        job.setPublicSlug(null);
        job.setApplicationDeadline(null);

        Job savedJob = jobRepository.save(job);

        auditService.log(
                AuditAction.JOB_CREATED,
                "Job",
                savedJob.getId());

        return toResponse(savedJob);
    }

    /*
     * ---------------------------------------------------------
     * UPDATE
     * ---------------------------------------------------------
     */

    @Transactional
    public JobResponse update(
            UUID id,
            UpdateJobRequest request) {

        authorizationService.require(
                Permission.MANAGE_JOBS);

        UUID tenantId = requireTenantId();

        Job job = findJob(id);

        job.setTitle(
                normalizeRequiredTitle(
                        request.title()));

        job.setDescription(
                normalizeNullable(
                        request.description()));

        job.setDepartment(
                findDepartment(
                        tenantId,
                        request.departmentId()));

        job.setTeam(
                findTeam(
                        tenantId,
                        request.teamId()));

        job.setLocation(
                findLocation(
                        tenantId,
                        request.locationId()));

        job.setRecruiter(
                findActiveTenantUser(
                        tenantId,
                        request.recruiterId()));

        job.setHiringManager(
                findActiveTenantUser(
                        tenantId,
                        request.hiringManagerId()));

        job.setEmploymentType(
                request.employmentType());

        job.setWorkplaceType(
                request.workplaceType());

        job.setOpenings(
                request.openings());

        /*
         * Do not regenerate publicSlug when the title changes.
         *
         * Once a public URL has been generated, it should
         * remain stable.
         */

        Job savedJob = jobRepository.save(job);

        auditService.log(
                AuditAction.JOB_UPDATED,
                "Job",
                savedJob.getId());

        return toResponse(savedJob);
    }

    /*
     * ---------------------------------------------------------
     * UPDATE STATUS
     * ---------------------------------------------------------
     */

    @Transactional
    public JobResponse updateStatus(
            UUID id,
            UpdateJobStatusRequest request) {

        authorizationService.require(
                Permission.MANAGE_JOBS);

        Job job = findJob(id);

        JobStatus currentStatus = job.getStatus();

        JobStatus newStatus = request.status();

        if (!isValidStatusTransition(
                currentStatus,
                newStatus)) {

            throw new IllegalArgumentException(
                    "Invalid job status transition: "
                            + currentStatus
                            + " -> "
                            + newStatus);
        }

        job.setStatus(newStatus);

        /*
         * Step 21.1:
         *
         * PAUSED and CLOSED jobs must immediately disappear
         * from the public careers portal.
         *
         * Keep publicSlug so reopening + republishing can use
         * the same public URL.
         */
        if (newStatus == JobStatus.PAUSED
                || newStatus == JobStatus.CLOSED) {

            job.setPublished(false);
        }

        Job savedJob = jobRepository.save(job);

        auditService.log(
                AuditAction.JOB_STATUS_CHANGED,
                "Job",
                savedJob.getId());

        return toResponse(savedJob);
    }

    /*
     * ---------------------------------------------------------
     * DELETE
     * ---------------------------------------------------------
     */

    @Transactional
    public void delete(
            UUID id) {

        authorizationService.require(
                Permission.MANAGE_JOBS);

        Job job = findJob(id);

        /*
         * Only draft jobs may be permanently deleted.
         *
         * Open/paused jobs should be closed instead so that
         * their recruitment history remains available.
         */
        if (job.getStatus() != JobStatus.DRAFT) {

            throw new IllegalArgumentException(
                    "Only draft jobs can be deleted");
        }

        UUID jobId = job.getId();

        jobRepository.delete(job);

        auditService.log(
                AuditAction.JOB_DELETED,
                "Job",
                jobId);
    }

    /*
     * ---------------------------------------------------------
     * PUBLISH JOB
     * Step 21.1
     * ---------------------------------------------------------
     */

    @Transactional
    public JobResponse publish(
            UUID jobId,
            PublishJobRequest request) {

        authorizationService.require(
                Permission.MANAGE_JOBS);

        UUID tenantId = requireTenantId();

        Job job = jobRepository
                .findByIdAndTenantId(
                        jobId,
                        tenantId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Job not found"));

        /*
         * Only OPEN jobs may be published.
         */
        if (job.getStatus() != JobStatus.OPEN) {

            throw new IllegalStateException(
                    "Only open jobs can be published");
        }

        LocalDate applicationDeadline = request.applicationDeadline();

        /*
         * Today's deadline is valid.
         *
         * Only dates before today are rejected.
         */
        if (applicationDeadline != null
                && applicationDeadline.isBefore(
                        LocalDate.now())) {

            throw new IllegalArgumentException(
                    "Application deadline cannot be in the past");
        }

        /*
         * Generate the slug only once.
         *
         * This means:
         *
         * publish
         * -> senior-backend-engineer
         *
         * unpublish
         * -> slug preserved
         *
         * republish
         * -> senior-backend-engineer
         */
        if (job.getPublicSlug() == null
                || job.getPublicSlug().isBlank()) {

            job.setPublicSlug(
                    jobSlugService.generate(
                            tenantId,
                            job.getTitle()));
        }

        job.setPublished(true);

        job.setPublishedAt(
                Instant.now());

        job.setApplicationDeadline(
                applicationDeadline);

        Job savedJob = jobRepository.save(job);

        auditService.log(
                AuditAction.JOB_PUBLISHED,
                "Job",
                savedJob.getId());

        return toResponse(savedJob);
    }

    /*
     * ---------------------------------------------------------
     * UNPUBLISH JOB
     * Step 21.1
     * ---------------------------------------------------------
     */

    @Transactional
    public JobResponse unpublish(
            UUID jobId) {

        authorizationService.require(
                Permission.MANAGE_JOBS);

        UUID tenantId = requireTenantId();

        Job job = jobRepository
                .findByIdAndTenantId(
                        jobId,
                        tenantId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Job not found"));

        /*
         * Make unpublish idempotent.
         */
        if (!job.isPublished()) {
            return toResponse(job);
        }

        job.setPublished(false);

        /*
         * Do NOT clear:
         *
         * publicSlug
         * publishedAt
         * applicationDeadline
         *
         * The slug remains stable for future republishing.
         */

        Job savedJob = jobRepository.save(job);

        auditService.log(
                AuditAction.JOB_UNPUBLISHED,
                "Job",
                savedJob.getId());

        return toResponse(savedJob);
    }

    /*
     * ---------------------------------------------------------
     * PUBLIC AVAILABILITY
     * Step 21.1
     * ---------------------------------------------------------
     *
     * Step 21.2/21.3 will use the same business rule when
     * exposing public jobs and accepting applications.
     */

    public boolean isPubliclyAvailable(
            Job job) {

        if (job == null) {
            return false;
        }

        if (!job.isPublished()) {
            return false;
        }

        if (job.getStatus() != JobStatus.OPEN) {
            return false;
        }

        LocalDate deadline = job.getApplicationDeadline();

        return deadline == null
                || !deadline.isBefore(
                        LocalDate.now());
    }

    /*
     * ---------------------------------------------------------
     * FIND TENANT-SCOPED JOB
     * ---------------------------------------------------------
     */

    private Job findJob(
            UUID id) {

        UUID tenantId = requireTenantId();

        return jobRepository
                .findByIdAndTenantId(
                        id,
                        tenantId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Job not found"));
    }

    /*
     * ---------------------------------------------------------
     * FIND TENANT-SCOPED DEPARTMENT
     * ---------------------------------------------------------
     */

    private Department findDepartment(
            UUID tenantId,
            UUID departmentId) {

        if (departmentId == null) {
            return null;
        }

        return departmentRepository
                .findByIdAndTenantId(
                        departmentId,
                        tenantId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Department not found"));
    }

    /*
     * ---------------------------------------------------------
     * FIND TENANT-SCOPED TEAM
     * ---------------------------------------------------------
     */

    private Team findTeam(
            UUID tenantId,
            UUID teamId) {

        if (teamId == null) {
            return null;
        }

        return teamRepository
                .findByIdAndTenantId(
                        teamId,
                        tenantId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Team not found"));
    }

    /*
     * ---------------------------------------------------------
     * FIND TENANT-SCOPED LOCATION
     * ---------------------------------------------------------
     */

    private Location findLocation(
            UUID tenantId,
            UUID locationId) {

        if (locationId == null) {
            return null;
        }

        return locationRepository
                .findByIdAndTenantId(
                        locationId,
                        tenantId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Location not found"));
    }

    /*
     * ---------------------------------------------------------
     * FIND ACTIVE TENANT USER
     * ---------------------------------------------------------
     */

    private TenantUser findActiveTenantUser(
            UUID tenantId,
            UUID tenantUserId) {

        if (tenantUserId == null) {
            return null;
        }

        TenantUser tenantUser = tenantUserRepository
                .findByIdAndTenantId(
                        tenantUserId,
                        tenantId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Workspace member not found"));

        if (tenantUser.getStatus() != MembershipStatus.ACTIVE) {

            throw new IllegalArgumentException(
                    "Workspace member must be active");
        }

        return tenantUser;
    }

    /*
     * ---------------------------------------------------------
     * JOB STATUS WORKFLOW
     * ---------------------------------------------------------
     */

    private boolean isValidStatusTransition(
            JobStatus currentStatus,
            JobStatus newStatus) {

        if (currentStatus == newStatus) {
            return true;
        }

        return switch (currentStatus) {

            case DRAFT ->
                newStatus == JobStatus.OPEN;

            case OPEN ->
                newStatus == JobStatus.PAUSED
                        || newStatus == JobStatus.CLOSED;

            case PAUSED ->
                newStatus == JobStatus.OPEN
                        || newStatus == JobStatus.CLOSED;

            case CLOSED ->
                false;
        };
    }

    /*
     * ---------------------------------------------------------
     * GENERATE JOB CODE
     * ---------------------------------------------------------
     */

    private String generateJobCode() {

        String jobCode;

        do {

            jobCode = "DH-"
                    + UUID.randomUUID()
                            .toString()
                            .replace("-", "")
                            .substring(0, 8)
                            .toUpperCase();

        } while (jobRepository
                .existsByTenantIdAndJobCodeIgnoreCase(
                        requireTenantId(),
                        jobCode));

        return jobCode;
    }

    /*
     * ---------------------------------------------------------
     * REQUIRE TENANT
     * ---------------------------------------------------------
     */

    private UUID requireTenantId() {

        UUID tenantId = tenantContext.getTenantId();

        if (tenantId == null) {

            throw new IllegalStateException(
                    "Tenant context is required");
        }

        return tenantId;
    }

    /*
     * ---------------------------------------------------------
     * NORMALIZE REQUIRED TITLE
     * ---------------------------------------------------------
     */

    private String normalizeRequiredTitle(
            String value) {

        if (value == null) {

            throw new IllegalArgumentException(
                    "Job title is required");
        }

        String trimmed = value.trim();

        if (trimmed.isEmpty()) {

            throw new IllegalArgumentException(
                    "Job title is required");
        }

        return trimmed;
    }

    /*
     * ---------------------------------------------------------
     * NORMALIZE OPTIONAL TEXT
     * ---------------------------------------------------------
     */

    private String normalizeNullable(
            String value) {

        if (value == null) {
            return null;
        }

        String trimmed = value.trim();

        return trimmed.isEmpty()
                ? null
                : trimmed;
    }

    /*
     * ---------------------------------------------------------
     * ENTITY -> RESPONSE
     * ---------------------------------------------------------
     */

    private JobResponse toResponse(
            Job job) {

        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getJobCode(),
                job.getDescription(),

                job.getDepartment() != null
                        ? job.getDepartment().getId()
                        : null,

                job.getDepartment() != null
                        ? job.getDepartment().getName()
                        : null,

                job.getTeam() != null
                        ? job.getTeam().getId()
                        : null,

                job.getTeam() != null
                        ? job.getTeam().getName()
                        : null,

                job.getLocation() != null
                        ? job.getLocation().getId()
                        : null,

                job.getLocation() != null
                        ? job.getLocation().getName()
                        : null,

                job.getRecruiter() != null
                        ? job.getRecruiter().getId()
                        : null,

                tenantUserName(
                        job.getRecruiter()),

                job.getHiringManager() != null
                        ? job.getHiringManager().getId()
                        : null,

                tenantUserName(
                        job.getHiringManager()),

                job.getEmploymentType(),
                job.getWorkplaceType(),
                job.getStatus(),
                job.getOpenings(),

                job.getPublishedAt(),
                job.getCreatedAt());
    }

    /*
     * ---------------------------------------------------------
     * TENANT USER DISPLAY NAME
     * ---------------------------------------------------------
     */

    private String tenantUserName(
            TenantUser tenantUser) {

        if (tenantUser == null
                || tenantUser.getUser() == null) {

            return null;
        }

        String firstName = tenantUser
                .getUser()
                .getFirstName();

        String lastName = tenantUser
                .getUser()
                .getLastName();

        String fullName = ((firstName == null
                ? ""
                : firstName)
                + " "
                + (lastName == null
                        ? ""
                        : lastName))
                .trim();

        if (!fullName.isEmpty()) {
            return fullName;
        }

        return tenantUser
                .getUser()
                .getEmail();
    }
}