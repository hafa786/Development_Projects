package com.darmisolutions.darmihire.offer;

import com.darmisolutions.darmihire.application.ApplicationStage;
import com.darmisolutions.darmihire.application.ApplicationStatus;
import com.darmisolutions.darmihire.application.JobApplication;
import com.darmisolutions.darmihire.application.JobApplicationRepository;
import com.darmisolutions.darmihire.audit.AuditAction;
import com.darmisolutions.darmihire.audit.AuditService;
import com.darmisolutions.darmihire.offer.dto.CreateOfferRequest;
import com.darmisolutions.darmihire.offer.dto.DeclineOfferRequest;
import com.darmisolutions.darmihire.offer.dto.OfferResponse;
import com.darmisolutions.darmihire.offer.dto.RejectOfferRequest;
import com.darmisolutions.darmihire.offer.dto.UpdateOfferRequest;
import com.darmisolutions.darmihire.offer.dto.WithdrawOfferRequest;
import com.darmisolutions.darmihire.security.AuthorizationService;
import com.darmisolutions.darmihire.security.Permission;
import com.darmisolutions.darmihire.tenant.TenantUser;
import com.darmisolutions.darmihire.tenant.TenantUserRepository;
import com.darmisolutions.darmihire.tenant.context.TenantContext;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
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
     * ==================================================
     * READ
     * ==================================================
     */

    @Transactional(readOnly = true)
    public List<OfferResponse> findAll() {

        requireManageOffers();

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
    public List<OfferResponse> findAllByStatus(
            OfferStatus status
    ) {

        requireManageOffers();

        UUID tenantId = requireTenantId();

        return offerRepository
                .findAllByTenantIdAndStatusOrderByCreatedAtDesc(
                        tenantId,
                        status
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OfferResponse findById(
            UUID offerId
    ) {

        requireManageOffers();

        UUID tenantId = requireTenantId();

        return toResponse(
                findOffer(
                        tenantId,
                        offerId
                )
        );
    }

    @Transactional(readOnly = true)
    public List<OfferResponse> findByApplication(
            UUID applicationId
    ) {

        requireManageOffers();

        UUID tenantId = requireTenantId();

        /*
         * Prevent probing another tenant's
         * application UUID.
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
     * ==================================================
     * CREATE
     * ==================================================
     */

    @Transactional
    public OfferResponse create(
            CreateOfferRequest request
    ) {

        requireManageOffers();

        UUID tenantId = requireTenantId();

        JobApplication application =
                findApplication(
                        tenantId,
                        request.applicationId()
                );

        if (application.getStatus()
                != ApplicationStatus.ACTIVE) {

            throw new IllegalStateException(
                    "Offers can only be created for active applications"
            );
        }

        TenantUser currentUser =
                requireCurrentTenantUser(
                        tenantId
                );

        validateDates(
                request.startDate(),
                request.expirationDate()
        );

        Offer offer = new Offer();

        offer.setTenant(
                application.getTenant()
        );

        offer.setApplication(
                application
        );

        /*
         * Lifecycle status is server-owned.
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

        audit(
                AuditAction.OFFER_CREATED,
                saved
        );

        return toResponse(saved);
    }

    /*
     * ==================================================
     * UPDATE
     * ==================================================
     */

    @Transactional
    public OfferResponse update(
            UUID offerId,
            UpdateOfferRequest request
    ) {

        requireManageOffers();

        UUID tenantId = requireTenantId();

        Offer offer =
                findOffer(
                        tenantId,
                        offerId
                );

        requireStatus(
                offer,
                OfferStatus.DRAFT
        );

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

        audit(
                AuditAction.OFFER_UPDATED,
                saved
        );

        return toResponse(saved);
    }

    /*
     * ==================================================
     * DELETE
     * ==================================================
     */

    @Transactional
    public void delete(
            UUID offerId
    ) {

        requireManageOffers();

        UUID tenantId = requireTenantId();

        Offer offer =
                findOffer(
                        tenantId,
                        offerId
                );

        requireStatus(
                offer,
                OfferStatus.DRAFT
        );

        UUID id = offer.getId();

        offerRepository.delete(
                offer
        );

        auditService.log(
                AuditAction.OFFER_DELETED,
                "Offer",
                id
        );
    }

    /*
     * ==================================================
     * SUBMIT
     * ==================================================
     */

    @Transactional
    public OfferResponse submitForApproval(
            UUID offerId
    ) {

        requireManageOffers();

        UUID tenantId = requireTenantId();

        Offer offer =
                findOffer(
                        tenantId,
                        offerId
                );

        requireStatus(
                offer,
                OfferStatus.DRAFT
        );

        validateForSubmission(
                offer
        );

        offer.setStatus(
                OfferStatus.PENDING_APPROVAL
        );

        offer.setSubmittedForApprovalAt(
                Instant.now()
        );

        Offer saved =
                offerRepository.save(
                        offer
                );

        audit(
                AuditAction
                        .OFFER_SUBMITTED_FOR_APPROVAL,
                saved
        );

        return toResponse(saved);
    }

    /*
     * ==================================================
     * APPROVE
     * ==================================================
     */

    @Transactional
    public OfferResponse approve(
            UUID offerId
    ) {

        authorizationService.require(
                Permission.APPROVE_OFFERS
        );

        UUID tenantId = requireTenantId();

        Offer offer =
                findOffer(
                        tenantId,
                        offerId
                );

        requireStatus(
                offer,
                OfferStatus.PENDING_APPROVAL
        );

        TenantUser currentUser =
                requireCurrentTenantUser(
                        tenantId
                );

        offer.setStatus(
                OfferStatus.APPROVED
        );

        offer.setApprovedBy(
                currentUser
        );

        offer.setApprovedAt(
                Instant.now()
        );

        offer.setRejectedAt(null);
        offer.setRejectionReason(null);

        Offer saved =
                offerRepository.save(
                        offer
                );

        audit(
                AuditAction.OFFER_APPROVED,
                saved
        );

        return toResponse(saved);
    }

    /*
     * ==================================================
     * REJECT
     * ==================================================
     */

    @Transactional
    public OfferResponse reject(
            UUID offerId,
            RejectOfferRequest request
    ) {

        authorizationService.require(
                Permission.APPROVE_OFFERS
        );

        UUID tenantId = requireTenantId();

        Offer offer =
                findOffer(
                        tenantId,
                        offerId
                );

        requireStatus(
                offer,
                OfferStatus.PENDING_APPROVAL
        );

        offer.setStatus(
                OfferStatus.REJECTED
        );

        offer.setRejectedAt(
                Instant.now()
        );

        offer.setRejectionReason(
                request.reason().trim()
        );

        Offer saved =
                offerRepository.save(
                        offer
                );

        audit(
                AuditAction.OFFER_REJECTED,
                saved
        );

        return toResponse(saved);
    }

    /*
     * ==================================================
     * SEND
     * ==================================================
     */

    @Transactional
    public OfferResponse send(
            UUID offerId
    ) {

        requireManageOffers();

        UUID tenantId = requireTenantId();

        Offer offer =
                findOffer(
                        tenantId,
                        offerId
                );

        requireStatus(
                offer,
                OfferStatus.APPROVED
        );

        if (
                offer.getExpirationDate() != null
                        && offer
                        .getExpirationDate()
                        .isBefore(
                                LocalDate.now()
                        )
        ) {

            throw new IllegalStateException(
                    "Expired offer cannot be sent"
            );
        }

        if (
                offer.getApplication()
                        .getStatus()
                        != ApplicationStatus.ACTIVE
        ) {

            throw new IllegalStateException(
                    "Offer application is no longer active"
            );
        }

        offer.setStatus(
                OfferStatus.SENT
        );

        offer.setSentAt(
                Instant.now()
        );

        Offer saved =
                offerRepository.save(
                        offer
                );

        audit(
                AuditAction.OFFER_SENT,
                saved
        );

        return toResponse(saved);
    }

    /*
     * ==================================================
     * ACCEPT + HIRE
     * ==================================================
     */

    @Transactional
    public OfferResponse accept(
            UUID offerId
    ) {

        requireManageOffers();

        UUID tenantId = requireTenantId();

        Offer offer =
                findOffer(
                        tenantId,
                        offerId
                );

        requireStatus(
                offer,
                OfferStatus.SENT
        );

        JobApplication application =
                offer.getApplication();

        if (
                application.getStatus()
                        != ApplicationStatus.ACTIVE
        ) {

            throw new IllegalStateException(
                    "Only an active application can be hired"
            );
        }

        boolean acceptedExists =
                offerRepository
                        .existsByTenantIdAndApplicationIdAndStatus(
                                tenantId,
                                application.getId(),
                                OfferStatus.ACCEPTED
                        );

        if (acceptedExists) {

            throw new IllegalStateException(
                    "Application already has an accepted offer"
            );
        }

        Instant now =
                Instant.now();

        /*
         * Offer acceptance.
         */
        offer.setStatus(
                OfferStatus.ACCEPTED
        );

        offer.setAcceptedAt(now);

        /*
         * Hiring must happen in the same
         * database transaction.
         */
        application.setStatus(
                ApplicationStatus.HIRED
        );

        application.setStage(
                ApplicationStage.HIRED
        );

        application.setHiredAt(now);

        applicationRepository.save(
                application
        );

        /*
         * Withdraw every other SENT offer
         * for this application.
         */
        List<Offer> sentOffers =
                offerRepository
                        .findAllByTenantIdAndApplicationIdAndStatus(
                                tenantId,
                                application.getId(),
                                OfferStatus.SENT
                        );

        for (Offer other :
                sentOffers) {

            if (other.getId()
                    .equals(
                            offer.getId()
                    )) {
                continue;
            }

            other.setStatus(
                    OfferStatus.WITHDRAWN
            );

            other.setWithdrawnAt(now);

            other.setWithdrawalReason(
                    "Another offer for this application was accepted"
            );

            offerRepository.save(
                    other
            );

            audit(
                    AuditAction.OFFER_WITHDRAWN,
                    other
            );
        }

        Offer saved =
                offerRepository.save(
                        offer
                );

        audit(
                AuditAction.OFFER_ACCEPTED,
                saved
        );

        return toResponse(saved);
    }

    /*
     * ==================================================
     * DECLINE
     * ==================================================
     */

    @Transactional
    public OfferResponse decline(
            UUID offerId,
            DeclineOfferRequest request
    ) {

        requireManageOffers();

        UUID tenantId = requireTenantId();

        Offer offer =
                findOffer(
                        tenantId,
                        offerId
                );

        requireStatus(
                offer,
                OfferStatus.SENT
        );

        offer.setStatus(
                OfferStatus.DECLINED
        );

        offer.setDeclinedAt(
                Instant.now()
        );

        offer.setDeclineReason(
                normalizeNullable(
                        request.reason()
                )
        );

        Offer saved =
                offerRepository.save(
                        offer
                );

        audit(
                AuditAction.OFFER_DECLINED,
                saved
        );

        return toResponse(saved);
    }

    /*
     * ==================================================
     * WITHDRAW
     * ==================================================
     */

    @Transactional
    public OfferResponse withdraw(
            UUID offerId,
            WithdrawOfferRequest request
    ) {

        requireManageOffers();

        UUID tenantId = requireTenantId();

        Offer offer =
                findOffer(
                        tenantId,
                        offerId
                );

        if (
                offer.getStatus()
                        != OfferStatus.APPROVED
                        &&
                        offer.getStatus()
                                != OfferStatus.SENT
        ) {

            throw new IllegalStateException(
                    "Only approved or sent offers can be withdrawn"
            );
        }

        offer.setStatus(
                OfferStatus.WITHDRAWN
        );

        offer.setWithdrawnAt(
                Instant.now()
        );

        offer.setWithdrawalReason(
                request.reason().trim()
        );

        Offer saved =
                offerRepository.save(
                        offer
                );

        audit(
                AuditAction.OFFER_WITHDRAWN,
                saved
        );

        return toResponse(saved);
    }

    /*
     * ==================================================
     * VALIDATION
     * ==================================================
     */

    private void validateForSubmission(
            Offer offer
    ) {

        if (offer.getSalary() == null) {
            throw new IllegalStateException(
                    "Salary is required"
            );
        }

        if (offer.getCurrency() == null
                || offer.getCurrency()
                .isBlank()) {

            throw new IllegalStateException(
                    "Currency is required"
            );
        }

        if (offer.getSalaryPeriod() == null) {
            throw new IllegalStateException(
                    "Salary period is required"
            );
        }

        if (offer.getEmploymentType() == null) {
            throw new IllegalStateException(
                    "Employment type is required"
            );
        }

        if (
                offer.getApplication()
                        .getStatus()
                        != ApplicationStatus.ACTIVE
        ) {

            throw new IllegalStateException(
                    "Offer application is no longer active"
            );
        }

        validateDates(
                offer.getStartDate(),
                offer.getExpirationDate()
        );
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
                    "Offer expiration date cannot be after employment start date"
            );
        }
    }

    private void requireStatus(
            Offer offer,
            OfferStatus required
    ) {

        if (offer.getStatus() != required) {

            throw new IllegalStateException(
                    "Offer must be "
                            + required
                            + " but is "
                            + offer.getStatus()
            );
        }
    }

    /*
     * ==================================================
     * LOOKUPS
     * ==================================================
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
     * ==================================================
     * HELPERS
     * ==================================================
     */

    private void requireManageOffers() {

        authorizationService.require(
                Permission.MANAGE_OFFERS
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

    private void audit(
            AuditAction action,
            Offer offer
    ) {

        auditService.log(
                action,
                "Offer",
                offer.getId()
        );
    }

    private String normalizeCurrency(
            String currency
    ) {

        String value =
                currency
                        .trim()
                        .toUpperCase(
                                Locale.ROOT
                        );

        if (!value.matches(
                "[A-Z]{3}"
        )) {

            throw new IllegalArgumentException(
                    "Currency must be a 3-letter code"
            );
        }

        return value;
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
     * ==================================================
     * RESPONSE MAPPER
     * ==================================================
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

                buildName(
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
                        ? tenantUserName(
                                createdBy
                        )
                        : null,

                approvedBy != null
                        ? approvedBy.getId()
                        : null,

                approvedBy != null
                        ? tenantUserName(
                                approvedBy
                        )
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

    private String tenantUserName(
            TenantUser tenantUser
    ) {

        var user =
                tenantUser.getUser();

        return buildName(
                user.getFirstName(),
                user.getLastName()
        );
    }

    private String buildName(
            String firstName,
            String lastName
    ) {

        return (
                safe(firstName)
                        + " "
                        + safe(lastName)
        ).trim();
    }

    private String safe(
            String value
    ) {

        return value == null
                ? ""
                : value;
    }
}