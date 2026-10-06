package com.darmisolutions.darmihire.job;

import com.darmisolutions.darmihire.common.entity.BaseEntity;
import com.darmisolutions.darmihire.department.Department;
import com.darmisolutions.darmihire.location.Location;
import com.darmisolutions.darmihire.team.Team;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantUser;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
        name = "jobs",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_jobs_tenant_job_code",
                        columnNames = {
                                "tenant_id",
                                "job_code"
                        }
                )
        }
)
public class Job extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "tenant_id",
            nullable = false
    )
    private Tenant tenant;

    @Column(
            nullable = false,
            length = 200
    )
    private String title;

    @Column(
            name = "job_code",
            nullable = false,
            length = 50
    )
    private String jobCode;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id")
    private TenantUser recruiter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hiring_manager_id")
    private TenantUser hiringManager;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "employment_type",
            nullable = false,
            length = 30
    )
    private EmploymentType employmentType;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "workplace_type",
            nullable = false,
            length = 30
    )
    private WorkplaceType workplaceType;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    private JobStatus status;

    @Column(nullable = false)
    private int openings = 1;
}