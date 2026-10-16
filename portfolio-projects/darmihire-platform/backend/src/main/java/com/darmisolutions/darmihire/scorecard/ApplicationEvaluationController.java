package com.darmisolutions.darmihire.scorecard;

import com.darmisolutions.darmihire.scorecard.dto.ApplicationEvaluationSummaryResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(
        "/api/v1/application-evaluations"
)
@RequiredArgsConstructor
public class ApplicationEvaluationController {

    private final ApplicationEvaluationService
            applicationEvaluationService;

    @GetMapping("/{applicationId}")
    public ApplicationEvaluationSummaryResponse
    getSummary(
            @PathVariable
            UUID applicationId
    ) {
        return applicationEvaluationService
                .getApplicationSummary(
                        applicationId
                );
    }
}