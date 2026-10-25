package com.darmisolutions.darmihire.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "darmihire.storage.resume")
public record ResumeStorageProperties(String location) {}
