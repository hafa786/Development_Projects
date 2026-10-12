package com.darmisolutions.darmihire.interview.dto;

import jakarta.validation.constraints.Size;

public record CancelInterviewRequest(

    @Size(max = 2000)
    String reason

) {
}