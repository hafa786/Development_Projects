package com.darmisolutions.darmihire.notification;

import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

  Optional<Notification> findByIdAndTenantId(UUID id, UUID tenantId);

  List<Notification> findAllByTenantIdOrderByCreatedAtDesc(UUID tenantId);

  List<Notification> findAllByTenantIdAndStatusOrderByCreatedAtAsc(
      UUID tenantId, NotificationStatus status);

  List<Notification> findAllByTenantIdAndRelatedEntityTypeAndRelatedEntityIdOrderByCreatedAtDesc(
      UUID tenantId, String relatedEntityType, UUID relatedEntityId);

  @Query(
      """
            select n
            from Notification n
            where n.status = :status
              and (
                    n.nextAttemptAt is null
                    or n.nextAttemptAt <= :now
              )
            order by n.createdAt asc
            """)
  List<Notification> findReadyForDelivery(
      @Param("status") NotificationStatus status, @Param("now") Instant now, Pageable pageable);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      """
            select n
            from Notification n
            where n.id = :id
            """)
  Optional<Notification> findByIdForUpdate(@Param("id") UUID id);

  @Query(
      """
            select n
            from Notification n
            where n.status = :status
              and n.lastAttemptAt < :threshold
            """)
  List<Notification> findStuckNotifications(
      @Param("status") NotificationStatus status, @Param("threshold") Instant threshold);
}
