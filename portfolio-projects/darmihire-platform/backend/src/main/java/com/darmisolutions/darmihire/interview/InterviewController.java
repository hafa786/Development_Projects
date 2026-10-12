package com.darmisolutions.darmihire.interview;

import com.darmisolutions.darmihire.interview.dto.*;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService
        interviewService;

    @GetMapping
    public List<InterviewResponse> findAll() {

        return interviewService.findAll();
    }

    @GetMapping("/{interviewId}")
    public InterviewResponse findById(
        @PathVariable UUID interviewId
    ) {

        return interviewService.findById(
            interviewId
        );
    }

    @GetMapping("/application/{applicationId}")
    public List<InterviewResponse>
        findByApplication(
            @PathVariable
            UUID applicationId
        ) {

        return interviewService
            .findByApplication(
                applicationId
            );
    }

    @GetMapping("/upcoming")
    public List<InterviewResponse>
        findUpcoming(

            @RequestParam(required = false)
            @DateTimeFormat(
                iso =
                    DateTimeFormat.ISO.DATE_TIME
            )
            Instant from,

            @RequestParam(required = false)
            @DateTimeFormat(
                iso =
                    DateTimeFormat.ISO.DATE_TIME
            )
            Instant to
        ) {

        return interviewService
            .findUpcoming(
                from,
                to
            );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InterviewResponse create(
        @Valid
        @RequestBody
        CreateInterviewRequest request
    ) {

        return interviewService.create(
            request
        );
    }

    @PutMapping("/{interviewId}")
    public InterviewResponse update(
        @PathVariable
        UUID interviewId,

        @Valid
        @RequestBody
        UpdateInterviewRequest request
    ) {

        return interviewService.update(
            interviewId,
            request
        );
    }

    @PatchMapping(
        "/{interviewId}/reschedule"
    )
    public InterviewResponse reschedule(
        @PathVariable
        UUID interviewId,

        @Valid
        @RequestBody
        RescheduleInterviewRequest request
    ) {

        return interviewService
            .reschedule(
                interviewId,
                request
            );
    }

    @PatchMapping(
        "/{interviewId}/cancel"
    )
    public InterviewResponse cancel(
        @PathVariable
        UUID interviewId,

        @Valid
        @RequestBody
        CancelInterviewRequest request
    ) {

        return interviewService.cancel(
            interviewId,
            request
        );
    }

    @PatchMapping(
        "/{interviewId}/complete"
    )
    public InterviewResponse complete(
        @PathVariable
        UUID interviewId
    ) {

        return interviewService.complete(
            interviewId
        );
    }

    @PostMapping(
        "/{interviewId}/interviewers"
    )
    public InterviewResponse addInterviewer(
        @PathVariable
        UUID interviewId,

        @Valid
        @RequestBody
        AddInterviewerRequest request
    ) {

        return interviewService
            .addInterviewer(
                interviewId,
                request
            );
    }

    @DeleteMapping(
        "/{interviewId}/interviewers/{interviewerId}"
    )
    public InterviewResponse removeInterviewer(
        @PathVariable
        UUID interviewId,

        @PathVariable
        UUID interviewerId
    ) {

        return interviewService
            .removeInterviewer(
                interviewId,
                interviewerId
            );
    }
}