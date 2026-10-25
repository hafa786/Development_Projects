package com.darmisolutions.darmihire.scorecard;

import com.darmisolutions.darmihire.audit.AuditAction;
import com.darmisolutions.darmihire.audit.AuditService;
import com.darmisolutions.darmihire.exception.ConflictException;
import com.darmisolutions.darmihire.exception.ResourceNotFoundException;
import com.darmisolutions.darmihire.scorecard.dto.*;
import com.darmisolutions.darmihire.security.AuthorizationService;
import com.darmisolutions.darmihire.security.Permission;
import com.darmisolutions.darmihire.tenant.*;
import com.darmisolutions.darmihire.tenant.TenantRepository;
import com.darmisolutions.darmihire.tenant.context.TenantContext;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ScorecardTemplateService {

  private final InterviewScorecardTemplateRepository templateRepository;

  private final ScorecardCriterionRepository criterionRepository;

  private final InterviewFeedbackRepository feedbackRepository;

  private final TenantRepository tenantRepository;

  private final TenantContext tenantContext;

  private final AuthorizationService authorizationService;

  private final AuditService auditService;

  /*
   * ---------------------------------------------------------
   * READ
   * ---------------------------------------------------------
   */

  @Transactional(readOnly = true)
  public List<ScorecardTemplateResponse> findAll() {

    authorizationService.require(Permission.MANAGE_SCORECARDS);

    UUID tenantId = requireTenantId();

    return templateRepository.findAllByTenantIdOrderByNameAsc(tenantId).stream()
        .map(template -> toResponse(template, tenantId))
        .toList();
  }

  @Transactional(readOnly = true)
  public List<ScorecardTemplateResponse> findActive() {

    authorizationService.require(Permission.MANAGE_SCORECARDS);

    UUID tenantId = requireTenantId();

    return templateRepository.findAllByTenantIdAndActiveTrueOrderByNameAsc(tenantId).stream()
        .map(template -> toResponse(template, tenantId))
        .toList();
  }

  @Transactional(readOnly = true)
  public ScorecardTemplateResponse findById(UUID templateId) {

    authorizationService.require(Permission.MANAGE_SCORECARDS);

    UUID tenantId = requireTenantId();

    InterviewScorecardTemplate template = requireTemplate(templateId, tenantId);

    return toResponse(template, tenantId);
  }

  /*
   * ---------------------------------------------------------
   * CREATE TEMPLATE
   * ---------------------------------------------------------
   */

  @Transactional
  public ScorecardTemplateResponse create(CreateScorecardTemplateRequest request) {

    authorizationService.require(Permission.MANAGE_SCORECARDS);

    UUID tenantId = requireTenantId();

    String name = request.name().trim();

    if (templateRepository.existsByTenantIdAndNameIgnoreCase(tenantId, name)) {
      throw new ConflictException("A scorecard template with this name already exists");
    }

    Tenant tenant =
        tenantRepository
            .findById(tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));

    InterviewScorecardTemplate template = new InterviewScorecardTemplate();

    template.setTenant(tenant);
    template.setName(name);

    template.setDescription(trimToNull(request.description()));

    template.setActive(true);

    InterviewScorecardTemplate saved = templateRepository.save(template);

    if (request.criteria() != null) {

      for (CreateScorecardCriterionRequest criterionRequest : request.criteria()) {
        createCriterionInternal(saved, criterionRequest, false);
      }
    }

    auditService.log(
        AuditAction.SCORECARD_TEMPLATE_CREATED, "InterviewScorecardTemplate", saved.getId());

    return toResponse(saved, tenantId);
  }

  /*
   * ---------------------------------------------------------
   * UPDATE TEMPLATE
   * ---------------------------------------------------------
   */

  @Transactional
  public ScorecardTemplateResponse update(UUID templateId, UpdateScorecardTemplateRequest request) {

    authorizationService.require(Permission.MANAGE_SCORECARDS);

    UUID tenantId = requireTenantId();

    InterviewScorecardTemplate template = requireTemplate(templateId, tenantId);

    requireStructurallyEditable(templateId, tenantId);

    String name = request.name().trim();

    if (templateRepository.existsByTenantIdAndNameIgnoreCaseAndIdNot(tenantId, name, templateId)) {
      throw new ConflictException("A scorecard template with this name already exists");
    }

    template.setName(name);

    template.setDescription(trimToNull(request.description()));

    InterviewScorecardTemplate saved = templateRepository.save(template);

    auditService.log(
        AuditAction.SCORECARD_TEMPLATE_UPDATED, "InterviewScorecardTemplate", saved.getId());

    return toResponse(saved, tenantId);
  }

  /*
   * ---------------------------------------------------------
   * DEACTIVATE
   * ---------------------------------------------------------
   */

  @Transactional
  public ScorecardTemplateResponse deactivate(UUID templateId) {

    authorizationService.require(Permission.MANAGE_SCORECARDS);

    UUID tenantId = requireTenantId();

    InterviewScorecardTemplate template = requireTemplate(templateId, tenantId);

    if (!template.isActive()) {
      return toResponse(template, tenantId);
    }

    template.setActive(false);

    InterviewScorecardTemplate saved = templateRepository.save(template);

    auditService.log(
        AuditAction.SCORECARD_TEMPLATE_DEACTIVATED, "InterviewScorecardTemplate", saved.getId());

    return toResponse(saved, tenantId);
  }

  /*
   * ---------------------------------------------------------
   * ACTIVATE
   * ---------------------------------------------------------
   */

  @Transactional
  public ScorecardTemplateResponse activate(UUID templateId) {

    authorizationService.require(Permission.MANAGE_SCORECARDS);

    UUID tenantId = requireTenantId();

    InterviewScorecardTemplate template = requireTemplate(templateId, tenantId);

    if (template.isActive()) {
      return toResponse(template, tenantId);
    }

    template.setActive(true);

    InterviewScorecardTemplate saved = templateRepository.save(template);

    auditService.log(
        AuditAction.SCORECARD_TEMPLATE_UPDATED, "InterviewScorecardTemplate", saved.getId());

    return toResponse(saved, tenantId);
  }

  /*
   * ---------------------------------------------------------
   * CREATE CRITERION
   * ---------------------------------------------------------
   */

  @Transactional
  public ScorecardTemplateResponse addCriterion(
      UUID templateId, CreateScorecardCriterionRequest request) {

    authorizationService.require(Permission.MANAGE_SCORECARDS);

    UUID tenantId = requireTenantId();

    InterviewScorecardTemplate template = requireTemplate(templateId, tenantId);

    requireStructurallyEditable(templateId, tenantId);

    createCriterionInternal(template, request, true);

    return toResponse(template, tenantId);
  }

  private ScorecardCriterion createCriterionInternal(
      InterviewScorecardTemplate template, CreateScorecardCriterionRequest request, boolean audit) {

    UUID tenantId = requireTenantId();

    String name = request.name().trim();

    if (criterionRepository.existsByTenantIdAndTemplateIdAndNameIgnoreCase(
        tenantId, template.getId(), name)) {
      throw new ConflictException("A criterion with this name already exists in the template");
    }

    ScorecardCriterion criterion = new ScorecardCriterion();

    criterion.setTenant(template.getTenant());

    criterion.setTemplate(template);

    criterion.setName(name);

    criterion.setDescription(trimToNull(request.description()));

    criterion.setSortOrder(request.sortOrder());

    criterion.setRequired(request.required());

    criterion.setWeight(request.weight());

    ScorecardCriterion saved = criterionRepository.save(criterion);

    if (audit) {

      auditService.log(
          AuditAction.SCORECARD_CRITERION_CREATED, "ScorecardCriterion", saved.getId());
    }

    return saved;
  }

  /*
   * ---------------------------------------------------------
   * UPDATE CRITERION
   * ---------------------------------------------------------
   */

  @Transactional
  public ScorecardTemplateResponse updateCriterion(
      UUID templateId, UUID criterionId, UpdateScorecardCriterionRequest request) {

    authorizationService.require(Permission.MANAGE_SCORECARDS);

    UUID tenantId = requireTenantId();

    InterviewScorecardTemplate template = requireTemplate(templateId, tenantId);

    requireStructurallyEditable(templateId, tenantId);

    ScorecardCriterion criterion = requireCriterion(criterionId, tenantId);

    if (!criterion.getTemplate().getId().equals(templateId)) {
      throw new ResourceNotFoundException("Criterion not found in this template");
    }

    String name = request.name().trim();

    List<ScorecardCriterion> criteria =
        criterionRepository.findAllByTenantIdAndTemplateIdOrderBySortOrderAsc(tenantId, templateId);

    boolean duplicate =
        criteria.stream()
            .anyMatch(
                existing ->
                    !existing.getId().equals(criterionId)
                        && existing.getName().equalsIgnoreCase(name));

    if (duplicate) {
      throw new ConflictException("A criterion with this name already exists in the template");
    }

    criterion.setName(name);

    criterion.setDescription(trimToNull(request.description()));

    criterion.setSortOrder(request.sortOrder());

    criterion.setRequired(request.required());

    criterion.setWeight(request.weight());

    ScorecardCriterion saved = criterionRepository.save(criterion);

    auditService.log(AuditAction.SCORECARD_CRITERION_UPDATED, "ScorecardCriterion", saved.getId());

    return toResponse(template, tenantId);
  }

  /*
   * ---------------------------------------------------------
   * DELETE CRITERION
   * ---------------------------------------------------------
   */

  @Transactional
  public ScorecardTemplateResponse deleteCriterion(UUID templateId, UUID criterionId) {

    authorizationService.require(Permission.MANAGE_SCORECARDS);

    UUID tenantId = requireTenantId();

    InterviewScorecardTemplate template = requireTemplate(templateId, tenantId);

    requireStructurallyEditable(templateId, tenantId);

    ScorecardCriterion criterion = requireCriterion(criterionId, tenantId);

    if (!criterion.getTemplate().getId().equals(templateId)) {
      throw new ResourceNotFoundException("Criterion not found in this template");
    }

    criterionRepository.delete(criterion);

    auditService.log(AuditAction.SCORECARD_CRITERION_DELETED, "ScorecardCriterion", criterionId);

    return toResponse(template, tenantId);
  }

  /*
   * ---------------------------------------------------------
   * HISTORICAL PROTECTION
   * ---------------------------------------------------------
   */

  private void requireStructurallyEditable(UUID templateId, UUID tenantId) {

    boolean hasSubmittedFeedback =
        feedbackRepository.existsByTenantIdAndTemplateIdAndSubmittedAtIsNotNull(
            tenantId, templateId);

    if (hasSubmittedFeedback) {

      throw new ConflictException(
          "This scorecard template has submitted interview feedback and can no longer be structurally modified. Deactivate it and create a new template instead.");
    }
  }

  /*
   * ---------------------------------------------------------
   * RESPONSE
   * ---------------------------------------------------------
   */

  private ScorecardTemplateResponse toResponse(InterviewScorecardTemplate template, UUID tenantId) {

    List<ScorecardCriterionResponse> criteria =
        criterionRepository
            .findAllByTenantIdAndTemplateIdOrderBySortOrderAsc(tenantId, template.getId())
            .stream()
            .map(this::toCriterionResponse)
            .toList();

    return new ScorecardTemplateResponse(
        template.getId(),
        template.getName(),
        template.getDescription(),
        template.isActive(),
        criteria,
        template.getCreatedAt(),
        template.getUpdatedAt());
  }

  private ScorecardCriterionResponse toCriterionResponse(ScorecardCriterion criterion) {

    return new ScorecardCriterionResponse(
        criterion.getId(),
        criterion.getName(),
        criterion.getDescription(),
        criterion.getSortOrder(),
        criterion.isRequired(),
        criterion.getWeight(),
        criterion.getCreatedAt(),
        criterion.getUpdatedAt());
  }

  /*
   * ---------------------------------------------------------
   * LOOKUPS
   * ---------------------------------------------------------
   */

  private InterviewScorecardTemplate requireTemplate(UUID templateId, UUID tenantId) {

    return templateRepository
        .findByIdAndTenantId(templateId, tenantId)
        .orElseThrow(() -> new ResourceNotFoundException("Scorecard template not found"));
  }

  private ScorecardCriterion requireCriterion(UUID criterionId, UUID tenantId) {

    return criterionRepository
        .findByIdAndTenantId(criterionId, tenantId)
        .orElseThrow(() -> new ResourceNotFoundException("Scorecard criterion not found"));
  }

  private UUID requireTenantId() {

    UUID tenantId = tenantContext.getTenantId();

    if (tenantId == null) {

      throw new IllegalStateException("Tenant context is required");
    }

    return tenantId;
  }

  private String trimToNull(String value) {

    if (value == null) {
      return null;
    }

    String trimmed = value.trim();

    return trimmed.isEmpty() ? null : trimmed;
  }
}
