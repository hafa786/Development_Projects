package com.darmisolutions.darmihire.interview.dto;

import com.darmisolutions.darmihire.interview.InterviewType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CreateInterviewRequest(
    @NotNull UUID applicationId,
    @NotBlank @Size(max = 200) String title,
    @NotNull InterviewType interviewType,
    @NotNull Instant startTime,
    @NotNull Instant endTime,
    @NotBlank @Size(max = 100) String timezone,
    @Size(max = 500) String location,
    @Size(max = 1000) String meetingUrl,
    String notes,
    List<UUID> interviewerIds) {}
