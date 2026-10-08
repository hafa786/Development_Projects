package com.darmisolutions.darmihire.application.dto;

import com.darmisolutions.darmihire.application.ApplicationActivityType;
import com.darmisolutions.darmihire.application.ApplicationStage;

import java.time.Instant;
import java.util.UUID;

public record ApplicationActivityResponse(

    UUID id,

    UUID applicationId,

    ApplicationActivityType activityType,

    ApplicationStage fromStage,

    ApplicationStage toStage,

    String description,

    UUID performedById,

    String performedByName,

    Instant createdAt

) {}