package com.darmisolutions.darmihire.tenant;

import com.darmisolutions.darmihire.tenant.dto.CreateTenantRequest;
import com.darmisolutions.darmihire.tenant.dto.TenantResponse;
import com.darmisolutions.darmihire.user.User;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TenantService {

        private final TenantRepository tenantRepository;
        private final TenantUserRepository tenantUserRepository;

        @Transactional
        public TenantResponse create(
                        CreateTenantRequest request,
                        User user) {

                String slug = request.slug()
                                .trim()
                                .toLowerCase();

                if (tenantRepository.existsBySlug(slug)) {
                        throw new IllegalArgumentException(
                                        "Workspace slug already exists");
                }

                Tenant tenant = new Tenant();

                tenant.setName(request.name().trim());
                tenant.setSlug(slug);
                tenant.setActive(true);

                tenantRepository.save(tenant);

                TenantUser membership = new TenantUser();

                membership.setTenant(tenant);
                membership.setUser(user);
                membership.setRole(Role.COMPANY_ADMIN);
                membership.setStatus(MembershipStatus.ACTIVE);
                membership.setJoinedAt(Instant.now());

                tenantUserRepository.save(membership);

                return toResponse(tenant);
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
                        Tenant tenant) {

                return new TenantResponse(
                                tenant.getId(),
                                tenant.getName(),
                                tenant.getSlug(),
                                tenant.getLogoUrl(),
                                tenant.isActive());
        }
}