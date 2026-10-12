package com.darmisolutions.darmihire.interview.dto;

import com.darmisolutions.darmihire.interview.InterviewStatus;
import com.darmisolutions.darmihire.interview.InterviewType;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record InterviewResponse(

    UUID id,

    UUID applicationId,

    UUID jobId,

    String jobTitle,

    UUID candidateId,

    String candidateName,

    String candidateEmail,

    String title,

    InterviewType interviewType,

    InterviewStatus status,

    Instant startTime,

    Instant endTime,

    String timezone,

    String location,

    String meetingUrl,

    String notes,

    String cancellationReason,

    Instant cancelledAt,

    Instant completedAt,

    List<InterviewInterviewerResponse> interviewers,

    Instant createdAt,

    Instant updatedAt

) {
}