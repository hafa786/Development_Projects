package com.darmisolutions.darmihire.tenant;

import com.darmisolutions.darmihire.tenant.dto.CreateTenantRequest;
import com.darmisolutions.darmihire.tenant.dto.TenantResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
            @Valid @RequestBody CreateTenantRequest request
    ) {
        return tenantService.create(request);
    }

    @GetMapping
    public List<TenantResponse> findAll() {
        return tenantService.findAll();
    }
}