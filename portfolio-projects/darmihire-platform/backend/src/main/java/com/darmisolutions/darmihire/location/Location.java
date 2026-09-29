package com.darmisolutions.darmihire.location;

import com.darmisolutions.darmihire.common.entity.BaseEntity;
import com.darmisolutions.darmihire.tenant.Tenant;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "locations")
@Getter
@Setter
public class Location extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(nullable = false)
    private String name;

    private String city;

    private String country;

    private String timezone;

    @Column(nullable = false)
    private boolean remote;
}