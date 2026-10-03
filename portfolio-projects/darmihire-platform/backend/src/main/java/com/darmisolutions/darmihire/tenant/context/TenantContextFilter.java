package com.darmisolutions.darmihire.tenant.context;

import com.darmisolutions.darmihire.tenant.MembershipStatus;
import com.darmisolutions.darmihire.tenant.TenantUser;
import com.darmisolutions.darmihire.tenant.TenantUserRepository;
import com.darmisolutions.darmihire.user.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TenantContextFilter extends OncePerRequestFilter {

	private final TenantUserRepository tenantUserRepository;
	private final TenantContext tenantContext;

	@Override
	protected void doFilterInternal(
			HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {

		String tenantHeader = request.getHeader("X-Tenant-ID");

		if (tenantHeader == null || tenantHeader.isBlank()) {
			filterChain.doFilter(request, response);
			return;
		}

		Authentication authentication = SecurityContextHolder
				.getContext()
				.getAuthentication();

		if (authentication == null
				|| !authentication.isAuthenticated()
				|| !(authentication.getPrincipal() instanceof User user)) {

			filterChain.doFilter(request, response);
			return;
		}

		UUID tenantId;

		try {
			tenantId = UUID.fromString(tenantHeader.trim());
		} catch (IllegalArgumentException exception) {
			response.sendError(
					HttpServletResponse.SC_BAD_REQUEST,
					"Invalid X-Tenant-ID");
			return;
		}

		TenantUser membership = tenantUserRepository
				.findByTenantIdAndUserId(
						tenantId,
						user.getId())
				.orElse(null);

		if (membership == null
				|| membership.getStatus() != MembershipStatus.ACTIVE) {

			response.sendError(
					HttpServletResponse.SC_FORBIDDEN,
					"Tenant access denied");
			return;
		}

		tenantContext.setTenantId(tenantId);
		tenantContext.setUserId(user.getId());
		tenantContext.setRole(membership.getRole());

		filterChain.doFilter(request, response);
	}
}