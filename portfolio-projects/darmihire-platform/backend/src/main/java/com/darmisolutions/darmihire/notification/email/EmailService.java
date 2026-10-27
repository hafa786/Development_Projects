package com.darmisolutions.darmihire.notification.email;

import com.darmisolutions.darmihire.notification.Notification;
import com.darmisolutions.darmihire.notification.NotificationService;
import com.darmisolutions.darmihire.notification.NotificationType;
import com.darmisolutions.darmihire.tenant.Tenant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

  private final EmailProvider emailProvider;
  private final NotificationService notificationService;

  public Notification send(
      Tenant tenant,
      NotificationType type,
      String recipient,
      String subject,
      String htmlBody,
      String textBody,
      String relatedEntityType,
      UUID relatedEntityId) {
    Notification notification =
        notificationService.createEmailNotification(
            tenant, type, recipient, subject, relatedEntityType, relatedEntityId);

    notificationService.markProcessing(notification);

    EmailMessage message = new EmailMessage(recipient, subject, htmlBody, textBody);

    try {
      EmailSendResult result = emailProvider.send(message);

      if (result.success()) {
        notificationService.markSent(notification, result.providerMessageId());
      } else {
        notificationService.markFailed(notification, result.failureReason());
      }

    } catch (Exception exception) {

      notificationService.markFailed(notification, exception.getMessage());
    }

    return notification;
  }
}
