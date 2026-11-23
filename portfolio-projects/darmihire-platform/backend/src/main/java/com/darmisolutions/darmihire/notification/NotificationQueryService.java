package com.darmisolutions.darmihire.notification;

import com.darmisolutions.darmihire.exception.ConflictException;
import com.darmisolutions.darmihire.exception.ResourceNotFoundException;
import com.darmisolutions.darmihire.notification.dto.NotificationResponse;
import com.darmisolutions.darmihire.tenant.context.TenantContext;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationQueryService {

  private final NotificationRepository notificationRepository;
  private final TenantContext tenantContext;

  @Transactional(readOnly = true)
  public List<NotificationResponse> findAll() {

    UUID tenantId = requireTenantId();

    return notificationRepository.findAllByTenantIdOrderByCreatedAtDesc(tenantId).stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public NotificationResponse findById(UUID notificationId) {

    return toResponse(findNotification(notificationId));
  }

  @Transactional
  public NotificationResponse retry(UUID notificationId) {

    Notification notification = findNotification(notificationId);

    if (notification.getStatus() != NotificationStatus.FAILED) {

      throw new ConflictException("Only failed notifications can be retried");
    }

    notification.setStatus(NotificationStatus.PENDING);

    notification.setFailureReason(null);
    notification.setFailedAt(null);
    notification.setNextAttemptAt(Instant.now());

    return toResponse(notificationRepository.save(notification));
  }

  private Notification findNotification(UUID notificationId) {

    UUID tenantId = requireTenantId();

    return notificationRepository
        .findByIdAndTenantId(notificationId, tenantId)
        .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
  }

  private NotificationResponse toResponse(Notification notification) {

    return new NotificationResponse(
        notification.getId(),
        notification.getType(),
        notification.getChannel(),
        notification.getStatus(),
        notification.getRecipient(),
        notification.getSubject(),
        notification.getRelatedEntityType(),
        notification.getRelatedEntityId(),
        notification.getAttemptCount(),
        notification.getFailureReason(),
        notification.getSentAt(),
        notification.getFailedAt(),
        notification.getCreatedAt());
  }

  private UUID requireTenantId() {

    UUID tenantId = tenantContext.getTenantId();

    if (tenantId == null) {
      throw new IllegalStateException("Tenant context is required");
    }

    return tenantId;
  }
}
