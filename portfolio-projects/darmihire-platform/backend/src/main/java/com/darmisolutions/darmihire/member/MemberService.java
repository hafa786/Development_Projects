package com.darmisolutions.darmihire.member;

import com.darmisolutions.darmihire.member.dto.MemberResponse;
import com.darmisolutions.darmihire.member.dto.UpdateMemberRoleRequest;
import com.darmisolutions.darmihire.member.dto.UpdateMemberStatusRequest;
import com.darmisolutions.darmihire.tenant.Role;
import com.darmisolutions.darmihire.tenant.TenantUser;
import com.darmisolutions.darmihire.tenant.TenantUserRepository;
import com.darmisolutions.darmihire.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final TenantUserRepository tenantUserRepository;

    /*
     * ---------------------------------------------------------
     * FIND ALL WORKSPACE MEMBERS
     * ---------------------------------------------------------
     */

    @Transactional(readOnly = true)
    public List<MemberResponse> findAll(
            UUID tenantId
    ) {

        return tenantUserRepository
                .findAllByTenantId(tenantId)
                .stream()
                .sorted(
                        Comparator.comparing(
                                member ->
                                        member.getUser()
                                                .getFirstName(),
                                String.CASE_INSENSITIVE_ORDER
                        )
                )
                .map(this::toResponse)
                .toList();
    }

    /*
     * ---------------------------------------------------------
     * FIND MEMBER
     * ---------------------------------------------------------
     */

    @Transactional(readOnly = true)
    public MemberResponse findById(
            UUID tenantId,
            UUID tenantUserId
    ) {

        TenantUser member =
                findMember(
                        tenantId,
                        tenantUserId
                );

        return toResponse(member);
    }

    /*
     * ---------------------------------------------------------
     * UPDATE ROLE
     * ---------------------------------------------------------
     */

    @Transactional
    public MemberResponse updateRole(
            UUID tenantId,
            UUID tenantUserId,
            UpdateMemberRoleRequest request
    ) {

        TenantUser member =
                findMember(
                        tenantId,
                        tenantUserId
                );

        member.setRole(
                request.role()
        );

        TenantUser saved =
                tenantUserRepository.save(member);

        return toResponse(saved);
    }

    /*
     * ---------------------------------------------------------
     * UPDATE STATUS
     * ---------------------------------------------------------
     */

    @Transactional
    public MemberResponse updateStatus(
            UUID tenantId,
            UUID tenantUserId,
            UpdateMemberStatusRequest request
    ) {

        TenantUser member =
                findMember(
                        tenantId,
                        tenantUserId
                );

        member.setStatus(
                request.status()
        );

        TenantUser saved =
                tenantUserRepository.save(member);

        return toResponse(saved);
    }

    /*
     * ---------------------------------------------------------
     * REMOVE MEMBER
     * ---------------------------------------------------------
     */

    @Transactional
    public void remove(
            UUID tenantId,
            UUID tenantUserId
    ) {

        TenantUser member =
                findMember(
                        tenantId,
                        tenantUserId
                );

        tenantUserRepository.delete(member);
    }

    /*
     * ---------------------------------------------------------
     * TENANT SAFE LOOKUP
     * ---------------------------------------------------------
     */

    private TenantUser findMember(
            UUID tenantId,
            UUID tenantUserId
    ) {

        return tenantUserRepository
                .findByIdAndTenantId(
                        tenantUserId,
                        tenantId
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Workspace member not found"
                        )
                );
    }

    /*
     * ---------------------------------------------------------
     * RESPONSE MAPPING
     * ---------------------------------------------------------
     */

    private MemberResponse toResponse(
            TenantUser member
    ) {

        User user = member.getUser();

        return new MemberResponse(
                member.getId(),
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                member.getRole(),
                member.getStatus(),
                member.getJoinedAt(),
                user.isActive()
        );
    }
}