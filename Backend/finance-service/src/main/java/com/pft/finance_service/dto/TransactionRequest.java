package com.pft.finance_service.dto;

import com.pft.finance_service.util.Type;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record TransactionRequest(
        @NotNull Type type,
        @NotBlank String categoryName,
        @Positive double amount,
        @NotNull LocalDate date,
        String description
) {}
