package com.darmisolutions.darmihire.audit;

import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /*
     * Every audit event belongs to a tenant/workspace.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "tenant_id",
            nullable = false
    )
    private Tenant tenant;

    /*
     * User can be null.
     *
     * This is useful for future system-generated events.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 100
    )
    private AuditAction action;

    @Column(
            name = "entity_type",
            length = 100
    )
    private String entityType;

    @Column(name = "entity_id")
    private UUID entityId;

    /*
     * PostgreSQL JSONB.
     *
     * We keep it as String for now.
     * More structured JSON mapping can be added later.
     */
    @Column(
            name = "metadata",
            columnDefinition = "jsonb"
    )
    private String metadata;

    @Column(
            name = "ip_address",
            length = 64
    )
    private String ipAddress;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}