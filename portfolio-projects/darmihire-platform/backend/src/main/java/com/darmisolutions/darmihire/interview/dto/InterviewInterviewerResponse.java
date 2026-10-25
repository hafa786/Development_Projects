package com.darmisolutions.darmihire.interview.dto;

import java.util.UUID;

public record InterviewInterviewerResponse(UUID id, UUID tenantUserId, String name, String email) {}
