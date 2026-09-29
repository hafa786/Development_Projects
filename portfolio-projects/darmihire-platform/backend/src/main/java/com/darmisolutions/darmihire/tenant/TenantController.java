package com.darmisolutions.darmihire.tenant;

import com.darmisolutions.darmihire.tenant.dto.CreateTenantRequest;
import com.darmisolutions.darmihire.tenant.dto.TenantResponse;
import com.darmisolutions.darmihire.tenant.dto.UserTenantResponse;
import com.darmisolutions.darmihire.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    /*
     * ---------------------------------------------------------
     * CREATE WORKSPACE
     * ---------------------------------------------------------
     *
     * POST /api/v1/tenants
     *
     * The authenticated user automatically becomes
     * COMPANY_ADMIN of the newly created workspace.
     */

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TenantResponse create(
            @Valid @RequestBody CreateTenantRequest request,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return tenantService.create(
                request,
                user
        );
    }

    /*
     * ---------------------------------------------------------
     * GET MY WORKSPACES
     * ---------------------------------------------------------
     *
     * GET /api/v1/tenants
     *
     * IMPORTANT:
     *
     * We intentionally DO NOT expose a findAll()
     * endpoint here.
     *
     * A user must only see workspaces where they
     * have an active membership.
     */

    @GetMapping
    public List<UserTenantResponse> findMine(
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return tenantService.findForUser(
                user.getId()
        );
    }
}