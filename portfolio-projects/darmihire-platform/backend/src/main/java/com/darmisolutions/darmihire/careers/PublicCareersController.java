package com.darmisolutions.darmihire.careers;

import com.darmisolutions.darmihire.careers.dto.PublicCareerResponse;
import com.darmisolutions.darmihire.careers.dto.PublicJobResponse;
import com.darmisolutions.darmihire.careers.dto.PublicJobSummaryResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/public/careers")
@RequiredArgsConstructor
public class PublicCareersController {

    private final PublicCareersService publicCareersService;

    /*
     * ---------------------------------------------------------
     * CAREERS SITE
     * ---------------------------------------------------------
     */

    @GetMapping("/{companySlug}")
    public ResponseEntity<PublicCareerResponse> getCareer(
            @PathVariable String companySlug) {

        PublicCareerResponse response = publicCareersService
                .getCareer(companySlug);

        return ResponseEntity
                .ok()
                .cacheControl(
                        CacheControl.maxAge(
                                5,
                                TimeUnit.MINUTES))
                .body(response);
    }

    /*
     * ---------------------------------------------------------
     * PUBLIC JOB LIST
     * ---------------------------------------------------------
     */

    @GetMapping("/{companySlug}/jobs")
    public ResponseEntity<List<PublicJobSummaryResponse>> getJobs(
            @PathVariable String companySlug) {

        List<PublicJobSummaryResponse> response = publicCareersService
                .getJobs(companySlug);

        return ResponseEntity
                .ok()
                .cacheControl(
                        CacheControl.maxAge(
                                1,
                                TimeUnit.MINUTES))
                .body(response);
    }

    /*
     * ---------------------------------------------------------
     * PUBLIC JOB DETAILS
     * ---------------------------------------------------------
     */

    @GetMapping("/{companySlug}/jobs/{jobSlug}")
    public ResponseEntity<PublicJobResponse> getJob(
            @PathVariable String companySlug,

            @PathVariable String jobSlug) {

        PublicJobResponse response = publicCareersService
                .getJob(
                        companySlug,
                        jobSlug);

        return ResponseEntity
                .ok()
                .cacheControl(
                        CacheControl.maxAge(
                                1,
                                TimeUnit.MINUTES))
                .body(response);
    }
}