package com.darmisolutions.darmihire.location;

import com.darmisolutions.darmihire.location.dto.*;
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
public class LocationService {

    private final LocationRepository repository;
    private final TenantRepository tenantRepository;
    private final TenantContext tenantContext;
    private final AuthorizationService authorizationService;

    @Transactional(readOnly = true)
    public List<LocationResponse> findAll() {

        return repository
                .findAllByTenantIdOrderByName(
                        tenantContext.getTenantId()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public LocationResponse create(
            CreateLocationRequest request
    ) {

        authorizationService.require(
                Permission.MANAGE_LOCATIONS
        );

        Tenant tenant = tenantRepository
                .findById(tenantContext.getTenantId())
                .orElseThrow();

        Location location = new Location();

        location.setTenant(tenant);
        apply(location, request);

        return toResponse(
                repository.save(location)
        );
    }

    @Transactional
    public LocationResponse update(
            UUID id,
            UpdateLocationRequest request
    ) {

        authorizationService.require(
                Permission.MANAGE_LOCATIONS
        );

        Location location = findEntity(id);

        location.setName(request.name().trim());
        location.setCity(request.city());
        location.setCountry(request.country());
        location.setTimezone(request.timezone());
        location.setRemote(request.remote());

        return toResponse(location);
    }

    @Transactional
    public void delete(UUID id) {

        authorizationService.require(
                Permission.MANAGE_LOCATIONS
        );

        repository.delete(findEntity(id));
    }

    private Location findEntity(UUID id) {

        return repository
                .findByIdAndTenantId(
                        id,
                        tenantContext.getTenantId()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Location not found"
                        )
                );
    }

    private void apply(
            Location location,
            CreateLocationRequest request
    ) {

        location.setName(request.name().trim());
        location.setCity(request.city());
        location.setCountry(request.country());
        location.setTimezone(request.timezone());
        location.setRemote(request.remote());
    }

    private LocationResponse toResponse(
            Location location
    ) {

        return new LocationResponse(
                location.getId(),
                location.getName(),
                location.getCity(),
                location.getCountry(),
                location.getTimezone(),
                location.isRemote()
        );
    }
}