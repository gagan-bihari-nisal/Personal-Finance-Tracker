package com.pft.finance_service.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record BudgetRequest(
        @NotBlank String categoryName,
        @Min(2000) @Max(2100) int year,
        @Min(1) @Max(12) int month,
        @Positive double amount
) {}
