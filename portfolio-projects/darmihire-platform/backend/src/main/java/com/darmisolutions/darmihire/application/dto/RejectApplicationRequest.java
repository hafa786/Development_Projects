package com.darmisolutions.darmihire.application.dto;

import jakarta.validation.constraints.Size;

public record RejectApplicationRequest(

    @Size(max = 1000)
    String reason

) {}