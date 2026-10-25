package com.darmisolutions.darmihire.interview.dto;

import com.darmisolutions.darmihire.interview.InterviewType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateInterviewRequest(
    @NotBlank @Size(max = 200) String title,
    @NotNull InterviewType interviewType,
    @NotBlank @Size(max = 100) String timezone,
    @Size(max = 500) String location,
    @Size(max = 1000) String meetingUrl,
    String notes) {}
