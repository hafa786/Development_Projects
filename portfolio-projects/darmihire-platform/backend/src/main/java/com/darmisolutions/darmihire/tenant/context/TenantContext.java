package com.darmisolutions.darmihire.tenant.context;

import com.darmisolutions.darmihire.tenant.Role;
import java.util.UUID;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class TenantContext {

  private UUID tenantId;
  private UUID userId;
  private Role role;

  public UUID getTenantId() {
    return tenantId;
  }

  public void setTenantId(UUID tenantId) {
    this.tenantId = tenantId;
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public boolean isResolved() {
    return tenantId != null && userId != null && role != null;
  }
}
