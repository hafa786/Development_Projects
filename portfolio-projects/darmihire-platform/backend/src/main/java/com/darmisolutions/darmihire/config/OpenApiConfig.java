package com.darmisolutions.darmihire.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    public static final String SECURITY_SCHEME_NAME =
            "bearerAuth";

    @Bean
    public OpenAPI darmiHireOpenApi() {

        SecurityScheme securityScheme =
                new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .name(SECURITY_SCHEME_NAME)
                        .description(
                                "Enter the JWT access token"
                        );

        SecurityRequirement securityRequirement =
                new SecurityRequirement()
                        .addList(
                                SECURITY_SCHEME_NAME
                        );

        return new OpenAPI()

                .info(
                        new Info()
                                .title(
                                        "DarmiHire API"
                                )
                                .version(
                                        "1.0.0"
                                )
                                .description(
                                        """
                                        DarmiHire recruitment and
                                        applicant tracking platform API.

                                        Modern hiring, powered by AI.

                                        Developed by Darmi Solutions.
                                        """
                                )
                                .contact(
                                        new Contact()
                                                .name(
                                                        "Darmi Solutions"
                                                )
                                )
                                .license(
                                        new License()
                                                .name(
                                                        "Proprietary"
                                                )
                                )
                )

                .components(
                        new Components()
                                .addSecuritySchemes(
                                        SECURITY_SCHEME_NAME,
                                        securityScheme
                                )
                )

                .addSecurityItem(
                        securityRequirement
                );
    }
}