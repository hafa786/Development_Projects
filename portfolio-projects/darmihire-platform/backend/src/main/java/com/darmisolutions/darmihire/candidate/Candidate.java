package com.darmisolutions.darmihire.candidate;

import com.darmisolutions.darmihire.tenant.Tenant;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "candidates",
    indexes = {
        @Index(
            name = "idx_candidates_tenant_id",
            columnList = "tenant_id"
        ),
        @Index(
            name = "idx_candidates_tenant_email",
            columnList = "tenant_id,email"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class Candidate extends com.darmisolutions.darmihire.common.entity.BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(length = 255)
    private String location;

    @Column(name = "linkedin_url", length = 500)
    private String linkedinUrl;

    @Column(name = "portfolio_url", length = 500)
    private String portfolioUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CandidateSource source = CandidateSource.MANUAL;

    @Column(name = "resume_file_name", length = 255)
    private String resumeFileName;

    @Column(name = "resume_url", length = 1000)
    private String resumeUrl;

    @Column(columnDefinition = "TEXT")
    private String notes;
}