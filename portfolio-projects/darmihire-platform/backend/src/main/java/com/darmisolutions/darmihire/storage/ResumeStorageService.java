package com.darmisolutions.darmihire.storage;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface ResumeStorageService {

    StoredResume store(
            UUID tenantId,
            UUID candidateId,
            MultipartFile file);

    record StoredResume(
            String originalFileName,
            String storageKey,
            String contentType,
            long size) {
    }

    StoredResumeResource load(
            String storageKey);

    record StoredResumeResource(
            org.springframework.core.io.Resource resource,
            String contentType,
            long size) {
    }
}