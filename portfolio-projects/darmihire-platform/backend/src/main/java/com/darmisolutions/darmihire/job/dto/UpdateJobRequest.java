package com.darmisolutions.darmihire.job.dto;

import com.darmisolutions.darmihire.job.EmploymentType;
import com.darmisolutions.darmihire.job.WorkplaceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record UpdateJobRequest(

        @NotBlank
        @Size(max = 200)
        String title,

        String description,

        UUID departmentId,

        UUID teamId,

        UUID locationId,

        UUID recruiterId,

        UUID hiringManagerId,

        @NotNull
        EmploymentType employmentType,

        @NotNull
        WorkplaceType workplaceType,

        @Min(1)
        Integer openings
) {
}