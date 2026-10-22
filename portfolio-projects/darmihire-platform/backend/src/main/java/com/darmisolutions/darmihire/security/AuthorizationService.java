package com.darmisolutions.darmihire.security;

import com.darmisolutions.darmihire.exception.ForbiddenException;
import com.darmisolutions.darmihire.tenant.Role;
import com.darmisolutions.darmihire.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthorizationService {

    private final TenantContext tenantContext;

    public boolean hasPermission(
            Permission permission) {

        Role role = tenantContext.getRole();
        if (role == null) {
            return false;
        }

        return switch (role) {

            case COMPANY_ADMIN -> true;

            case RECRUITER ->
                permission == Permission.MANAGE_DEPARTMENTS
                        || permission == Permission.MANAGE_TEAMS
                        || permission == Permission.MANAGE_LOCATIONS
                        || permission == Permission.MANAGE_JOBS
                        || permission == Permission.MANAGE_APPLICATIONS
                        || permission == Permission.MANAGE_INTERVIEWS
                        || permission == Permission.MANAGE_SCORECARDS
                        || permission == Permission.MANAGE_OFFERS
                        || permission == Permission.MANAGE_DEPARTMENTS
                        || permission == Permission.MANAGE_TEAMS
                        || permission == Permission.MANAGE_LOCATIONS
                        || permission == Permission.MANAGE_JOBS;

            case HIRING_MANAGER ->
                permission == Permission.APPROVE_OFFERS;

            case INTERVIEWER,
                    VIEWER ->
                false;
        };
    }

    public void require(
            Permission permission) {

        if (!hasPermission(permission)) {

            throw new ForbiddenException(
                    "Permission denied: " + permission);
        }
    }
}