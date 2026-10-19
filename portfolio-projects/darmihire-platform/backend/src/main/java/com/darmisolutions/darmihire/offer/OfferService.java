package com.darmisolutions.darmihire.offer;

import com.darmisolutions.darmihire.application.JobApplication;
import com.darmisolutions.darmihire.application.JobApplicationRepository;
import com.darmisolutions.darmihire.audit.AuditAction;
import com.darmisolutions.darmihire.audit.AuditService;
import com.darmisolutions.darmihire.offer.dto.CreateOfferRequest;
import com.darmisolutions.darmihire.offer.dto.OfferResponse;
import com.darmisolutions.darmihire.offer.dto.UpdateOfferRequest;
import com.darmisolutions.darmihire.security.AuthorizationService;
import com.darmisolutions.darmihire.security.Permission;
import com.darmisolutions.darmihire.tenant.TenantUser;
import com.darmisolutions.darmihire.tenant.TenantUserRepository;
import com.darmisolutions.darmihire.tenant.context.TenantContext;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;

    private final JobApplicationRepository
            applicationRepository;

    private final TenantUserRepository
            tenantUserRepository;

    private final TenantContext tenantContext;

    private final AuthorizationService
            authorizationService;

    private final AuditService auditService;

    /*
     * ------------------------------------------------
     * READ
     * ------------------------------------------------
     */

    @Transactional(readOnly = true)
    public List<OfferResponse> findAll() {

        authorizationService.require(
                Permission.MANAGE_OFFERS
        );

        UUID tenantId = requireTenantId();

        return offerRepository
                .findAllByTenantIdOrderByCreatedAtDesc(
                        tenantId
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OfferResponse findById(
            UUID offerId
    ) {

        authorizationService.require(
                Permission.MANAGE_OFFERS
        );

        UUID tenantId = requireTenantId();

        Offer offer =
                findOffer(
                        tenantId,
                        offerId
                );

        return toResponse(offer);
    }

    @Transactional(readOnly = true)
    public List<OfferResponse> findByApplication(
            UUID applicationId
    ) {

        authorizationService.require(
                Permission.MANAGE_OFFERS
        );

        UUID tenantId = requireTenantId();

        /*
         * Validate that the application itself
         * belongs to this tenant.
         */
        findApplication(
                tenantId,
                applicationId
        );

        return offerRepository
                .findAllByTenantIdAndApplicationIdOrderByCreatedAtDesc(
                        tenantId,
                        applicationId
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /*
     * ------------------------------------------------
     * CREATE
     * ------------------------------------------------
     */

    @Transactional
    public OfferResponse create(
            CreateOfferRequest request
    ) {

        authorizationService.require(
                Permission.MANAGE_OFFERS
        );

        UUID tenantId = requireTenantId();

        JobApplication application =
                findApplication(
                        tenantId,
                        request.applicationId()
                );

        TenantUser currentUser =
                requireCurrentTenantUser(
                        tenantId
                );

        validateDates(
                request.startDate(),
                request.expirationDate()
        );

        Offer offer = new Offer();

        /*
         * Tenant comes from the trusted,
         * tenant-scoped application.
         */
        offer.setTenant(
                application.getTenant()
        );

        offer.setApplication(
                application
        );

        /*
         * Never accept status from client.
         */
        offer.setStatus(
                OfferStatus.DRAFT
        );

        offer.setSalary(
                request.salary()
        );

        offer.setCurrency(
                normalizeCurrency(
                        request.currency()
                )
        );

        offer.setSalaryPeriod(
                request.salaryPeriod()
        );

        offer.setEmploymentType(
                request.employmentType()
        );

        offer.setStartDate(
                request.startDate()
        );

        offer.setExpirationDate(
                request.expirationDate()
        );

        offer.setProbationPeriod(
                normalizeNullable(
                        request.probationPeriod()
                )
        );

        offer.setBenefits(
                normalizeNullable(
                        request.benefits()
                )
        );

        offer.setAdditionalTerms(
                normalizeNullable(
                        request.additionalTerms()
                )
        );

        offer.setCreatedBy(
                currentUser
        );

        Offer saved =
                offerRepository.save(
                        offer
                );

        auditService.log(
                AuditAction.OFFER_CREATED,
                "Offer",
                saved.getId()
        );

        return toResponse(saved);
    }

    /*
     * ------------------------------------------------
     * UPDATE
     * ------------------------------------------------
     */

    @Transactional
    public OfferResponse update(
            UUID offerId,
            UpdateOfferRequest request
    ) {

        authorizationService.require(
                Permission.MANAGE_OFFERS
        );

        UUID tenantId = requireTenantId();

        Offer offer =
                findOffer(
                        tenantId,
                        offerId
                );

        requireDraft(offer);

        validateDates(
                request.startDate(),
                request.expirationDate()
        );

        offer.setSalary(
                request.salary()
        );

        offer.setCurrency(
                normalizeCurrency(
                        request.currency()
                )
        );

        offer.setSalaryPeriod(
                request.salaryPeriod()
        );

        offer.setEmploymentType(
                request.employmentType()
        );

        offer.setStartDate(
                request.startDate()
        );

        offer.setExpirationDate(
                request.expirationDate()
        );

        offer.setProbationPeriod(
                normalizeNullable(
                        request.probationPeriod()
                )
        );

        offer.setBenefits(
                normalizeNullable(
                        request.benefits()
                )
        );

        offer.setAdditionalTerms(
                normalizeNullable(
                        request.additionalTerms()
                )
        );

        Offer saved =
                offerRepository.save(
                        offer
                );

        auditService.log(
                AuditAction.OFFER_UPDATED,
                "Offer",
                saved.getId()
        );

        return toResponse(saved);
    }

    /*
     * ------------------------------------------------
     * DELETE
     * ------------------------------------------------
     */

    @Transactional
    public void delete(
            UUID offerId
    ) {

        authorizationService.require(
                Permission.MANAGE_OFFERS
        );

        UUID tenantId = requireTenantId();

        Offer offer =
                findOffer(
                        tenantId,
                        offerId
                );

        requireDraft(offer);

        UUID id = offer.getId();

        offerRepository.delete(offer);

        auditService.log(
                AuditAction.OFFER_DELETED,
                "Offer",
                id
        );
    }

    /*
     * ------------------------------------------------
     * LOOKUPS
     * ------------------------------------------------
     */

    private Offer findOffer(
            UUID tenantId,
            UUID offerId
    ) {

        return offerRepository
                .findByIdAndTenantId(
                        offerId,
                        tenantId
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Offer not found"
                        )
                );
    }

    private JobApplication findApplication(
            UUID tenantId,
            UUID applicationId
    ) {

        return applicationRepository
                .findByIdAndTenantId(
                        applicationId,
                        tenantId
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Application not found"
                        )
                );
    }

    private TenantUser requireCurrentTenantUser(
            UUID tenantId
    ) {

        UUID userId =
                tenantContext.getUserId();

        if (userId == null) {
            throw new IllegalStateException(
                    "Authenticated user context is required"
            );
        }

        return tenantUserRepository
                .findByTenantIdAndUserId(
                        tenantId,
                        userId
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Current user is not a member of this tenant"
                        )
                );
    }

    /*
     * ------------------------------------------------
     * VALIDATION
     * ------------------------------------------------
     */

    private void requireDraft(
            Offer offer
    ) {

        if (offer.getStatus()
                != OfferStatus.DRAFT) {

            throw new IllegalStateException(
                    "Only draft offers can be modified"
            );
        }
    }

    private void validateDates(
            LocalDate startDate,
            LocalDate expirationDate
    ) {

        if (
                startDate != null
                        && expirationDate != null
                        && expirationDate
                        .isAfter(startDate)
        ) {

            throw new IllegalArgumentException(
                    "Offer expiration date cannot be after the employment start date"
            );
        }
    }

    private String normalizeCurrency(
            String currency
    ) {

        String normalized =
                currency
                        .trim()
                        .toUpperCase(
                                Locale.ROOT
                        );

        if (normalized.length() != 3) {
            throw new IllegalArgumentException(
                    "Currency must be a 3-letter code"
            );
        }

        /*
         * ISO-style alphabetic validation.
         */
        if (!normalized.matches("[A-Z]{3}")) {
            throw new IllegalArgumentException(
                    "Currency must contain exactly 3 letters"
            );
        }

        return normalized;
    }

    private String normalizeNullable(
            String value
    ) {

        if (value == null) {
            return null;
        }

        String normalized =
                value.trim();

        return normalized.isEmpty()
                ? null
                : normalized;
    }

    /*
     * ------------------------------------------------
     * MAPPER
     * ------------------------------------------------
     */

    private OfferResponse toResponse(
            Offer offer
    ) {

        JobApplication application =
                offer.getApplication();

        var candidate =
                application.getCandidate();

        var job =
                application.getJob();

        TenantUser createdBy =
                offer.getCreatedBy();

        TenantUser approvedBy =
                offer.getApprovedBy();

        return new OfferResponse(
                offer.getId(),

                application.getId(),

                candidate.getId(),

                buildCandidateName(
                        candidate.getFirstName(),
                        candidate.getLastName()
                ),

                job.getId(),

                job.getTitle(),

                offer.getStatus(),

                offer.getSalary(),

                offer.getCurrency(),

                offer.getSalaryPeriod(),

                offer.getEmploymentType(),

                offer.getStartDate(),

                offer.getExpirationDate(),

                offer.getProbationPeriod(),

                offer.getBenefits(),

                offer.getAdditionalTerms(),

                createdBy != null
                        ? createdBy.getId()
                        : null,

                createdBy != null
                        ? tenantUserName(createdBy)
                        : null,

                approvedBy != null
                        ? approvedBy.getId()
                        : null,

                approvedBy != null
                        ? tenantUserName(approvedBy)
                        : null,

                offer.getSubmittedForApprovalAt(),

                offer.getApprovedAt(),

                offer.getRejectedAt(),

                offer.getSentAt(),

                offer.getAcceptedAt(),

                offer.getDeclinedAt(),

                offer.getWithdrawnAt(),

                offer.getRejectionReason(),

                offer.getDeclineReason(),

                offer.getWithdrawalReason(),

                offer.getCreatedAt(),

                offer.getUpdatedAt()
        );
    }

    private String buildCandidateName(
            String firstName,
            String lastName
    ) {

        return (
                safe(firstName)
                        + " "
                        + safe(lastName)
        ).trim();
    }

    private String tenantUserName(
            TenantUser tenantUser
    ) {

        var user =
                tenantUser.getUser();

        return (
                safe(user.getFirstName())
                        + " "
                        + safe(user.getLastName())
        ).trim();
    }

    private String safe(
            String value
    ) {

        return value == null
                ? ""
                : value;
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