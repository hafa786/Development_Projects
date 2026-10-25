package com.darmisolutions.darmihire.storage;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class LocalResumeStorageService implements ResumeStorageService {

  private static final long MAX_FILE_SIZE = 5L * 1024L * 1024L;

  private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "doc", "docx");

  private static final Set<String> ALLOWED_CONTENT_TYPES =
      Set.of(
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

  private final ResumeStorageProperties properties;

  @Override
  public StoredResume store(UUID tenantId, UUID candidateId, MultipartFile file) {
    validateIdentifiers(tenantId, candidateId);

    validateFile(file);

    String originalFileName = sanitizeOriginalFileName(file.getOriginalFilename());

    String extension = getExtension(originalFileName);

    String generatedFileName = UUID.randomUUID() + "." + extension;

    Path root = getStorageRoot();

    Path candidateDirectory =
        root.resolve(tenantId.toString()).resolve(candidateId.toString()).normalize();

    ensureInsideRoot(root, candidateDirectory);

    Path destination = candidateDirectory.resolve(generatedFileName).normalize();

    ensureInsideRoot(root, destination);

    try {
      Files.createDirectories(candidateDirectory);

      try (InputStream inputStream = file.getInputStream()) {

        Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
      }

    } catch (IOException exception) {
      throw new IllegalStateException("Failed to store resume", exception);
    }

    String storageKey = tenantId + "/" + candidateId + "/" + generatedFileName;

    return new StoredResume(
        originalFileName, storageKey, normalizeContentType(file.getContentType()), file.getSize());
  }

  private void validateIdentifiers(UUID tenantId, UUID candidateId) {
    if (tenantId == null) {
      throw new IllegalArgumentException("Tenant ID is required");
    }

    if (candidateId == null) {
      throw new IllegalArgumentException("Candidate ID is required");
    }
  }

  private void validateFile(MultipartFile file) {
    if (file == null || file.isEmpty()) {

      throw new IllegalArgumentException("Resume file is required");
    }

    if (file.getSize() > MAX_FILE_SIZE) {
      throw new IllegalArgumentException("Resume file must not exceed 5 MB");
    }

    String originalFileName = sanitizeOriginalFileName(file.getOriginalFilename());

    String extension = getExtension(originalFileName);

    if (!ALLOWED_EXTENSIONS.contains(extension)) {
      throw new IllegalArgumentException("Resume must be a PDF, DOC or DOCX file");
    }

    String contentType = normalizeContentType(file.getContentType());

    if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
      throw new IllegalArgumentException("Unsupported resume content type");
    }

    /*
     * Require the MIME type and extension to agree.
     *
     * MIME headers are still client-controlled, so this
     * is only one layer of validation. We can introduce
     * content-signature scanning later as part of the
     * hardened upload/security work.
     */
    if (!matchesContentType(extension, contentType)) {
      throw new IllegalArgumentException("Resume file extension does not match its content type");
    }
  }

  private boolean matchesContentType(String extension, String contentType) {
    return switch (extension) {
      case "pdf" -> contentType.equals("application/pdf");

      case "doc" -> contentType.equals("application/msword");

      case "docx" ->
          contentType.equals(
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

      default -> false;
    };
  }

  private String sanitizeOriginalFileName(String fileName) {
    if (fileName == null || fileName.isBlank()) {

      throw new IllegalArgumentException("Resume file name is required");
    }

    /*
     * Remove any client-supplied directory path.
     */
    String normalized = fileName.replace('\\', '/');

    String safeFileName = normalized.substring(normalized.lastIndexOf('/') + 1);

    if (safeFileName.isBlank()) {
      throw new IllegalArgumentException("Invalid resume file name");
    }

    return safeFileName;
  }

  private String getExtension(String fileName) {
    int dotIndex = fileName.lastIndexOf('.');

    if (dotIndex <= 0 || dotIndex == fileName.length() - 1) {

      throw new IllegalArgumentException("Resume must have a valid file extension");
    }

    return fileName.substring(dotIndex + 1).toLowerCase(Locale.ROOT);
  }

  private String normalizeContentType(String contentType) {
    if (contentType == null) {
      return "";
    }

    return contentType.trim().toLowerCase(Locale.ROOT);
  }

  private Path getStorageRoot() {
    String configuredLocation = properties.location();

    if (configuredLocation == null || configuredLocation.isBlank()) {

      throw new IllegalStateException("Resume storage location is not configured");
    }

    return Path.of(configuredLocation).toAbsolutePath().normalize();
  }

  private void ensureInsideRoot(Path root, Path path) {
    if (!path.startsWith(root)) {
      throw new IllegalStateException("Invalid resume storage path");
    }
  }

  @Override
  public StoredResumeResource load(String storageKey) {
    if (storageKey == null || storageKey.isBlank()) {

      throw new IllegalArgumentException("Resume storage key is required");
    }

    Path root = getStorageRoot();

    Path file = root.resolve(storageKey).normalize();

    ensureInsideRoot(root, file);

    try {
      if (!Files.exists(file) || !Files.isRegularFile(file)) {

        throw new IllegalStateException("Resume file not found");
      }

      Resource resource = new UrlResource(file.toUri());

      String contentType = Files.probeContentType(file);

      if (contentType == null) {
        contentType = "application/octet-stream";
      }

      return new StoredResumeResource(resource, contentType, Files.size(file));

    } catch (IOException exception) {
      throw new IllegalStateException("Failed to load resume", exception);
    }
  }
}
