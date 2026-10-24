package com.darmisolutions.darmihire.careers;

import com.darmisolutions.darmihire.application.ApplicationActivityService;
import com.darmisolutions.darmihire.application.ApplicationStage;
import com.darmisolutions.darmihire.application.ApplicationStatus;
import com.darmisolutions.darmihire.application.JobApplication;
import com.darmisolutions.darmihire.application.JobApplicationRepository;
import com.darmisolutions.darmihire.audit.AuditAction;
import com.darmisolutions.darmihire.audit.AuditService;
import com.darmisolutions.darmihire.candidate.Candidate;
import com.darmisolutions.darmihire.candidate.CandidateRepository;
import com.darmisolutions.darmihire.candidate.CandidateSource;
import com.darmisolutions.darmihire.careers.dto.PublicCareerResponse;
import com.darmisolutions.darmihire.careers.dto.PublicJobApplicationRequest;
import com.darmisolutions.darmihire.careers.dto.PublicJobApplicationResponse;
import com.darmisolutions.darmihire.careers.dto.PublicJobResponse;
import com.darmisolutions.darmihire.careers.dto.PublicJobSummaryResponse;
import com.darmisolutions.darmihire.exception.ConflictException;
import com.darmisolutions.darmihire.exception.ResourceNotFoundException;
import com.darmisolutions.darmihire.job.Job;
import com.darmisolutions.darmihire.job.JobRepository;
import com.darmisolutions.darmihire.job.JobStatus;
import com.darmisolutions.darmihire.storage.ResumeStorageService;
import com.darmisolutions.darmihire.storage.ResumeStorageService.StoredResume;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantRepository;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PublicCareersService {

    private final TenantRepository tenantRepository;
    private final JobRepository jobRepository;

    private final CandidateRepository candidateRepository;
    private final JobApplicationRepository applicationRepository;

    private final ApplicationActivityService activityService;
    private final AuditService auditService;
    private final ResumeStorageService resumeStorageService;
    /*
     * ---------------------------------------------------------
     * GET PUBLIC CAREERS SITE
     * ---------------------------------------------------------
     */

    @Transactional(readOnly = true)
    public PublicCareerResponse getCareer(
            String companySlug) {

        Tenant tenant = findTenant(companySlug);

        return new PublicCareerResponse(
                tenant.getName(),
                tenant.getSlug());
    }

    @Transactional
    public PublicJobApplicationResponse apply(
            String companySlug,
            String jobSlug,
            PublicJobApplicationRequest request,
            MultipartFile resume) {
        /*
         * ---------------------------------------------------------
         * RESOLVE TENANT
         * ---------------------------------------------------------
         */

        Tenant tenant = tenantRepository
                .findBySlugIgnoreCase(companySlug.trim())
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Company careers page not found"));

        UUID tenantId = tenant.getId();

        /*
         * ---------------------------------------------------------
         * RESOLVE PUBLIC JOB
         * ---------------------------------------------------------
         */

        Job job = jobRepository
                .findByTenantIdAndPublicSlugAndPublishedTrueAndStatus(
                        tenantId,
                        jobSlug.trim(),
                        JobStatus.OPEN)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Job not found"));

        /*
         * ---------------------------------------------------------
         * APPLICATION DEADLINE
         * ---------------------------------------------------------
         */

        if (job.getApplicationDeadline() != null
                && job.getApplicationDeadline()
                        .isBefore(LocalDate.now())) {
            throw new ConflictException(
                    "Applications for this position are closed.");
        }

        /*
         * ---------------------------------------------------------
         * NORMALIZE EMAIL
         * ---------------------------------------------------------
         */

        String email = normalizeEmail(request.email());

        /*
         * ---------------------------------------------------------
         * FIND OR CREATE CANDIDATE
         * ---------------------------------------------------------
         */

        Candidate candidate = candidateRepository
                .findByTenantIdAndEmailIgnoreCase(
                        tenantId,
                        email)
                .orElse(null);

        if (candidate == null) {

            candidate = new Candidate();

            candidate.setTenant(tenant);

            candidate.setFirstName(
                    normalizeRequired(
                            request.firstName()));

            candidate.setLastName(
                    normalizeRequired(
                            request.lastName()));

            candidate.setEmail(email);

            candidate.setPhone(
                    normalizeOptional(
                            request.phone()));

            candidate.setLocation(
                    normalizeOptional(
                            request.location()));

            candidate.setLinkedinUrl(
                    normalizeOptional(
                            request.linkedinUrl()));

            candidate.setPortfolioUrl(
                    normalizeOptional(
                            request.portfolioUrl()));

            candidate.setSource(
                    CandidateSource.CAREERS_PAGE);

            candidate = candidateRepository.saveAndFlush(
                    candidate);

        } else {

            /*
             * Existing candidate:
             * update useful profile information from
             * the newest application.
             */

            candidate.setFirstName(
                    normalizeRequired(
                            request.firstName()));

            candidate.setLastName(
                    normalizeRequired(
                            request.lastName()));

            candidate.setPhone(
                    normalizeOptional(
                            request.phone()));

            candidate.setLocation(
                    normalizeOptional(
                            request.location()));

            candidate.setLinkedinUrl(
                    normalizeOptional(
                            request.linkedinUrl()));

            candidate.setPortfolioUrl(
                    normalizeOptional(
                            request.portfolioUrl()));

            candidate = candidateRepository.save(candidate);
        }

        /*
         * ---------------------------------------------------------
         * PREVENT DUPLICATE APPLICATION
         * ---------------------------------------------------------
         *
         * IMPORTANT:
         * Do this BEFORE storing the new resume.
         */

        boolean alreadyApplied = applicationRepository
                .existsByTenantIdAndJobIdAndCandidateId(
                        tenantId,
                        job.getId(),
                        candidate.getId());

        if (alreadyApplied) {
            throw new ConflictException(
                    "You have already applied for this position.");
        }

        /*
         * ---------------------------------------------------------
         * STORE RESUME
         * ---------------------------------------------------------
         */

        if (resume != null
                && !resume.isEmpty()) {

            StoredResume storedResume = resumeStorageService.store(
                    tenantId,
                    candidate.getId(),
                    resume);

            candidate.setResumeFileName(
                    storedResume.originalFileName());

            candidate.setResumeUrl(
                    storedResume.storageKey());

            candidate = candidateRepository.save(candidate);
        }

        /*
         * ---------------------------------------------------------
         * CREATE APPLICATION
         * ---------------------------------------------------------
         */

        JobApplication application = new JobApplication();

        application.setTenant(tenant);
        application.setJob(job);
        application.setCandidate(candidate);

        application.setStage(
                ApplicationStage.APPLIED);

        application.setStatus(
                ApplicationStatus.ACTIVE);

        application.setAppliedAt(
                Instant.now());

        /*
         * ---------------------------------------------------------
         * DATABASE-SAFE DUPLICATE PROTECTION
         * ---------------------------------------------------------
         */

        JobApplication savedApplication;

        try {

            savedApplication = applicationRepository
                    .saveAndFlush(application);

        } catch (DataIntegrityViolationException exception) {

            throw new ConflictException(
                    "You have already applied for this position.");
        }

        /*
         * ---------------------------------------------------------
         * ACTIVITY
         * ---------------------------------------------------------
         */

        activityService.recordCreated(
                savedApplication,
                null);

        /*
         * ---------------------------------------------------------
         * RESPONSE
         * ---------------------------------------------------------
         */

        String candidateName = candidate.getFirstName()
                + " "
                + candidate.getLastName();

        return new PublicJobApplicationResponse(
                savedApplication.getId(),
                job.getTitle(),
                candidateName,
                savedApplication.getAppliedAt(),
                "Application submitted successfully.");
    }

    /*
     * ---------------------------------------------------------
     * GET PUBLIC JOBS
     * ---------------------------------------------------------
     */

    private String normalizeRequired(
            String value) {
        return value.trim();
    }

    private String normalizeOptional(
            String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isEmpty()
                ? null
                : normalized;
    }

    private String normalizeEmail(
            String value) {
        return value
                .trim()
                .toLowerCase(Locale.ROOT);
    }

    @Transactional(readOnly = true)
    public List<PublicJobSummaryResponse> getJobs(
            String companySlug) {

        Tenant tenant = findTenant(companySlug);

        return jobRepository
                .findAllByTenantIdAndPublishedTrueAndStatusOrderByCreatedAtDesc(
                        tenant.getId(),
                        JobStatus.OPEN)
                .stream()
                .filter(this::isDeadlineValid)
                .map(this::toSummaryResponse)
                .toList();
    }

    /*
     * ---------------------------------------------------------
     * GET PUBLIC JOB
     * ---------------------------------------------------------
     */

    @Transactional(readOnly = true)
    public PublicJobResponse getJob(
            String companySlug,
            String jobSlug) {

        Tenant tenant = findTenant(companySlug);

        Job job = findPublicJob(
                tenant,
                jobSlug);

        return toJobResponse(job);
    }
    /*
     * ---------------------------------------------------------
     * CREATE PUBLIC CANDIDATE
     * ---------------------------------------------------------
     */

    private Candidate createPublicCandidate(
            Tenant tenant,
            String firstName,
            String lastName,
            String email,
            PublicJobApplicationRequest request) {

        Candidate candidate = new Candidate();

        candidate.setTenant(tenant);

        candidate.setFirstName(
                firstName);

        candidate.setLastName(
                lastName);

        candidate.setEmail(
                email);

        candidate.setPhone(
                normalizeOptional(
                        request.phone()));

        candidate.setLocation(
                normalizeOptional(
                        request.location()));

        candidate.setLinkedinUrl(
                normalizeOptional(
                        request.linkedinUrl()));

        candidate.setPortfolioUrl(
                normalizeOptional(
                        request.portfolioUrl()));

        candidate.setSource(
                CandidateSource.CAREERS_PAGE);

        /*
         * Resume support is Step 21.6.
         */
        candidate.setResumeFileName(null);
        candidate.setResumeUrl(null);

        /*
         * Anonymous applicants cannot set internal notes.
         */
        candidate.setNotes(null);

        Candidate savedCandidate = candidateRepository.save(
                candidate);

        auditService.log(
                AuditAction.CANDIDATE_CREATED,
                "Candidate",
                savedCandidate.getId());

        return savedCandidate;
    }

    /*
     * ---------------------------------------------------------
     * FIND PUBLIC JOB
     * ---------------------------------------------------------
     */

    private Job findPublicJob(
            Tenant tenant,
            String jobSlug) {

        Job job = jobRepository
                .findByTenantIdAndPublicSlugAndPublishedTrueAndStatus(
                        tenant.getId(),
                        normalizeSlug(jobSlug),
                        JobStatus.OPEN)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Job not found"));

        if (!isDeadlineValid(job)) {

            throw new ResourceNotFoundException(
                    "Job not found");
        }

        return job;
    }

    /*
     * ---------------------------------------------------------
     * FIND PUBLIC TENANT
     * ---------------------------------------------------------
     */

    private Tenant findTenant(
            String companySlug) {

        String slug = normalizeSlug(companySlug);

        return tenantRepository
                .findBySlugIgnoreCase(slug)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Careers page not found"));
    }

    /*
     * ---------------------------------------------------------
     * DEADLINE VALIDATION
     * ---------------------------------------------------------
     */

    private boolean isDeadlineValid(
            Job job) {

        LocalDate deadline = job.getApplicationDeadline();

        return deadline == null
                || !deadline.isBefore(
                        LocalDate.now());
    }

    /*
     * ---------------------------------------------------------
     * NORMALIZE REQUIRED VALUE
     * ---------------------------------------------------------
     */

    private String normalizeRequired(
            String value,
            String errorMessage) {

        if (value == null
                || value.isBlank()) {

            throw new IllegalArgumentException(
                    errorMessage);
        }

        return value.trim();
    }

    /*
     * ---------------------------------------------------------
     * NORMALIZE SLUG
     * ---------------------------------------------------------
     */

    private String normalizeSlug(
            String value) {

        if (value == null
                || value.isBlank()) {

            throw new ResourceNotFoundException(
                    "Resource not found");
        }

        return value
                .trim()
                .toLowerCase(Locale.ROOT);
    }

    /*
     * ---------------------------------------------------------
     * JOB -> PUBLIC SUMMARY
     * ---------------------------------------------------------
     */

    private PublicJobSummaryResponse toSummaryResponse(
            Job job) {

        return new PublicJobSummaryResponse(
                job.getTitle(),

                job.getPublicSlug(),

                job.getDepartment() != null
                        ? job.getDepartment().getName()
                        : null,

                job.getTeam() != null
                        ? job.getTeam().getName()
                        : null,

                job.getLocation() != null
                        ? job.getLocation().getName()
                        : null,

                job.getEmploymentType(),

                job.getWorkplaceType(),

                job.getOpenings(),

                job.getApplicationDeadline());
    }

    /*
     * ---------------------------------------------------------
     * JOB -> PUBLIC DETAILS
     * ---------------------------------------------------------
     */

    private PublicJobResponse toJobResponse(
            Job job) {

        return new PublicJobResponse(
                job.getTitle(),

                job.getPublicSlug(),

                job.getDescription(),

                job.getDepartment() != null
                        ? job.getDepartment().getName()
                        : null,

                job.getTeam() != null
                        ? job.getTeam().getName()
                        : null,

                job.getLocation() != null
                        ? job.getLocation().getName()
                        : null,

                job.getEmploymentType(),

                job.getWorkplaceType(),

                job.getOpenings(),

                job.getApplicationDeadline());
    }
}