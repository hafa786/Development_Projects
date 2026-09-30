package com.darmisolutions.darmihire.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.darmisolutions.darmihire.tenant.context.TenantContextFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        private final TenantContextFilter tenantContextFilter;

        private final RestAuthenticationEntryPoint authenticationEntryPoint;

        private final RestAccessDeniedHandler accessDeniedHandler;

        @Bean
        SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                return http
                                .csrf(csrf -> csrf.disable())

                                .cors(cors -> {
                                })

                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .exceptionHandling(exception -> exception
                                                .authenticationEntryPoint(
                                                                authenticationEntryPoint)
                                                .accessDeniedHandler(
                                                                accessDeniedHandler))

                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/api/v1/auth/register",
                                                                "/api/v1/auth/login",
                                                                "/api/v1/auth/refresh",

                                                                "/actuator/health",

                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",

                                                                "/v3/api-docs",
                                                                "/v3/api-docs/**",
                                                                "/v3/api-docs.yaml")
                                                .permitAll()

                                                .anyRequest()
                                                .authenticated())

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class)

                                .addFilterAfter(
                                                tenantContextFilter,
                                                JwtAuthenticationFilter.class)

                                .build();
        }
}