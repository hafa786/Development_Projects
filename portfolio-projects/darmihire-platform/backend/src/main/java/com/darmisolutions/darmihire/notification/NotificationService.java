package com.darmisolutions.darmihire.notification;

import com.darmisolutions.darmihire.tenant.Tenant;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

  private final NotificationRepository notificationRepository;

  @Transactional
  public Notification createEmailNotification(
      Tenant tenant,
      NotificationType type,
      String recipient,
      String subject,
      String relatedEntityType,
      UUID relatedEntityId) {
    Notification notification = new Notification();

    notification.setTenant(tenant);
    notification.setChannel(NotificationChannel.EMAIL);
    notification.setType(type);
    notification.setStatus(NotificationStatus.PENDING);
    notification.setRecipient(recipient.trim());
    notification.setSubject(subject.trim());
    notification.setRelatedEntityType(normalizeOptional(relatedEntityType));
    notification.setRelatedEntityId(relatedEntityId);

    return notificationRepository.save(notification);
  }

  @Transactional
  public void markProcessing(Notification notification) {
    notification.setStatus(NotificationStatus.PROCESSING);

    notification.setFailureReason(null);
    notification.setFailedAt(null);

    notificationRepository.save(notification);
  }

  @Transactional
  public void markSent(Notification notification, String providerMessageId) {
    notification.setStatus(NotificationStatus.SENT);

    notification.setProviderMessageId(normalizeOptional(providerMessageId));

    notification.setSentAt(Instant.now());

    notification.setFailedAt(null);
    notification.setFailureReason(null);

    notificationRepository.save(notification);
  }

  @Transactional
  public void markFailed(Notification notification, String failureReason) {
    notification.setStatus(NotificationStatus.FAILED);

    notification.setFailureReason(truncateFailureReason(failureReason));

    notification.setFailedAt(Instant.now());

    notificationRepository.save(notification);
  }

  private String normalizeOptional(String value) {
    if (value == null) {
      return null;
    }

    String normalized = value.trim();

    return normalized.isEmpty() ? null : normalized;
  }

  private String truncateFailureReason(String value) {
    String normalized = normalizeOptional(value);

    if (normalized == null) {
      return "Unknown email delivery failure";
    }

    int maxLength = 1000;

    return normalized.length() <= maxLength ? normalized : normalized.substring(0, maxLength);
  }
}
