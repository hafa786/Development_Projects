package com.darmisolutions.darmihire.scorecard;

import com.darmisolutions.darmihire.scorecard.dto.CreateInterviewFeedbackRequest;
import com.darmisolutions.darmihire.scorecard.dto.InterviewFeedbackResponse;
import com.darmisolutions.darmihire.scorecard.dto.UpdateInterviewFeedbackRequest;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interview-feedback")
@RequiredArgsConstructor
public class InterviewFeedbackController {

    private final InterviewFeedbackService interviewFeedbackService;

    /*
     * All feedback for an interview.
     */
    @GetMapping("/interview/{interviewId}")
    public List<InterviewFeedbackResponse> findByInterview(
            @PathVariable UUID interviewId) {
        return interviewFeedbackService.findByInterview(
                interviewId);
    }

    /*
     * Current authenticated interviewer's feedback.
     *
     * 200 -> feedback exists
     * 204 -> interviewer has not created feedback yet
     */
    @GetMapping("/interview/{interviewId}/mine")
    public ResponseEntity<InterviewFeedbackResponse> getMyFeedback(
            @PathVariable UUID interviewId) {
        return interviewFeedbackService
                .getMyFeedback(interviewId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    /*
     * Find feedback by ID.
     */
    @GetMapping("/{feedbackId}")
    public InterviewFeedbackResponse findById(
            @PathVariable UUID feedbackId) {
        return interviewFeedbackService.findById(
                feedbackId);
    }

    /*
     * Creates draft feedback.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InterviewFeedbackResponse create(
            @Valid @RequestBody CreateInterviewFeedbackRequest request) {
        return interviewFeedbackService.create(
                request);
    }

    /*
     * Saves draft feedback.
     */
    @PutMapping("/{feedbackId}")
    public InterviewFeedbackResponse update(
            @PathVariable UUID feedbackId,

            @Valid @RequestBody UpdateInterviewFeedbackRequest request) {
        return interviewFeedbackService.update(
                feedbackId,
                request);
    }

    /*
     * Final submission.
     */
    @PatchMapping("/{feedbackId}/submit")
    public InterviewFeedbackResponse submit(
            @PathVariable UUID feedbackId) {
        return interviewFeedbackService.submit(
                feedbackId);
    }
}