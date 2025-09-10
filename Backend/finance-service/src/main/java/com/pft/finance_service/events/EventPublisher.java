package com.pft.finance_service.events;

import com.pft.pft_events.events.BudgetExceededEvent;
import com.pft.pft_events.events.ExpenseExceedsIncomeEvent;
import com.pft.pft_events.events.IncomeAddedEvent;
import com.pft.pft_events.events.MonthlySummaryEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class EventPublisher {

    private final KafkaTemplate<String, Object> kafka;

    public EventPublisher(KafkaTemplate<String, Object> kafka) {
        this.kafka = kafka;
    }

    public void publishIncomeAdded(IncomeAddedEvent e) {
        kafka.send("transactions", e);
    }

    public void publishBudgetExceeded(BudgetExceededEvent e) {
        kafka.send("budgets", e);
    }

    public void publishExpenseExceedsIncome(ExpenseExceedsIncomeEvent e) {
        kafka.send("transactions", e); // using "transactions" topic (ok) 
    }

    public void publishMonthlySummary(MonthlySummaryEvent e) {
        kafka.send("monthly-summary", e);
    }
}