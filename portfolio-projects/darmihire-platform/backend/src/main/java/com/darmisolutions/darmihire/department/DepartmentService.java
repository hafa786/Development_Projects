package com.darmisolutions.darmihire.department;

import com.darmisolutions.darmihire.department.dto.*;
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

    @Transactional(readOnly = true)
    public List<DepartmentResponse> findAll() {

        return departmentRepository
                .findAllByTenantIdOrderByName(
                        tenantContext.getTenantId()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public DepartmentResponse create(
            CreateDepartmentRequest request
    ) {

        authorizationService.require(
                Permission.MANAGE_DEPARTMENTS
        );

        UUID tenantId =
                tenantContext.getTenantId();

        if (departmentRepository
                .existsByTenantIdAndNameIgnoreCase(
                        tenantId,
                        request.name().trim()
                )) {

            throw new IllegalArgumentException(
                    "Department already exists"
            );
        }

        Tenant tenant = tenantRepository
                .findById(tenantId)
                .orElseThrow();

        Department department =
                new Department();

        department.setTenant(tenant);
        department.setName(
                request.name().trim()
        );

        department.setDescription(
                request.description()
        );

        return toResponse(
                departmentRepository.save(department)
        );
    }

    @Transactional
    public DepartmentResponse update(
            UUID id,
            UpdateDepartmentRequest request
    ) {

        authorizationService.require(
                Permission.MANAGE_DEPARTMENTS
        );

        Department department =
                findEntity(id);

        department.setName(
                request.name().trim()
        );

        department.setDescription(
                request.description()
        );

        return toResponse(department);
    }

    @Transactional
    public void delete(UUID id) {

        authorizationService.require(
                Permission.MANAGE_DEPARTMENTS
        );

        departmentRepository.delete(
                findEntity(id)
        );
    }

    private Department findEntity(UUID id) {

        return departmentRepository
                .findByIdAndTenantId(
                        id,
                        tenantContext.getTenantId()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Department not found"
                        )
                );
    }

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