package com.darmisolutions.darmihire.careers.dto;

import com.darmisolutions.darmihire.job.EmploymentType;
import com.darmisolutions.darmihire.job.WorkplaceType;

import java.time.LocalDate;

public record PublicJobSummaryResponse(

        String title,

        String slug,

        String department,

        String team,

        String location,

        EmploymentType employmentType,

        WorkplaceType workplaceType,

        Integer openings,

        LocalDate applicationDeadline

) {
}