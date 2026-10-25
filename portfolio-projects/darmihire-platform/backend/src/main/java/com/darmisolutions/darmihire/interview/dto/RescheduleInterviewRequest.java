package com.darmisolutions.darmihire.interview.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record RescheduleInterviewRequest(
    @NotNull Instant startTime,
    @NotNull Instant endTime,
    @NotBlank @Size(max = 100) String timezone) {}
