package com.darmisolutions.darmihire.offer.dto;

import com.darmisolutions.darmihire.job.EmploymentType;
import com.darmisolutions.darmihire.offer.SalaryPeriod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateOfferRequest(
    @NotNull UUID applicationId,
    @NotNull @DecimalMin(value = "0.0", inclusive = true) BigDecimal salary,
    @NotBlank @Size(min = 3, max = 3) String currency,
    @NotNull SalaryPeriod salaryPeriod,
    @NotNull EmploymentType employmentType,
    LocalDate startDate,
    LocalDate expirationDate,
    @Size(max = 200) String probationPeriod,
    String benefits,
    String additionalTerms) {}
