package com.darmisolutions.darmihire.notification.dto;

import com.darmisolutions.darmihire.notification.NotificationChannel;
import com.darmisolutions.darmihire.notification.NotificationStatus;
import com.darmisolutions.darmihire.notification.NotificationType;
import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
    UUID id,
    NotificationType type,
    NotificationChannel channel,
    NotificationStatus status,
    String recipient,
    String subject,
    String relatedEntityType,
    UUID relatedEntityId,
    int attemptCount,
    String failureReason,
    Instant sentAt,
    Instant failedAt,
    Instant createdAt) {}
