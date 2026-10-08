package com.darmisolutions.darmihire.candidate.dto;

import com.darmisolutions.darmihire.candidate.CandidateSource;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCandidateRequest(

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
    String portfolioUrl,

    CandidateSource source,

    @Size(max = 255)
    String resumeFileName,

    @Size(max = 1000)
    String resumeUrl,

    String notes
) {}