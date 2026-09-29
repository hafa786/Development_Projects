package com.darmisolutions.darmihire.team;

import com.darmisolutions.darmihire.audit.AuditAction;
import com.darmisolutions.darmihire.audit.AuditService;
import com.darmisolutions.darmihire.security.AuthorizationService;
import com.darmisolutions.darmihire.security.Permission;
import com.darmisolutions.darmihire.team.dto.AddTeamMemberRequest;
import com.darmisolutions.darmihire.team.dto.CreateTeamRequest;
import com.darmisolutions.darmihire.team.dto.TeamResponse;
import com.darmisolutions.darmihire.team.dto.UpdateTeamRequest;
import com.darmisolutions.darmihire.tenant.MembershipStatus;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantRepository;
import com.darmisolutions.darmihire.tenant.TenantUser;
import com.darmisolutions.darmihire.tenant.TenantUserRepository;
import com.darmisolutions.darmihire.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.darmisolutions.darmihire.exception.ConflictException;
import com.darmisolutions.darmihire.exception.ResourceNotFoundException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    private final TeamMemberRepository teamMemberRepository;

    private final TenantRepository tenantRepository;

    private final TenantUserRepository tenantUserRepository;

    private final TenantContext tenantContext;

    private final AuthorizationService authorizationService;

    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<TeamResponse> findAll() {

        UUID tenantId =
                requireTenantId();

        return teamRepository
                .findAllByTenantIdOrderByName(
                        tenantId
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TeamResponse findById(
            UUID id
    ) {

        return toResponse(
                findTeam(id)
        );
    }

    @Transactional
    public TeamResponse create(
            CreateTeamRequest request
    ) {

        authorizationService.require(
                Permission.MANAGE_TEAMS
        );

        UUID tenantId =
                requireTenantId();

        String name =
                request.name().trim();

        if (teamRepository
                .existsByTenantIdAndNameIgnoreCase(
                        tenantId,
                        name
                )) {

            throw new ConflictException(
                    "Team already exists"
            );
        }

        Tenant tenant =
                tenantRepository
                        .findById(tenantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Tenant not found")
                        );

        Team team =
                new Team();

        team.setTenant(tenant);

        team.setName(name);

        team.setDescription(
                normalizeNullable(
                        request.description()
                )
        );

        Team savedTeam =
                teamRepository.save(team);

        auditService.log(
                AuditAction.TEAM_CREATED,
                "Team",
                savedTeam.getId()
        );

        return toResponse(
                savedTeam
        );
    }

    @Transactional
    public TeamResponse update(
            UUID id,
            UpdateTeamRequest request
    ) {

        authorizationService.require(
                Permission.MANAGE_TEAMS
        );

        UUID tenantId =
                requireTenantId();

        Team team =
                findTeam(id);

        String newName =
                request.name().trim();

        if (!team.getName()
                .equalsIgnoreCase(newName)
                &&
                teamRepository
                        .existsByTenantIdAndNameIgnoreCase(
                                tenantId,
                                newName
                        )) {

            throw new ConflictException(
                    "Team already exists"
            );
        }

        team.setName(newName);

        team.setDescription(
                normalizeNullable(
                        request.description()
                )
        );

        Team savedTeam =
                teamRepository.save(team);

        auditService.log(
                AuditAction.TEAM_UPDATED,
                "Team",
                savedTeam.getId()
        );

        return toResponse(
                savedTeam
        );
    }

    @Transactional
    public void delete(
            UUID id
    ) {

        authorizationService.require(
                Permission.MANAGE_TEAMS
        );

        Team team =
                findTeam(id);

        UUID teamId =
                team.getId();

        teamRepository.delete(team);

        auditService.log(
                AuditAction.TEAM_DELETED,
                "Team",
                teamId
        );
    }

    @Transactional
    public void addMember(
            UUID teamId,
            AddTeamMemberRequest request
    ) {

        authorizationService.require(
                Permission.MANAGE_TEAMS
        );

        UUID tenantId =
                requireTenantId();

        Team team =
                findTeam(teamId);

        TenantUser tenantUser =
                tenantUserRepository
                        .findByIdAndTenantId(
                                request.tenantUserId(),
                                tenantId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Tenant user not found")
                        );

        if (tenantUser.getStatus()
                != MembershipStatus.ACTIVE) {

            throw new ConflictException(
                    "Only active workspace members can be added to a team"
            );
        }

        if (teamMemberRepository
                .existsByTeamIdAndTenantUserId(
                        teamId,
                        tenantUser.getId()
                )) {

            throw new ConflictException(
                    "User is already a member of this team"
            );
        }

        TeamMember teamMember =
                new TeamMember();

        teamMember.setTeam(team);

        teamMember.setTenantUser(
                tenantUser
        );

        teamMemberRepository.save(
                teamMember
        );

        auditService.log(
                AuditAction.TEAM_MEMBER_ADDED,
                "Team",
                team.getId()
        );
    }

    @Transactional
    public void removeMember(
            UUID teamId,
            UUID tenantUserId
    ) {

        authorizationService.require(
                Permission.MANAGE_TEAMS
        );

        UUID tenantId =
                requireTenantId();

        Team team =
                findTeam(teamId);

        TenantUser tenantUser =
                tenantUserRepository
                        .findByIdAndTenantId(
                                tenantUserId,
                                tenantId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Tenant user not found")
                        );

        TeamMember teamMember =
                teamMemberRepository
                        .findByTeamIdAndTenantUserId(
                                team.getId(),
                                tenantUser.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Team member not found")
                        );

        teamMemberRepository.delete(
                teamMember
        );

        auditService.log(
                AuditAction.TEAM_MEMBER_REMOVED,
                "Team",
                team.getId()
        );
    }

    private Team findTeam(
            UUID id
    ) {

        return teamRepository
                .findByIdAndTenantId(
                        id,
                        requireTenantId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Team not found")
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

    private TeamResponse toResponse(
            Team team
    ) {

        return new TeamResponse(
                team.getId(),
                team.getName(),
                team.getDescription()
        );
    }
}