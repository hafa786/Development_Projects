package com.darmisolutions.darmihire.notification;

import com.darmisolutions.darmihire.notification.email.EmailSendResult;
import com.darmisolutions.darmihire.notification.email.handler.EmailNotificationHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationDispatcher {

  private final EmailNotificationHandler emailNotificationHandler;

  public EmailSendResult dispatch(Notification notification) {

    return switch (notification.getChannel()) {
      case EMAIL -> emailNotificationHandler.handle(notification);
    };
  }
}
