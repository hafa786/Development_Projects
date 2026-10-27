package com.darmisolutions.darmihire.notification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

  Optional<Notification> findByIdAndTenantId(UUID id, UUID tenantId);

  List<Notification> findAllByTenantIdOrderByCreatedAtDesc(UUID tenantId);

  List<Notification> findAllByTenantIdAndStatusOrderByCreatedAtAsc(
      UUID tenantId, NotificationStatus status);

  List<Notification> findAllByTenantIdAndRelatedEntityTypeAndRelatedEntityIdOrderByCreatedAtDesc(
      UUID tenantId, String relatedEntityType, UUID relatedEntityId);
}
