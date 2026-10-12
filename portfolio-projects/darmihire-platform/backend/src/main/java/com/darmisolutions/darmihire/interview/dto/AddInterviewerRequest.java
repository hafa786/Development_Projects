package com.darmisolutions.darmihire.interview.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AddInterviewerRequest(

    @NotNull
    UUID interviewerId

) {
}