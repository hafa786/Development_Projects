package com.darmisolutions.darmihire.tenant;

import com.darmisolutions.darmihire.tenant.dto.CreateTenantRequest;
import com.darmisolutions.darmihire.tenant.dto.TenantResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;

    @Transactional
    public TenantResponse create(
            CreateTenantRequest request
    ) {

        String slug = request.slug()
                .trim()
                .toLowerCase();

        if (tenantRepository.existsBySlug(slug)) {
            throw new IllegalArgumentException(
                    "Workspace slug already exists"
            );
        }

        Tenant tenant = new Tenant();

        tenant.setName(request.name().trim());
        tenant.setSlug(slug);
        tenant.setActive(true);

        Tenant savedTenant =
                tenantRepository.save(tenant);

        return toResponse(savedTenant);
    }

    @Transactional(readOnly = true)
    public List<TenantResponse> findAll() {

        return tenantRepository
                .findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private TenantResponse toResponse(
            Tenant tenant
    ) {

        return new TenantResponse(
                tenant.getId(),
                tenant.getName(),
                tenant.getSlug(),
                tenant.getLogoUrl(),
                tenant.isActive()
        );
    }
}