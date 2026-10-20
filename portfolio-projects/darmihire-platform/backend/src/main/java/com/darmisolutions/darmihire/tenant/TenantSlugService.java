package com.darmisolutions.darmihire.tenant;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class TenantSlugService {

    private final TenantRepository tenantRepository;

    public String generate(
            String companyName) {

        String baseSlug = slugify(companyName);

        String slug = baseSlug;

        int suffix = 2;

        while (tenantRepository
                .existsBySlugIgnoreCase(slug)) {

            slug = baseSlug
                    + "-"
                    + suffix++;

        }

        return slug;
    }

    private String slugify(
            String value) {

        if (value == null
                || value.isBlank()) {

            return "company";
        }

        String normalized = Normalizer.normalize(
                value,
                Normalizer.Form.NFD);

        normalized = normalized.replaceAll(
                "\\p{M}",
                "");

        normalized = normalized
                .toLowerCase(
                        Locale.ROOT)
                .replaceAll(
                        "[^a-z0-9]+",
                        "-")
                .replaceAll(
                        "^-+|-+$",
                        "");

        if (normalized.isBlank()) {
            normalized = "company";
        }

        if (normalized.length() > 120) {

            normalized = normalized.substring(
                    0,
                    120);

            normalized = normalized.replaceAll(
                    "-+$",
                    "");
        }

        return normalized;
    }
}