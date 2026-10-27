package com.darmisolutions.darmihire.notification.email;

public record EmailMessage(String to, String subject, String htmlBody, String textBody) {

  public EmailMessage {
    if (to == null || to.isBlank()) {
      throw new IllegalArgumentException("Email recipient is required");
    }

    if (subject == null || subject.isBlank()) {
      throw new IllegalArgumentException("Email subject is required");
    }

    if ((htmlBody == null || htmlBody.isBlank()) && (textBody == null || textBody.isBlank())) {
      throw new IllegalArgumentException("Email body is required");
    }
  }
}
