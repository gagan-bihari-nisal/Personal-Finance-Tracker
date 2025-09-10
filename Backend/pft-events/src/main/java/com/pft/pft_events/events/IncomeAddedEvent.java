package com.pft.pft_events.events;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.time.LocalDateTime;

@JsonIgnoreProperties(ignoreUnknown = true)
public record IncomeAddedEvent(
        String userId,
        String category,
        double amount,
        LocalDate date,
        LocalDateTime timestamp
) implements NotificationEvent {
    @Override
    public String getUserId() {
        return userId;
    }

    @Override public String getType() { return "INCOME_ADDED"; }

    @Override
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
