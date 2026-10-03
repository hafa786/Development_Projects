package com.darmisolutions.darmihire.audit;

import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "tenant_id",
            nullable = false
    )
    private Tenant tenant;

    /**
     * Null is allowed for system-generated audit events.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "action",
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

    /**
     * PostgreSQL JSONB metadata.
     *
     * JdbcTypeCode is important here. Without it Hibernate treats
     * String as VARCHAR, which PostgreSQL cannot automatically insert
     * into a JSONB column.
     */
    @JdbcTypeCode(SqlTypes.JSON)
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