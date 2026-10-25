package com.darmisolutions.darmihire.offer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RejectOfferRequest(@NotBlank @Size(max = 2000) String reason) {}
