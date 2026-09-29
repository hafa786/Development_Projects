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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TenantResponse create(
            @Valid @RequestBody CreateTenantRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return tenantService.create(request, user);
    }

    @GetMapping
    public List<TenantResponse> findAll() {
        return tenantService.findAll();
    }

    @GetMapping
    public List<UserTenantResponse> findMine(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return tenantService.findForUser(user.getId());
    }
}