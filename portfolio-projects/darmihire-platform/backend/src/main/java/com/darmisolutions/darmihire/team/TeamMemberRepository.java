package com.darmisolutions.darmihire.team;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamMemberRepository
        extends JpaRepository<TeamMember, UUID> {

    List<TeamMember> findAllByTeamId(
            UUID teamId
    );

    Optional<TeamMember>
    findByTeamIdAndTenantUserId(
            UUID teamId,
            UUID tenantUserId
    );

    boolean existsByTeamIdAndTenantUserId(
            UUID teamId,
            UUID tenantUserId
    );
}