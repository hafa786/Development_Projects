package com.darmisolutions.darmihire.careers;

import com.darmisolutions.darmihire.careers.dto.PublicCareerResponse;
import com.darmisolutions.darmihire.careers.dto.PublicJobResponse;
import com.darmisolutions.darmihire.careers.dto.PublicJobSummaryResponse;
import com.darmisolutions.darmihire.exception.ResourceNotFoundException;
import com.darmisolutions.darmihire.job.Job;
import com.darmisolutions.darmihire.job.JobRepository;
import com.darmisolutions.darmihire.job.JobStatus;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PublicCareersService {

    private final TenantRepository tenantRepository;
    private final JobRepository jobRepository;

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

    /*
     * ---------------------------------------------------------
     * GET PUBLIC JOBS
     * ---------------------------------------------------------
     */

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

        Job job = jobRepository
                .findByTenantIdAndPublicSlugAndPublishedTrueAndStatus(
                        tenant.getId(),
                        normalizeSlug(jobSlug),
                        JobStatus.OPEN)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Job not found"));

        /*
         * An expired job must behave exactly like an
         * unpublished/unavailable job.
         */
        if (!isDeadlineValid(job)) {

            throw new ResourceNotFoundException(
                    "Job not found");
        }

        return toJobResponse(job);
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
     * NORMALIZE PUBLIC SLUG
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