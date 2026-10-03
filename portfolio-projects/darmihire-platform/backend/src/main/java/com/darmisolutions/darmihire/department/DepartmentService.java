package com.darmisolutions.darmihire.department;

import com.darmisolutions.darmihire.audit.AuditAction;
import com.darmisolutions.darmihire.audit.AuditService;
import com.darmisolutions.darmihire.department.dto.CreateDepartmentRequest;
import com.darmisolutions.darmihire.department.dto.DepartmentResponse;
import com.darmisolutions.darmihire.department.dto.UpdateDepartmentRequest;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final TenantRepository tenantRepository;
    private final TenantContext tenantContext;
    private final AuthorizationService authorizationService;
    private final AuditService auditService;

    /*
     * ---------------------------------------------------------
     * GET ALL
     * ---------------------------------------------------------
     */

    @Transactional(readOnly = true)
    public List<DepartmentResponse> findAll() {

        UUID tenantId = requireTenantId();

        return departmentRepository
                .findAllByTenantIdOrderByName(
                        tenantId)
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
    public DepartmentResponse findById(
            UUID id) {

        Department department = findDepartment(id);

        return toResponse(
                department);
    }

    /*
     * ---------------------------------------------------------
     * CREATE
     * ---------------------------------------------------------
     */

    @Transactional
    public DepartmentResponse create(
            CreateDepartmentRequest request) {
        authorizationService.require(
                Permission.MANAGE_DEPARTMENTS);

        UUID tenantId = requireTenantId();

        String name = normalizeRequiredName(request.name());

        if (departmentRepository
                .existsByTenantIdAndNameIgnoreCase(
                        tenantId,
                        name)) {

            throw new ConflictException(
                    "Department already exists");
        }

        Tenant tenant = tenantRepository
                .findById(tenantId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Tenant not found"));

        Department department = new Department();

        department.setTenant(tenant);
        department.setName(name);
        department.setDescription(
                normalizeNullable(request.description()));

        Department savedDepartment = departmentRepository.save(department);

        auditService.log(
                AuditAction.DEPARTMENT_CREATED,
                "Department",
                savedDepartment.getId());

        return toResponse(savedDepartment);
    }
    /*
     * ---------------------------------------------------------
     * UPDATE
     * ---------------------------------------------------------
     */

    @Transactional
    public DepartmentResponse update(
            UUID id,
            UpdateDepartmentRequest request) {

        authorizationService.require(
                Permission.MANAGE_DEPARTMENTS);

        UUID tenantId = requireTenantId();

        Department department = findDepartment(id);

        String newName = normalizeRequiredName(
                request.name());

        /*
         * Only perform the duplicate check when the
         * department name is actually changing.
         */
        boolean nameChanged = !department
                .getName()
                .equalsIgnoreCase(
                        newName);

        if (nameChanged
                && departmentRepository
                        .existsByTenantIdAndNameIgnoreCase(
                                tenantId,
                                newName)) {

            throw new ConflictException(
                    "Department already exists");
        }

        department.setName(
                newName);

        department.setDescription(
                normalizeNullable(
                        request.description()));

        Department savedDepartment = departmentRepository.save(
                department);

        auditService.log(
                AuditAction.DEPARTMENT_UPDATED,
                "Department",
                savedDepartment.getId());

        return toResponse(
                savedDepartment);
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
                Permission.MANAGE_DEPARTMENTS);

        Department department = findDepartment(id);

        UUID departmentId = department.getId();

        departmentRepository.delete(
                department);

        auditService.log(
                AuditAction.DEPARTMENT_DELETED,
                "Department",
                departmentId);
    }

    /*
     * ---------------------------------------------------------
     * FIND TENANT-SCOPED DEPARTMENT
     * ---------------------------------------------------------
     */

    private Department findDepartment(
            UUID id) {

        UUID tenantId = requireTenantId();

        return departmentRepository
                .findByIdAndTenantId(
                        id,
                        tenantId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Department not found"));
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
     * NORMALIZE REQUIRED NAME
     * ---------------------------------------------------------
     */

    private String normalizeRequiredName(
            String value) {

        if (value == null) {

            throw new IllegalArgumentException(
                    "Department name is required");
        }

        String trimmed = value.trim();

        if (trimmed.isEmpty()) {

            throw new IllegalArgumentException(
                    "Department name is required");
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

    private DepartmentResponse toResponse(
            Department department) {

        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription());
    }
}