package com.darmisolutions.darmihire.exception;

import java.time.Instant;
import java.util.Map;

public record ApiError(
        int status,
        String code,
        String message,
        String path,
        Instant timestamp,
        Map<String, String> errors
) {
}