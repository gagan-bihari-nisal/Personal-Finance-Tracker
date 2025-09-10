package com.pft.pft_events.events;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
@JsonIgnoreProperties(ignoreUnknown = true)
public record BudgetExceededEvent(
        String userId,
        String category,
        double budget,
        double spent,
        LocalDateTime timestamp
) implements NotificationEvent {
    @Override
    public String getUserId() {
        return userId;
    }

    @Override public String getType() { return "BUDGET_EXCEEDED"; }

    @Override
    public LocalDateTime getTimestamp() {
        return null;
    }
}