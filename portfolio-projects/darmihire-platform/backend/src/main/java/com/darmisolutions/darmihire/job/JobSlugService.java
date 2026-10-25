package com.darmisolutions.darmihire.job;

import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobSlugService {

  private final JobRepository jobRepository;

  public String generate(UUID tenantId, String title) {

    String baseSlug = slugify(title);

    String slug = baseSlug;
    int suffix = 2;

    while (jobRepository.existsByTenantIdAndPublicSlug(tenantId, slug)) {
      slug = baseSlug + "-" + suffix++;
    }

    return slug;
  }

  private String slugify(String value) {

    String normalized = Normalizer.normalize(value, Normalizer.Form.NFD);

    normalized = normalized.replaceAll("\\p{M}", "");

    normalized =
        normalized.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("^-+|-+$", "");

    if (normalized.isBlank()) {
      return "job";
    }

    if (normalized.length() > 200) {
      normalized = normalized.substring(0, 200);

      normalized = normalized.replaceAll("-+$", "");
    }

    return normalized;
  }
}
