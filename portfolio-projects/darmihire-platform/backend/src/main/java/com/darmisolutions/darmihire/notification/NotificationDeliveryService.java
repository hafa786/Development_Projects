package com.darmisolutions.darmihire.notification;

import com.darmisolutions.darmihire.notification.email.EmailSendResult;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationDeliveryService {

  private final NotificationClaimService claimService;
  private final NotificationDispatcher dispatcher;
  private final NotificationDeliveryResultService resultService;

  public void deliver(UUID notificationId) {

    Notification notification = claimService.claim(notificationId).orElse(null);

    if (notification == null) {
      return;
    }

    try {

      EmailSendResult result = dispatcher.dispatch(notification);

      if (result.success()) {

        resultService.markSent(notificationId, result.providerMessageId());

      } else {

        resultService.markFailure(notificationId, result.failureReason());
      }

    } catch (Exception exception) {

      resultService.markFailure(notificationId, exception.getMessage());
    }
  }
}
