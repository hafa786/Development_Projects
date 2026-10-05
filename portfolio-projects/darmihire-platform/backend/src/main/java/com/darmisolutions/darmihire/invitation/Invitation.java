package com.darmisolutions.darmihire.invitation;

import com.darmisolutions.darmihire.common.entity.BaseEntity;
import com.darmisolutions.darmihire.tenant.Role;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(
        name = "invitations",
        indexes = {
                @Index(
                        name = "idx_invitations_tenant",
                        columnList = "tenant_id"
                ),
                @Index(
                        name = "idx_invitations_email",
                        columnList = "email"
                ),
                @Index(
                        name = "idx_invitations_status",
                        columnList = "status"
                )
        },
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_invitations_token_hash",
                        columnNames = "token_hash"
                )
        }
)
@Getter
@Setter
public class Invitation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "tenant_id",
            nullable = false
    )
    private Tenant tenant;

    @Column(
            nullable = false,
            length = 320
    )
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 50
    )
    private Role role;

    @Column(
            name = "token_hash",
            nullable = false,
            length = 64
    )
    private String tokenHash;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    private InvitationStatus status =
            InvitationStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "invited_by",
            nullable = false
    )
    private User invitedBy;

    @Column(
            name = "expires_at",
            nullable = false
    )
    private Instant expiresAt;

    @Column(name = "accepted_at")
    private Instant acceptedAt;
}