package com.darmisolutions.darmihire.notification.email.provider;

import com.darmisolutions.darmihire.notification.email.EmailMessage;
import com.darmisolutions.darmihire.notification.email.EmailProvider;
import com.darmisolutions.darmihire.notification.email.EmailSendResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class LoggingEmailProvider implements EmailProvider {

  @Override
  public EmailSendResult send(EmailMessage message) {
    log.info("Development email sent to={} subject={}", message.to(), message.subject());

    return EmailSendResult.success(null);
  }
}
