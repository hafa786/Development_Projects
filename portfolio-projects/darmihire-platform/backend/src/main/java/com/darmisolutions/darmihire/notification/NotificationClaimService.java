package com.darmisolutions.darmihire.notification;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationClaimService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public Optional<Notification> claim(UUID notificationId) {

        Notification notification =
                notificationRepository
                        .findByIdForUpdate(notificationId)
                        .orElse(null);

        if (notification == null
                || notification.getStatus()
                        != NotificationStatus.PENDING) {

            return Optional.empty();
        }

        notification.setStatus(
                NotificationStatus.PROCESSING);

        notification.setAttemptCount(
                notification.getAttemptCount() + 1);

        notification.setLastAttemptAt(
                Instant.now());

        notificationRepository.save(notification);

        return Optional.of(notification);
    }
}