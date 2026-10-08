package com.darmisolutions.darmihire.candidate;

import com.darmisolutions.darmihire.audit.AuditAction;
import com.darmisolutions.darmihire.audit.AuditService;
import com.darmisolutions.darmihire.candidate.dto.CandidateResponse;
import com.darmisolutions.darmihire.candidate.dto.CreateCandidateRequest;
import com.darmisolutions.darmihire.candidate.dto.UpdateCandidateRequest;
import com.darmisolutions.darmihire.exception.ConflictException;
import com.darmisolutions.darmihire.exception.ResourceNotFoundException;
import com.darmisolutions.darmihire.security.AuthorizationService;
import com.darmisolutions.darmihire.security.Permission;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantRepository;
import com.darmisolutions.darmihire.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final TenantRepository tenantRepository;
    private final TenantContext tenantContext;
    private final AuthorizationService authorizationService;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<CandidateResponse> findAll() {
        UUID tenantId = requireTenantId();

        return candidateRepository
            .findAllByTenantIdOrderByCreatedAtDesc(tenantId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public CandidateResponse findById(UUID id) {
        UUID tenantId = requireTenantId();

        return toResponse(findCandidate(id, tenantId));
    }

    @Transactional
    public CandidateResponse create(CreateCandidateRequest request) {
        authorizationService.require(Permission.MANAGE_CANDIDATES);

        UUID tenantId = requireTenantId();

        String firstName = normalizeRequired(request.firstName());
        String lastName = normalizeRequired(request.lastName());
        String email = normalizeEmail(request.email());

        if (candidateRepository.existsByTenantIdAndEmailIgnoreCase(
            tenantId,
            email
        )) {
            throw new ConflictException(
                "A candidate with this email already exists"
            );
        }

        Tenant tenant = tenantRepository
            .findById(tenantId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Tenant not found")
            );

        Candidate candidate = new Candidate();

        candidate.setTenant(tenant);
        candidate.setFirstName(firstName);
        candidate.setLastName(lastName);
        candidate.setEmail(email);
        candidate.setPhone(normalizeOptional(request.phone()));
        candidate.setLocation(normalizeOptional(request.location()));
        candidate.setLinkedinUrl(normalizeOptional(request.linkedinUrl()));
        candidate.setPortfolioUrl(normalizeOptional(request.portfolioUrl()));

        candidate.setSource(
            request.source() != null
                ? request.source()
                : CandidateSource.MANUAL
        );

        candidate.setResumeFileName(
            normalizeOptional(request.resumeFileName())
        );

        candidate.setResumeUrl(
            normalizeOptional(request.resumeUrl())
        );

        candidate.setNotes(
            normalizeOptional(request.notes())
        );

        Candidate savedCandidate =
            candidateRepository.save(candidate);

        auditService.log(
            AuditAction.CANDIDATE_CREATED,
            "Candidate",
            savedCandidate.getId()
        );

        return toResponse(savedCandidate);
    }

    @Transactional
    public CandidateResponse update(
        UUID id,
        UpdateCandidateRequest request
    ) {
        authorizationService.require(Permission.MANAGE_CANDIDATES);

        UUID tenantId = requireTenantId();

        Candidate candidate = findCandidate(id, tenantId);

        String email = normalizeEmail(request.email());

        if (
            candidateRepository
                .existsByTenantIdAndEmailIgnoreCaseAndIdNot(
                    tenantId,
                    email,
                    id
                )
        ) {
            throw new ConflictException(
                "A candidate with this email already exists"
            );
        }

        candidate.setFirstName(
            normalizeRequired(request.firstName())
        );

        candidate.setLastName(
            normalizeRequired(request.lastName())
        );

        candidate.setEmail(email);

        candidate.setPhone(
            normalizeOptional(request.phone())
        );

        candidate.setLocation(
            normalizeOptional(request.location())
        );

        candidate.setLinkedinUrl(
            normalizeOptional(request.linkedinUrl())
        );

        candidate.setPortfolioUrl(
            normalizeOptional(request.portfolioUrl())
        );

        candidate.setSource(
            request.source() != null
                ? request.source()
                : CandidateSource.MANUAL
        );

        candidate.setResumeFileName(
            normalizeOptional(request.resumeFileName())
        );

        candidate.setResumeUrl(
            normalizeOptional(request.resumeUrl())
        );

        candidate.setNotes(
            normalizeOptional(request.notes())
        );

        Candidate savedCandidate =
            candidateRepository.save(candidate);

        auditService.log(
            AuditAction.CANDIDATE_UPDATED,
            "Candidate",
            savedCandidate.getId()
        );

        return toResponse(savedCandidate);
    }

    @Transactional
    public void delete(UUID id) {
        authorizationService.require(Permission.MANAGE_CANDIDATES);

        UUID tenantId = requireTenantId();

        Candidate candidate = findCandidate(id, tenantId);

        candidateRepository.delete(candidate);

        auditService.log(
            AuditAction.CANDIDATE_DELETED,
            "Candidate",
            candidate.getId()
        );
    }

    private Candidate findCandidate(
        UUID candidateId,
        UUID tenantId
    ) {
        return candidateRepository
            .findByIdAndTenantId(candidateId, tenantId)
            .orElseThrow(
                () -> new ResourceNotFoundException(
                    "Candidate not found"
                )
            );
    }

    private UUID requireTenantId() {
        UUID tenantId = tenantContext.getTenantId();

        if (tenantId == null) {
            throw new IllegalStateException(
                "Tenant context is required"
            );
        }

        return tenantId;
    }

    private String normalizeRequired(String value) {
        return value.trim();
    }

    private String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isEmpty()
            ? null
            : normalized;
    }

    private String normalizeEmail(String email) {
        return email
            .trim()
            .toLowerCase(Locale.ROOT);
    }

    private CandidateResponse toResponse(
        Candidate candidate
    ) {
        String fullName =
            candidate.getFirstName()
                + " "
                + candidate.getLastName();

        return new CandidateResponse(
            candidate.getId(),
            candidate.getFirstName(),
            candidate.getLastName(),
            fullName,
            candidate.getEmail(),
            candidate.getPhone(),
            candidate.getLocation(),
            candidate.getLinkedinUrl(),
            candidate.getPortfolioUrl(),
            candidate.getSource(),
            candidate.getResumeFileName(),
            candidate.getResumeUrl(),
            candidate.getNotes(),
            candidate.getCreatedAt(),
            candidate.getUpdatedAt()
        );
    }
}