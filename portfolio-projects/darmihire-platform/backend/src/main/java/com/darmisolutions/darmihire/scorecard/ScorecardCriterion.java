package com.darmisolutions.darmihire.scorecard;

import com.darmisolutions.darmihire.common.entity.*;
import com.darmisolutions.darmihire.tenant.Tenant;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
    name = "scorecard_criteria",
    indexes = {
      @Index(name = "idx_scorecard_criteria_tenant", columnList = "tenant_id"),
      @Index(name = "idx_scorecard_criteria_template", columnList = "template_id"),
      @Index(name = "idx_scorecard_criteria_sort", columnList = "template_id, sort_order")
    },
    uniqueConstraints = {
      @UniqueConstraint(
          name = "uk_scorecard_criterion_name",
          columnNames = {"template_id", "name"})
    })
@Getter
@Setter
public class ScorecardCriterion extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "tenant_id", nullable = false)
  private Tenant tenant;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "template_id", nullable = false)
  private InterviewScorecardTemplate template;

  @Column(name = "name", nullable = false, length = 200)
  private String name;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "sort_order", nullable = false)
  private int sortOrder;

  @Column(name = "required", nullable = false)
  private boolean required = true;

  @Column(name = "weight", nullable = false)
  private int weight = 1;
}
