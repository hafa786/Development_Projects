package com.darmisolutions.darmihire.job.dto;

import java.time.LocalDate;

public record PublishJobRequest(

        LocalDate applicationDeadline

) {
}