package com.darmisolutions.darmihire.application;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ApplicationActivityRepository
    extends JpaRepository<ApplicationActivity, UUID> {

    List<ApplicationActivity>
        findAllByTenantIdAndApplicationIdOrderByCreatedAtAsc(
            UUID tenantId,
            UUID applicationId
        );
}