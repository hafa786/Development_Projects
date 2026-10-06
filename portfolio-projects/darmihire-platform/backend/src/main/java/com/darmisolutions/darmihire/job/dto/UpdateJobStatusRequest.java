package com.darmisolutions.darmihire.job.dto;

import com.darmisolutions.darmihire.job.JobStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateJobStatusRequest(

        @NotNull
        JobStatus status
) {
}