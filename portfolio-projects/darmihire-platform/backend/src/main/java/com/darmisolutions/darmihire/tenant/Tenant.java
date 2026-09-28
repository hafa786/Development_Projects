package com.darmisolutions.darmihire.tenant;

import com.darmisolutions.darmihire.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tenants")
public class Tenant extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(name = "logo_url", length = 1000)
    private String logoUrl;

    @Column(nullable = false)
    private boolean active = true;
}