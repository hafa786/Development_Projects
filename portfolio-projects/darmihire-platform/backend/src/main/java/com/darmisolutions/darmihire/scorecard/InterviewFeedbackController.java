package com.darmisolutions.darmihire.scorecard;

import com.darmisolutions.darmihire.scorecard.dto.*;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(
        "/api/v1/interview-feedback"
)
@RequiredArgsConstructor
public class InterviewFeedbackController {

    private final InterviewFeedbackService
            interviewFeedbackService;

    /*
     * All feedback for an interview.
     */
    @GetMapping(
            "/interview/{interviewId}"
    )
    public List<InterviewFeedbackResponse>
    findByInterview(
            @PathVariable
            UUID interviewId
    ) {

        return interviewFeedbackService
                .findByInterview(
                        interviewId
                );
    }

    /*
     * Current user's feedback for an interview.
     */
    @GetMapping(
            "/interview/{interviewId}/mine"
    )
    public InterviewFeedbackResponse
    findMine(
            @PathVariable
            UUID interviewId
    ) {

        return interviewFeedbackService
                .findMine(
                        interviewId
                );
    }

    @GetMapping(
            "/{feedbackId}"
    )
    public InterviewFeedbackResponse
    findById(
            @PathVariable
            UUID feedbackId
    ) {

        return interviewFeedbackService
                .findById(
                        feedbackId
                );
    }

    /*
     * Creates draft feedback.
     */
    @PostMapping
    @ResponseStatus(
            HttpStatus.CREATED
    )
    public InterviewFeedbackResponse
    create(
            @Valid
            @RequestBody
            CreateInterviewFeedbackRequest request
    ) {

        return interviewFeedbackService
                .create(
                        request
                );
    }

    /*
     * Saves draft.
     */
    @PutMapping(
            "/{feedbackId}"
    )
    public InterviewFeedbackResponse
    update(
            @PathVariable
            UUID feedbackId,

            @Valid
            @RequestBody
            UpdateInterviewFeedbackRequest request
    ) {

        return interviewFeedbackService
                .update(
                        feedbackId,
                        request
                );
    }

    /*
     * Final submission.
     */
    @PatchMapping(
            "/{feedbackId}/submit"
    )
    public InterviewFeedbackResponse
    submit(
            @PathVariable
            UUID feedbackId
    ) {

        return interviewFeedbackService
                .submit(
                        feedbackId
                );
    }
}