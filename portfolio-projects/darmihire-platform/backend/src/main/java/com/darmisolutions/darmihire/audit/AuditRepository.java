package com.darmisolutions.darmihire.audit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AuditRepository
        extends JpaRepository<AuditLog, UUID> {

    List<AuditLog>
    findAllByTenantIdOrderByCreatedAtDesc(
            UUID tenantId
    );

    List<AuditLog>
    findAllByTenantIdAndUserIdOrderByCreatedAtDesc(
            UUID tenantId,
            UUID userId
    );

    List<AuditLog>
    findAllByTenantIdAndActionOrderByCreatedAtDesc(
            UUID tenantId,
            AuditAction action
    );
}