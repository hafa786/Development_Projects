package com.darmisolutions.darmihire.notification.email.handler;

import com.darmisolutions.darmihire.notification.Notification;
import com.darmisolutions.darmihire.notification.email.EmailMessage;
import com.darmisolutions.darmihire.notification.email.EmailNotificationFactory;
import com.darmisolutions.darmihire.notification.email.EmailProvider;
import com.darmisolutions.darmihire.notification.email.EmailSendResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailNotificationHandler {

  private final EmailProvider emailProvider;
  private final EmailNotificationFactory emailNotificationFactory;

  public EmailSendResult handle(Notification notification) {

    EmailMessage message = emailNotificationFactory.create(notification);

    return emailProvider.send(message);
  }
}
