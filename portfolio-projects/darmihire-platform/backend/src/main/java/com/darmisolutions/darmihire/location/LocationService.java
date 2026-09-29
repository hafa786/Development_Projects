package com.darmisolutions.darmihire.location;

import com.darmisolutions.darmihire.audit.AuditAction;
import com.darmisolutions.darmihire.audit.AuditService;
import com.darmisolutions.darmihire.location.dto.CreateLocationRequest;
import com.darmisolutions.darmihire.location.dto.LocationResponse;
import com.darmisolutions.darmihire.location.dto.UpdateLocationRequest;
import com.darmisolutions.darmihire.security.AuthorizationService;
import com.darmisolutions.darmihire.security.Permission;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantRepository;
import com.darmisolutions.darmihire.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.darmisolutions.darmihire.exception.ResourceNotFoundException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    private final TenantRepository tenantRepository;

    private final TenantContext tenantContext;

    private final AuthorizationService authorizationService;

    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<LocationResponse> findAll() {

        UUID tenantId =
                requireTenantId();

        return locationRepository
                .findAllByTenantIdOrderByName(
                        tenantId
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LocationResponse findById(
            UUID id
    ) {

        return toResponse(
                findLocation(id)
        );
    }

    @Transactional
    public LocationResponse create(
            CreateLocationRequest request
    ) {

        authorizationService.require(
                Permission.MANAGE_LOCATIONS
        );

        UUID tenantId =
                requireTenantId();

        Tenant tenant =
                tenantRepository
                        .findById(tenantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Location not found")
                        );

        Location location =
                new Location();

        location.setTenant(tenant);

        applyCreateRequest(
                location,
                request
        );

        Location savedLocation =
                locationRepository.save(
                        location
                );

        auditService.log(
                AuditAction.LOCATION_CREATED,
                "Location",
                savedLocation.getId()
        );

        return toResponse(
                savedLocation
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

        Location location =
                findLocation(id);

        location.setName(
                request.name().trim()
        );

        location.setCity(
                normalizeNullable(
                        request.city()
                )
        );

        location.setCountry(
                normalizeNullable(
                        request.country()
                )
        );

        location.setTimezone(
                normalizeNullable(
                        request.timezone()
                )
        );

        location.setRemote(
                request.remote()
        );

        Location savedLocation =
                locationRepository.save(
                        location
                );

        auditService.log(
                AuditAction.LOCATION_UPDATED,
                "Location",
                savedLocation.getId()
        );

        return toResponse(
                savedLocation
        );
    }

    @Transactional
    public void delete(
            UUID id
    ) {

        authorizationService.require(
                Permission.MANAGE_LOCATIONS
        );

        Location location =
                findLocation(id);

        UUID locationId =
                location.getId();

        locationRepository.delete(
                location
        );

        auditService.log(
                AuditAction.LOCATION_DELETED,
                "Location",
                locationId
        );
    }

    private Location findLocation(
            UUID id
    ) {

        return locationRepository
                .findByIdAndTenantId(
                        id,
                        requireTenantId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Location not found")
                );
    }

    private void applyCreateRequest(
            Location location,
            CreateLocationRequest request
    ) {

        location.setName(
                request.name().trim()
        );

        location.setCity(
                normalizeNullable(
                        request.city()
                )
        );

        location.setCountry(
                normalizeNullable(
                        request.country()
                )
        );

        location.setTimezone(
                normalizeNullable(
                        request.timezone()
                )
        );

        location.setRemote(
                request.remote()
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