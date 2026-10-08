package com.darmisolutions.darmihire.application.dto;

import com.darmisolutions.darmihire.application.ApplicationStage;
import jakarta.validation.constraints.NotNull;

public record UpdateApplicationStageRequest(

    @NotNull
    ApplicationStage stage

) {}