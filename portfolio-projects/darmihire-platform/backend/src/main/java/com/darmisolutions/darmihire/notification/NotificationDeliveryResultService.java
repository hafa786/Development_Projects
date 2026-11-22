package com.darmisolutions.darmihire.notification;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationDeliveryResultService {

  private static final int MAX_ATTEMPTS = 5;

  private final NotificationRepository notificationRepository;

  @Transactional
  public void markSent(UUID notificationId, String providerMessageId) {

    Notification notification = notificationRepository.findById(notificationId).orElseThrow();

    if (notification.getStatus() != NotificationStatus.PROCESSING) {
      return;
    }

    notification.setStatus(NotificationStatus.SENT);

    notification.setProviderMessageId(normalize(providerMessageId));

    notification.setSentAt(Instant.now());

    notification.setFailureReason(null);
    notification.setFailedAt(null);
    notification.setNextAttemptAt(null);

    notificationRepository.save(notification);
  }

  @Transactional
  public void markFailure(UUID notificationId, String failureReason) {

    Notification notification = notificationRepository.findById(notificationId).orElseThrow();

    if (notification.getStatus() != NotificationStatus.PROCESSING) {
      return;
    }

    notification.setFailureReason(truncate(failureReason));

    if (notification.getAttemptCount() >= MAX_ATTEMPTS) {

      notification.setStatus(NotificationStatus.FAILED);

      notification.setFailedAt(Instant.now());

      notification.setNextAttemptAt(null);

    } else {

      notification.setStatus(NotificationStatus.PENDING);

      notification.setNextAttemptAt(calculateNextAttempt(notification.getAttemptCount()));
    }

    notificationRepository.save(notification);
  }

  private Instant calculateNextAttempt(int attemptCount) {

    Duration delay =
        switch (attemptCount) {
          case 1 -> Duration.ofMinutes(1);
          case 2 -> Duration.ofMinutes(5);
          case 3 -> Duration.ofMinutes(15);
          default -> Duration.ofHours(1);
        };

    return Instant.now().plus(delay);
  }

  private String truncate(String value) {

    if (value == null || value.isBlank()) {
      return "Unknown email delivery failure";
    }

    String normalized = value.trim();

    return normalized.length() <= 1000 ? normalized : normalized.substring(0, 1000);
  }

  private String normalize(String value) {

    if (value == null) {
      return null;
    }

    String normalized = value.trim();

    return normalized.isBlank() ? null : normalized;
  }
}
