package com.darmisolutions.darmihire.audit;

import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantRepository;
import com.darmisolutions.darmihire.tenant.context.TenantContext;
import com.darmisolutions.darmihire.user.User;
import com.darmisolutions.darmihire.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditRepository auditRepository;

    private final TenantRepository tenantRepository;

    private final UserRepository userRepository;

    private final TenantContext tenantContext;

    /*
     * ---------------------------------------------------------
     * LOG BASIC AUDIT EVENT
     * ---------------------------------------------------------
     */

    @Transactional
    public void log(
            AuditAction action,
            String entityType,
            UUID entityId
    ) {

        UUID tenantId =
                tenantContext.getTenantId();

        UUID userId =
                tenantContext.getUserId();

        /*
         * Audit logging is tenant-scoped.
         *
         * If there is no active tenant context,
         * there is nothing useful to audit here.
         */
        if (tenantId == null) {
            return;
        }

        Tenant tenant =
                tenantRepository
                        .findById(tenantId)
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Tenant not found while creating audit log"
                                )
                        );

        User user = null;

        if (userId != null) {

            user = userRepository
                    .findById(userId)
                    .orElse(null);
        }

        AuditLog auditLog =
                new AuditLog();

        auditLog.setTenant(tenant);

        auditLog.setUser(user);

        auditLog.setAction(action);

        auditLog.setEntityType(
                entityType
        );

        auditLog.setEntityId(
                entityId
        );

        auditRepository.save(
                auditLog
        );
    }
}