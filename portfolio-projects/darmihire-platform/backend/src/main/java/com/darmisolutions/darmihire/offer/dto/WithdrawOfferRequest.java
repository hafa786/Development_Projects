package com.darmisolutions.darmihire.offer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WithdrawOfferRequest(

        @NotBlank
        @Size(max = 2000)
        String reason

) {
}