package com.darmisolutions.darmihire.member;

import com.darmisolutions.darmihire.member.dto.MemberResponse;
import com.darmisolutions.darmihire.member.dto.UpdateMemberRoleRequest;
import com.darmisolutions.darmihire.member.dto.UpdateMemberStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    /*
     * ---------------------------------------------------------
     * GET WORKSPACE MEMBERS
     * ---------------------------------------------------------
     *
     * GET /api/v1/members
     */

    @GetMapping
    public List<MemberResponse> findAll(
            @RequestHeader("X-Tenant-ID")
            UUID tenantId
    ) {

        return memberService.findAll(
                tenantId
        );
    }

    /*
     * ---------------------------------------------------------
     * GET MEMBER
     * ---------------------------------------------------------
     *
     * GET /api/v1/members/{tenantUserId}
     */

    @GetMapping("/{tenantUserId}")
    public MemberResponse findById(
            @RequestHeader("X-Tenant-ID")
            UUID tenantId,

            @PathVariable
            UUID tenantUserId
    ) {

        return memberService.findById(
                tenantId,
                tenantUserId
        );
    }

    /*
     * ---------------------------------------------------------
     * UPDATE ROLE
     * ---------------------------------------------------------
     *
     * PATCH /api/v1/members/{tenantUserId}/role
     */

    @PatchMapping("/{tenantUserId}/role")
    public MemberResponse updateRole(
            @RequestHeader("X-Tenant-ID")
            UUID tenantId,

            @PathVariable
            UUID tenantUserId,

            @Valid
            @RequestBody
            UpdateMemberRoleRequest request
    ) {

        return memberService.updateRole(
                tenantId,
                tenantUserId,
                request
        );
    }

    /*
     * ---------------------------------------------------------
     * UPDATE STATUS
     * ---------------------------------------------------------
     *
     * PATCH /api/v1/members/{tenantUserId}/status
     */

    @PatchMapping("/{tenantUserId}/status")
    public MemberResponse updateStatus(
            @RequestHeader("X-Tenant-ID")
            UUID tenantId,

            @PathVariable
            UUID tenantUserId,

            @Valid
            @RequestBody
            UpdateMemberStatusRequest request
    ) {

        return memberService.updateStatus(
                tenantId,
                tenantUserId,
                request
        );
    }

    /*
     * ---------------------------------------------------------
     * REMOVE MEMBER
     * ---------------------------------------------------------
     *
     * DELETE /api/v1/members/{tenantUserId}
     */

    @DeleteMapping("/{tenantUserId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(
            @RequestHeader("X-Tenant-ID")
            UUID tenantId,

            @PathVariable
            UUID tenantUserId
    ) {

        memberService.remove(
                tenantId,
                tenantUserId
        );
    }
}