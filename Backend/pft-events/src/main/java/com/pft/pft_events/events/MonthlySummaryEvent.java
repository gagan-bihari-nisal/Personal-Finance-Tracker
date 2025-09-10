package com.pft.pft_events.events;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MonthlySummaryEvent(
        String userId,
        int year,
        int month,
        double totalIncome,
        double totalExpense,
        double savings,
        LocalDateTime timestamp
) implements NotificationEvent {
    @Override
    public String getUserId() {
        return null;
    }

    @Override public String getType() { return "MONTHLY_SUMMARY"; }

    @Override
    public LocalDateTime getTimestamp() {
        return null;
    }
}
