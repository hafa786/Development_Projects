package com.darmisolutions.darmihire.tenant;

import com.darmisolutions.darmihire.common.entity.BaseEntity;
import com.darmisolutions.darmihire.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(
        name = "tenant_users",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_tenant_users",
                        columnNames = {
                                "tenant_id",
                                "user_id"
                        }
                )
        }
)
public class TenantUser extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "tenant_id",
            nullable = false
    )
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private MembershipStatus status;

    @Column(name = "joined_at")
    private Instant joinedAt;
}