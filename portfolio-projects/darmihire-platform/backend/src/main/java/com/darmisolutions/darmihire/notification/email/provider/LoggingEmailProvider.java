package com.darmisolutions.darmihire.notification.email.provider;

import com.darmisolutions.darmihire.notification.email.EmailMessage;
import com.darmisolutions.darmihire.notification.email.EmailProvider;
import com.darmisolutions.darmihire.notification.email.EmailSendResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@ConditionalOnProperty(
    name = "darmihire.email.provider",
    havingValue = "logging",
    matchIfMissing = true)
public class LoggingEmailProvider implements EmailProvider {

  @Override
  public EmailSendResult send(EmailMessage message) {

    log.info("Development email recipient={} subject={}", message.to(), message.subject());

    return EmailSendResult.success(null);
  }
}
