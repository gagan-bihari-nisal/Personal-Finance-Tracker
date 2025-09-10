package com.pft.pft_events.events;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ExpenseExceedsIncomeEvent(
        String userId,
        double totalIncome,
        double totalExpense,
        double deficit,
        int year,
        int month,
        LocalDateTime timestamp
) implements NotificationEvent {
    @Override
    public String getUserId() {
        return userId;
    }

    @Override public String getType() { return "EXPENSE_EXCEEDS_INCOME"; }

    @Override
    public LocalDateTime getTimestamp() {
        return null;
    }
}
