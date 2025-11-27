package com.pft.finance_service.events;

import com.pft.pft_events.events.BudgetExceededEvent;
import com.pft.pft_events.events.ExpenseExceedsIncomeEvent;
import com.pft.pft_events.events.IncomeAddedEvent;
import com.pft.pft_events.events.MonthlySummaryEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class EventPublisher {

    private static final Logger logger = LoggerFactory.getLogger(EventPublisher.class);
    private final KafkaTemplate<String, Object> kafka;
    
    @Value("${kafka.topic.transactions}")
    private String transactionsTopic;
    
    @Value("${kafka.topic.budgets}")
    private String budgetsTopic;
    
    @Value("${kafka.topic.monthly-summary}")
    private String monthlySummaryTopic;

    public EventPublisher(KafkaTemplate<String, Object> kafka) {
        this.kafka = kafka;
    }

    public void publishIncomeAdded(IncomeAddedEvent e) {
        sendMessage(transactionsTopic, e, "IncomeAddedEvent");
    }

    public void publishBudgetExceeded(BudgetExceededEvent e) {
        sendMessage(budgetsTopic, e, "BudgetExceededEvent");
    }

    public void publishExpenseExceedsIncome(ExpenseExceedsIncomeEvent e) {
        sendMessage(transactionsTopic, e, "ExpenseExceedsIncomeEvent");
    }

    public void publishMonthlySummary(MonthlySummaryEvent e) {
        sendMessage(monthlySummaryTopic, e, "MonthlySummaryEvent");
    }

    private void sendMessage(String topic, Object event, String eventName) {
        try {
            Message<Object> message = MessageBuilder
                    .withPayload(event)
                    .setHeader(KafkaHeaders.TOPIC, topic)
                    .build();

            kafka.send(message).whenComplete((result, ex) -> {
                if (ex != null) {
                    logger.error("Failed to publish {} to topic {}. Event: {}", eventName, topic, event, ex);
                    handlePublishingFailure(event, ex);
                } else {
                    logger.info("Successfully published {} to topic {}", eventName, topic);
                }
            });

        } catch (Exception ex) {
            logger.error("Error publishing {} event: {}", eventName, ex.getMessage(), ex);
            handlePublishingFailure(event, ex);
        }
    }

    private void handlePublishingFailure(Object event, Throwable ex) {
        // TODO: Implement dead letter queue or retry logic
        // For now, just log the failure
        logger.warn("Event publishing failed. Consider implementing DLQ or retry mechanism: {}", event);
    }
}