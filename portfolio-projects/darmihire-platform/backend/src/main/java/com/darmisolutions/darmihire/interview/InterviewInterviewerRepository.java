package com.darmisolutions.darmihire.interview;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewInterviewerRepository extends JpaRepository<InterviewInterviewer, UUID> {

  List<InterviewInterviewer> findAllByTenantIdAndInterviewIdOrderByCreatedAtAsc(
      UUID tenantId, UUID interviewId);

  Optional<InterviewInterviewer> findByTenantIdAndInterviewIdAndInterviewerId(
      UUID tenantId, UUID interviewId, UUID interviewerId);

  boolean existsByTenantIdAndInterviewIdAndInterviewerId(
      UUID tenantId, UUID interviewId, UUID interviewerId);

  void deleteAllByTenantIdAndInterviewId(UUID tenantId, UUID interviewId);
}
