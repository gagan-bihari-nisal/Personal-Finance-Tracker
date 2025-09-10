package com.pft.notification_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pft.pft_events.events.BudgetExceededEvent;
import com.pft.pft_events.events.ExpenseExceedsIncomeEvent;
import com.pft.pft_events.events.IncomeAddedEvent;
import com.pft.pft_events.events.MonthlySummaryEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class NotificationService {
    private final Logger log = LoggerFactory.getLogger(getClass());
    private final JavaMailSender mailSender;
    private final RestTemplate rest;
    private final ObjectMapper mapper;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${auth.service.base-url}")
    private String authBaseUrl;

    @Value("${kafka.topic.dlq}")
    private String dlqTopic;

    public NotificationService(JavaMailSender mailSender,
                               RestTemplate rest,
                               ObjectMapper mapper,
                               KafkaTemplate<String, String> kafkaTemplate) {
        this.mailSender = mailSender;
        this.rest = rest;
        this.mapper = mapper;
        this.kafkaTemplate = kafkaTemplate;
    }

    // Resolve userId -> email by calling Auth Service.
    // Expects Auth service to expose GET /users/{userId} or configured path.
    public String resolveEmail(String userId) {
        try {
            String url = authBaseUrl + "/user/" + userId; // adjust endpoint if needed
            ResponseEntity<Map> resp = rest.getForEntity(url, Map.class);
            if (resp.getStatusCode().is2xxSuccessful()) {
                resp.getBody();
                String email = resp.getBody().get("email").toString();
                if (email != null) return email;
            }
        } catch (Exception ex) {
            log.warn("Failed to resolve email for user {}: {}", userId, ex.getMessage());
        }
        return null;
    }

    public void sendIncomeNotification(IncomeAddedEvent e) {
        String email = resolveEmail(e.userId());
        if (email == null) {
            // Optionally DLQ the event
            dlq(e);
            return;
        }

        String subject = "Income added: " + e.category();
        String body = String.format("Hi,\n\nAn income of %.2f was added for %s on %s. Start setting up your budget, if not done.\n\nRegards,\nPersonal Finance Tracker",
                e.amount(), e.category(), e.date().toString());

        sendEmail(email, subject, body);
    }

    public void sendBudgetExceededNotification(BudgetExceededEvent e) {
        String email = resolveEmail(e.userId());
        if (email == null) { dlq(e); return; }

        String subject = "Budget exceeded: " + e.category();
        String body = String.format("Hi,\n\nYou had budgeted %.2f for %s but have spent %.2f. The overspent amount is %.2f.\nPlease review your expenses.\n\nRegards,\nPersonal Finance Tracker",
                e.budget(), e.category(), e.spent(), e.spent() - e.budget());


        sendEmail(email, subject, body);
    }

    public void sendExpenseExceedsIncome(ExpenseExceedsIncomeEvent e) {
        String email = resolveEmail(e.userId());
        if (email == null) { dlq(e); return; }

        String subject = "You overspent this month";
        String body = String.format("Hi,\n\nYour expenses (%.2f) exceeded your income (%.2f) for %d-%02d. Deficit: %.2f.\n\nRegards,\nPersonal Finance Tracker",
                e.totalExpense(), e.totalIncome(), e.year(), e.month(), e.deficit());
        sendEmail(email, subject, body);
    }

    public void sendMonthlySummary(MonthlySummaryEvent e) {
        String email = resolveEmail(e.userId());
        if (email == null) { dlq(e); return; }

        String subject = String.format("Monthly summary: %d-%02d", e.year(), e.month());
        String body = String.format("Hi,\n\nSummary for %d-%02d:\nIncome: %.2f\nExpense: %.2f\nSavings: %.2f\n\nRegards",
                e.year(), e.month(), e.totalIncome(), e.totalExpense(), e.savings());
        sendEmail(email, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            log.info("Sent email to {} subj={}", to, subject);
        } catch (Exception ex) {
            log.error("Failed to send email to {}: {}", to, ex.getMessage());
            // optionally DLQ or retry
        }
    }

    private void dlq(Object event) {
        try {
            String json = mapper.writeValueAsString(event);
            kafkaTemplate.send(dlqTopic, json);
            log.warn("Sent event to DLQ: {}", dlqTopic);
        } catch (Exception e) {
            log.error("Failed to send to DLQ: {}", e.getMessage());
        }
    }
}