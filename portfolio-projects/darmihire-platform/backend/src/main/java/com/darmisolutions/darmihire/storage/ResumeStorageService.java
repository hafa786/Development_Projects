package com.darmisolutions.darmihire.storage;

import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeStorageService {

  StoredResume store(UUID tenantId, UUID candidateId, MultipartFile file);

  record StoredResume(String originalFileName, String storageKey, String contentType, long size) {}

  StoredResumeResource load(String storageKey);

  record StoredResumeResource(
      org.springframework.core.io.Resource resource, String contentType, long size) {}
}
