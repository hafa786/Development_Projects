package com.darmisolutions.darmihire.team;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamRepository
        extends JpaRepository<Team, UUID> {

    List<Team> findAllByTenantIdOrderByName(UUID tenantId);

    Optional<Team> findByIdAndTenantId(
            UUID id,
            UUID tenantId
    );
}