package com.darmisolutions.darmihire.department.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateDepartmentRequest(

        @NotBlank
        @Size(max = 255)
        String name,

        @Size(max = 2000)
        String description

) {}