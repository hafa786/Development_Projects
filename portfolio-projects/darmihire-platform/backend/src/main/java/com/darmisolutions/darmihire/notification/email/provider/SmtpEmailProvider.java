package com.darmisolutions.darmihire.notification.email.provider;

import com.darmisolutions.darmihire.notification.email.EmailMessage;
import com.darmisolutions.darmihire.notification.email.EmailProvider;
import com.darmisolutions.darmihire.notification.email.EmailSendResult;
import com.darmisolutions.darmihire.notification.email.config.EmailProperties;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "darmihire.email.provider", havingValue = "smtp")
public class SmtpEmailProvider implements EmailProvider {

  private final JavaMailSender mailSender;
  private final EmailProperties properties;

  @Override
  public EmailSendResult send(EmailMessage message) {

    try {
      MimeMessage mimeMessage = mailSender.createMimeMessage();

      MimeMessageHelper helper =
          new MimeMessageHelper(mimeMessage, false, StandardCharsets.UTF_8.name());

      helper.setTo(message.to());
      helper.setSubject(message.subject());

      if (properties.fromName() != null && !properties.fromName().isBlank()) {

        helper.setFrom(properties.fromAddress(), properties.fromName());

      } else {
        helper.setFrom(properties.fromAddress());
      }

      if (properties.replyTo() != null && !properties.replyTo().isBlank()) {

        helper.setReplyTo(properties.replyTo());
      }

      String text = message.textBody() == null ? "" : message.textBody();

      String html = message.htmlBody() == null ? text : message.htmlBody();

      helper.setText(text, html);

      mailSender.send(mimeMessage);

      return EmailSendResult.success(null);

    } catch (Exception exception) {

      return EmailSendResult.failure(safeFailureMessage(exception));
    }
  }

  private String safeFailureMessage(Exception exception) {

    String message = exception.getMessage();

    if (message == null || message.isBlank()) {
      return "SMTP email delivery failed";
    }

    return message.length() <= 1000 ? message : message.substring(0, 1000);
  }
}
