package com.darmisolutions.darmihire.notification.email;

public interface EmailProvider {

  EmailSendResult send(EmailMessage message);
}
