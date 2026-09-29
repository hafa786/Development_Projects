package com.darmisolutions.darmihire.department;

import com.darmisolutions.darmihire.audit.AuditAction;
import com.darmisolutions.darmihire.audit.AuditService;
import com.darmisolutions.darmihire.department.dto.CreateDepartmentRequest;
import com.darmisolutions.darmihire.department.dto.DepartmentResponse;
import com.darmisolutions.darmihire.department.dto.UpdateDepartmentRequest;
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

        UUID tenantId =
                requireTenantId();

        return departmentRepository
                .findAllByTenantIdOrderByName(
                        tenantId
                )
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
            UUID id
    ) {

        return toResponse(
                findDepartment(id)
        );
    }

    /*
     * ---------------------------------------------------------
     * CREATE
     * ---------------------------------------------------------
     */

    @Transactional
    public DepartmentResponse create(
            CreateDepartmentRequest request
    ) {

        authorizationService.require(
                Permission.MANAGE_DEPARTMENTS
        );

        UUID tenantId =
                requireTenantId();

        String name =
                request.name().trim();

        if (departmentRepository
                .existsByTenantIdAndNameIgnoreCase(
                        tenantId,
                        name
                )) {

            throw new IllegalArgumentException(
                    "Department already exists"
            );
        }

        Tenant tenant =
                tenantRepository
                        .findById(tenantId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Tenant not found"
                                )
                        );

        Department department =
                new Department();

        department.setTenant(tenant);

        department.setName(name);

        department.setDescription(
                normalizeNullable(
                        request.description()
                )
        );

        Department savedDepartment =
                departmentRepository.save(
                        department
                );

        auditService.log(
                AuditAction.DEPARTMENT_CREATED,
                "Department",
                savedDepartment.getId()
        );

        return toResponse(
                savedDepartment
        );
    }

    /*
     * ---------------------------------------------------------
     * UPDATE
     * ---------------------------------------------------------
     */

    @Transactional
    public DepartmentResponse update(
            UUID id,
            UpdateDepartmentRequest request
    ) {

        authorizationService.require(
                Permission.MANAGE_DEPARTMENTS
        );

        UUID tenantId =
                requireTenantId();

        Department department =
                findDepartment(id);

        String newName =
                request.name().trim();

        if (!department
                .getName()
                .equalsIgnoreCase(newName)
                &&
                departmentRepository
                        .existsByTenantIdAndNameIgnoreCase(
                                tenantId,
                                newName
                        )) {

            throw new IllegalArgumentException(
                    "Department already exists"
            );
        }

        department.setName(
                newName
        );

        department.setDescription(
                normalizeNullable(
                        request.description()
                )
        );

        Department savedDepartment =
                departmentRepository.save(
                        department
                );

        auditService.log(
                AuditAction.DEPARTMENT_UPDATED,
                "Department",
                savedDepartment.getId()
        );

        return toResponse(
                savedDepartment
        );
    }

    /*
     * ---------------------------------------------------------
     * DELETE
     * ---------------------------------------------------------
     */

    @Transactional
    public void delete(
            UUID id
    ) {

        authorizationService.require(
                Permission.MANAGE_DEPARTMENTS
        );

        Department department =
                findDepartment(id);

        UUID departmentId =
                department.getId();

        departmentRepository.delete(
                department
        );

        auditService.log(
                AuditAction.DEPARTMENT_DELETED,
                "Department",
                departmentId
        );
    }

    /*
     * ---------------------------------------------------------
     * FIND TENANT-SCOPED DEPARTMENT
     * ---------------------------------------------------------
     */

    private Department findDepartment(
            UUID id
    ) {

        UUID tenantId =
                requireTenantId();

        return departmentRepository
                .findByIdAndTenantId(
                        id,
                        tenantId
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Department not found"
                        )
                );
    }

    /*
     * ---------------------------------------------------------
     * REQUIRE TENANT
     * ---------------------------------------------------------
     */

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

    /*
     * ---------------------------------------------------------
     * NORMALIZE OPTIONAL TEXT
     * ---------------------------------------------------------
     */

    private String normalizeNullable(
            String value
    ) {

        if (value == null) {
            return null;
        }

        String trimmed =
                value.trim();

        return trimmed.isEmpty()
                ? null
                : trimmed;
    }

    /*
     * ---------------------------------------------------------
     * ENTITY → RESPONSE
     * ---------------------------------------------------------
     */

    private DepartmentResponse toResponse(
            Department department
    ) {

        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription()
        );
    }
}