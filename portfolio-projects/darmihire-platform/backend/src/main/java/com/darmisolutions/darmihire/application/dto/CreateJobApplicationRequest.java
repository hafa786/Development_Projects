package com.darmisolutions.darmihire.application.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateJobApplicationRequest(

    @NotNull
    UUID jobId,

    @NotNull
    UUID candidateId

) {}