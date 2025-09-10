package com.pft.pft_events.events;

import java.time.LocalDateTime;

    public interface NotificationEvent {
        String getUserId();
        String getType();  // e.g., INCOME_ADDED, BUDGET_EXCEEDED, etc.
        LocalDateTime getTimestamp();
    }
