package com.darmisolutions.darmihire.job.dto;

import com.darmisolutions.darmihire.job.EmploymentType;
import com.darmisolutions.darmihire.job.JobStatus;
import com.darmisolutions.darmihire.job.WorkplaceType;

import java.time.Instant;
import java.util.UUID;

public record JobResponse(

        UUID id,

        String title,

        String jobCode,

        String description,

        UUID departmentId,
        String departmentName,

        UUID teamId,
        String teamName,

        UUID locationId,
        String locationName,

        UUID recruiterId,
        String recruiterName,

        UUID hiringManagerId,
        String hiringManagerName,

        EmploymentType employmentType,

        WorkplaceType workplaceType,

        JobStatus status,

        int openings,

        Instant createdAt,

        Instant updatedAt
) {
}