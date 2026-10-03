package com.darmisolutions.darmihire.security;

import com.darmisolutions.darmihire.user.User;
import com.darmisolutions.darmihire.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader(AUTHORIZATION_HEADER);

        /*
         * No Authorization header.
         *
         * Continue the filter chain.
         * Public endpoints may continue normally.
         * Protected endpoints will later return 401.
         */
        if (authorizationHeader == null
                || !authorizationHeader.startsWith(BEARER_PREFIX)) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        String token =
                authorizationHeader
                        .substring(BEARER_PREFIX.length())
                        .trim();

        if (token.isEmpty()) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        try {

            /*
             * JwtService validates:
             *
             * - signature
             * - expiration
             * - token structure
             */
            if (!jwtService.isValid(token)) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            /*
             * Don't replace an authentication that
             * already exists.
             */
            if (SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {

                /*
                 * Your JWT subject contains the user UUID.
                 */
                UUID userId =
                        jwtService.extractUserId(
                                token
                        );

                User user =
                        userRepository
                                .findById(userId)
                                .orElse(null);

                /*
                 * Only active users may authenticate.
                 */
                if (user != null
                        && user.isActive()) {

                    /*
                     * DarmiHire authorization is tenant-based.
                     *
                     * Role and permissions are resolved later
                     * by TenantContextFilter and
                     * AuthorizationService.
                     *
                     * Therefore global Spring authorities are
                     * intentionally empty here.
                     */
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    Collections.emptyList()
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );
                }
            }

        } catch (Exception ignored) {

            /*
             * Malformed, expired or otherwise invalid JWT.
             *
             * Do not authenticate.
             *
             * Spring Security will reject protected
             * endpoints later in the filter chain.
             */
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}