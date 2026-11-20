package com.darmisolutions.darmihire.notification.email.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "darmihire.email")
public record EmailProperties(
    String provider, String fromAddress, String fromName, String replyTo, String frontendUrl) {

  public boolean isSmtp() {
    return "smtp".equalsIgnoreCase(provider);
  }
}
