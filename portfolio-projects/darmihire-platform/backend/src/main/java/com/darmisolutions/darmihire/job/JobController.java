package com.darmisolutions.darmihire.job;

import com.darmisolutions.darmihire.job.dto.CreateJobRequest;
import com.darmisolutions.darmihire.job.dto.JobResponse;
import com.darmisolutions.darmihire.job.dto.PublishJobRequest;
import com.darmisolutions.darmihire.job.dto.UpdateJobRequest;
import com.darmisolutions.darmihire.job.dto.UpdateJobStatusRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {

  private final JobService jobService;

  @GetMapping
  public List<JobResponse> findAll() {
    return jobService.findAll();
  }

  @GetMapping("/{id}")
  public JobResponse findById(@PathVariable UUID id) {
    return jobService.findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public JobResponse create(@Valid @RequestBody CreateJobRequest request) {
    return jobService.create(request);
  }

  @PatchMapping("/{id}")
  public JobResponse update(@PathVariable UUID id, @Valid @RequestBody UpdateJobRequest request) {
    return jobService.update(id, request);
  }

  @PatchMapping("/{id}/status")
  public JobResponse updateStatus(
      @PathVariable UUID id, @Valid @RequestBody UpdateJobStatusRequest request) {
    return jobService.updateStatus(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable UUID id) {
    jobService.delete(id);
  }

  @PatchMapping("/{jobId}/publish")
  public JobResponse publish(
      @PathVariable UUID jobId, @Valid @RequestBody PublishJobRequest request) {
    return jobService.publish(jobId, request);
  }

  @PatchMapping("/{jobId}/unpublish")
  public JobResponse unpublish(@PathVariable UUID jobId) {
    return jobService.unpublish(jobId);
  }
}
