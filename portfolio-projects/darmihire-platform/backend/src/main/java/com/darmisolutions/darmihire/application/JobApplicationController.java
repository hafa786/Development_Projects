package com.darmisolutions.darmihire.application;

import com.darmisolutions.darmihire.application.dto.ApplicationActivityResponse;
import com.darmisolutions.darmihire.application.dto.CreateJobApplicationRequest;
import com.darmisolutions.darmihire.application.dto.JobApplicationResponse;
import com.darmisolutions.darmihire.application.dto.RejectApplicationRequest;
import com.darmisolutions.darmihire.application.dto.UpdateApplicationStageRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService applicationService;
    private final ApplicationActivityService activityService;

    @GetMapping
    public List<JobApplicationResponse> findAll() {
        return applicationService.findAll();
    }

    @GetMapping("/{id}")
    public JobApplicationResponse findById(
        @PathVariable UUID id
    ) {
        return applicationService.findById(id);
    }

    @GetMapping("/job/{jobId}")
    public List<JobApplicationResponse> findByJob(
        @PathVariable UUID jobId
    ) {
        return applicationService.findByJob(jobId);
    }

    @GetMapping("/candidate/{candidateId}")
    public List<JobApplicationResponse> findByCandidate(
        @PathVariable UUID candidateId
    ) {
        return applicationService.findByCandidate(
            candidateId
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplicationResponse create(
        @Valid
        @RequestBody
        CreateJobApplicationRequest request
    ) {
        return applicationService.create(request);
    }

    @PatchMapping("/{id}/stage")
    public JobApplicationResponse updateStage(
        @PathVariable UUID id,

        @Valid
        @RequestBody
        UpdateApplicationStageRequest request
    ) {
        return applicationService.updateStage(
            id,
            request
        );
    }

    @PatchMapping("/{id}/reject")
    public JobApplicationResponse reject(
        @PathVariable UUID id,

        @Valid
        @RequestBody
        RejectApplicationRequest request
    ) {
        return applicationService.reject(
            id,
            request
        );
    }

    @PatchMapping("/{id}/withdraw")
    public JobApplicationResponse withdraw(
        @PathVariable UUID id
    ) {
        return applicationService.withdraw(id);
    }

    @GetMapping("/{id}/activities")
    public List<ApplicationActivityResponse> findActivities(
        @PathVariable UUID id
    ) {
        return activityService.findByApplication(id);
    }
}