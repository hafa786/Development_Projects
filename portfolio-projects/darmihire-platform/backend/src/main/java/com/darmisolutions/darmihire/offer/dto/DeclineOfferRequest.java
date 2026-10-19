package com.darmisolutions.darmihire.offer.dto;

import jakarta.validation.constraints.Size;

public record DeclineOfferRequest(

        @Size(max = 2000)
        String reason

) {
}