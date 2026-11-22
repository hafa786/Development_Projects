package com.darmisolutions.darmihire.notification.worker;

import com.darmisolutions.darmihire.notification.Notification;
import com.darmisolutions.darmihire.notification.NotificationDeliveryService;
import com.darmisolutions.darmihire.notification.NotificationRepository;
import com.darmisolutions.darmihire.notification.NotificationStatus;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class NotificationDeliveryWorker {

  private final NotificationRepository notificationRepository;
  private final NotificationDeliveryService deliveryService;

  @Scheduled(fixedDelayString = "${darmihire.notification.worker-delay-ms:5000}")
  public void processPendingNotifications() {

    List<UUID> notificationIds =
        notificationRepository
            .findReadyForDelivery(NotificationStatus.PENDING, Instant.now(), PageRequest.of(0, 50))
            .stream()
            .map(Notification::getId)
            .toList();

    notificationIds.forEach(deliveryService::deliver);
  }

  @Scheduled(fixedDelayString = "${darmihire.notification.recovery-delay-ms:60000}")
  @Transactional
  public void recoverStuckNotifications() {

    Instant threshold = Instant.now().minus(Duration.ofMinutes(10));

    List<Notification> stuck =
        notificationRepository.findStuckNotifications(NotificationStatus.PROCESSING, threshold);

    for (Notification notification : stuck) {

      notification.setStatus(NotificationStatus.PENDING);

      notification.setNextAttemptAt(Instant.now());
    }

    notificationRepository.saveAll(stuck);
  }
}
