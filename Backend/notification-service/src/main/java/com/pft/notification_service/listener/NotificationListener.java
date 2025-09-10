// src/main/java/com/pft/notification/listener/NotificationListener.java
package com.pft.notification_service.listener;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pft.notification_service.service.NotificationService;
import com.pft.pft_events.events.BudgetExceededEvent;
import com.pft.pft_events.events.ExpenseExceedsIncomeEvent;
import com.pft.pft_events.events.IncomeAddedEvent;
import com.pft.pft_events.events.MonthlySummaryEvent;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    private final Logger log = LoggerFactory.getLogger(getClass());
    private final ObjectMapper mapper;
    private final NotificationService service;

    public NotificationListener(ObjectMapper mapper, NotificationService service) {
        this.mapper = mapper;
        this.service = service;
    }

    // listen transactions topic for IncomeAddedEvent and ExpenseExceedsIncomeEvent
    @KafkaListener(topics = "${kafka.topic.transactions}", containerFactory = "kafkaListenerContainerFactory")
    public void onTransactionTopic(ConsumerRecord<String, String> record) {
        String payload = record.value();
        log.info("Received transaction event: {}", payload);
        try {
            JsonNode node = mapper.readTree(payload);

            // heuristic mapping:
            if (node.has("budget") && node.has("spent")) {
                // budget-like event — but budgets should come on budgets topic (safe-check)
                BudgetExceededEvent be = mapper.treeToValue(node, BudgetExceededEvent.class);
                service.sendBudgetExceededNotification(be);
                return;
            }

            if (node.has("totalIncome") && node.has("totalExpense")) {
                ExpenseExceedsIncomeEvent ee = mapper.treeToValue(node, ExpenseExceedsIncomeEvent.class);
                service.sendExpenseExceedsIncome(ee);
                return;
            }

            if (node.has("amount") && node.has("category") && node.has("date")) {
                IncomeAddedEvent ie = mapper.treeToValue(node, IncomeAddedEvent.class);
                service.sendIncomeNotification(ie);
                return;
            }

            log.warn("Unknown event on transactions topic: {}", payload);
//            service.sendToDlq(payload);
        } catch (Exception ex) {
            log.error("Failed to process transaction payload: {}", ex.getMessage());
//            service.sendToDlq(payload);
        }
    }

    // budgets topic (explicit BudgetExceededEvent)
    @KafkaListener(topics = "${kafka.topic.budgets}", containerFactory = "kafkaListenerContainerFactory")
    public void onBudgetsTopic(ConsumerRecord<String, String> record) {
        String payload = record.value();
        try {
            BudgetExceededEvent be = mapper.readValue(payload, BudgetExceededEvent.class);
            service.sendBudgetExceededNotification(be);
        } catch (Exception ex) {
            log.error("Failed to deserialize BudgetExceededEvent: {}", ex.getMessage());
//            service.sendToDlq(payload);
        }
    }

    // monthly-summary topic
    @KafkaListener(topics = "${kafka.topic.monthly-summary}", containerFactory = "kafkaListenerContainerFactory")
    public void onMonthlySummary(ConsumerRecord<String, String> record) {
        String payload = record.value();
        try {
            MonthlySummaryEvent me = mapper.readValue(payload, MonthlySummaryEvent.class);
            service.sendMonthlySummary(me);
        } catch (Exception ex) {
            log.error("Failed to deserialize MonthlySummaryEvent: {}", ex.getMessage());
//            service.sendToDlq(payload);
        }
    }
}
