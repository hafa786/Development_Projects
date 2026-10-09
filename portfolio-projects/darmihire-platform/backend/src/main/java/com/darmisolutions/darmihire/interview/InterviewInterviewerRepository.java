package com.darmisolutions.darmihire.interview;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InterviewInterviewerRepository
    extends JpaRepository<
        InterviewInterviewer,
        UUID
    > {

    List<InterviewInterviewer>
        findAllByTenantIdAndInterviewIdOrderByCreatedAtAsc(
            UUID tenantId,
            UUID interviewId
        );

    boolean
        existsByTenantIdAndInterviewIdAndInterviewerId(
            UUID tenantId,
            UUID interviewId,
            UUID interviewerId
        );

    void
        deleteAllByTenantIdAndInterviewId(
            UUID tenantId,
            UUID interviewId
        );
}