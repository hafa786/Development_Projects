package com.darmisolutions.darmihire.careers.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PublicJobApplicationRequest(

        @NotBlank
        @Size(max = 100)
        String firstName,

        @NotBlank
        @Size(max = 100)
        String lastName,

        @NotBlank
        @Email
        @Size(max = 255)
        String email,

        @Size(max = 50)
        String phone,

        @Size(max = 255)
        String location,

        @Size(max = 500)
        String linkedinUrl,

        @Size(max = 500)
        String portfolioUrl

) {
}