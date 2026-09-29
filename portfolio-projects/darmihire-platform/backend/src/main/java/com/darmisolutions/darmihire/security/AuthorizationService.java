package com.darmisolutions.darmihire.security;

import com.darmisolutions.darmihire.tenant.Role;
import com.darmisolutions.darmihire.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthorizationService {

    private final TenantContext tenantContext;

    public boolean hasPermission(
            Permission permission
    ) {

        Role role =
                tenantContext.getRole();

        if (role == null) {
            return false;
        }

        return switch (role) {

            case COMPANY_ADMIN -> true;

            case RECRUITER ->
                    permission
                            == Permission.MANAGE_USERS
                    ||
                    permission
                            == Permission.MANAGE_TEAMS;

            case HIRING_MANAGER,
                 INTERVIEWER,
                 VIEWER -> false;
        };
    }

    public void require(
            Permission permission
    ) {

        if (!hasPermission(permission)) {

            throw new SecurityException(
                    "Permission denied: "
                            + permission
            );
        }
    }
}