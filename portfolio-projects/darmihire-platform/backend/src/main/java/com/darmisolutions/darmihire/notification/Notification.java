package com.darmisolutions.darmihire.notification;

import com.darmisolutions.darmihire.tenant.Tenant;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "notifications",
    indexes = {
      @Index(name = "idx_notifications_tenant_created", columnList = "tenant_id, created_at"),
      @Index(name = "idx_notifications_tenant_status", columnList = "tenant_id, status"),
      @Index(
          name = "idx_notifications_related_entity",
          columnList = "tenant_id, related_entity_type, related_entity_id")
    })
@Getter
@Setter
@NoArgsConstructor
public class Notification {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "tenant_id", nullable = false)
  private Tenant tenant;

  @Enumerated(EnumType.STRING)
  @Column(name = "channel", nullable = false, length = 30)
  private NotificationChannel channel;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false, length = 60)
  private NotificationType type;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 30)
  private NotificationStatus status;

  @Column(name = "recipient", nullable = false, length = 320)
  private String recipient;

  @Column(name = "subject", nullable = false, length = 500)
  private String subject;

  @Column(name = "related_entity_type", length = 100)
  private String relatedEntityType;

  @Column(name = "related_entity_id")
  private UUID relatedEntityId;

  @Column(name = "provider_message_id", length = 500)
  private String providerMessageId;

  @Column(name = "failure_reason", length = 1000)
  private String failureReason;

  @Column(name = "sent_at")
  private Instant sentAt;

  @Column(name = "failed_at")
  private Instant failedAt;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @PrePersist
  void prePersist() {
    Instant now = Instant.now();

    createdAt = now;
    updatedAt = now;

    if (status == null) {
      status = NotificationStatus.PENDING;
    }
  }

  @PreUpdate
  void preUpdate() {
    updatedAt = Instant.now();
  }
}
