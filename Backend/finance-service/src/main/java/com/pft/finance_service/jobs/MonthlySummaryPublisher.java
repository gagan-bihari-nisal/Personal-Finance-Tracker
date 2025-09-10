package com.pft.finance_service.jobs;

import com.pft.finance_service.events.EventPublisher;
import com.pft.finance_service.repository.TransactionRepository;
import com.pft.finance_service.service.TransactionService;
import com.pft.pft_events.events.MonthlySummaryEvent;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Component
public class MonthlySummaryPublisher {

    private final TransactionService txService;
    private final TransactionRepository txRepo;
    private final EventPublisher publisher;

    public MonthlySummaryPublisher(TransactionService txService,
                                   TransactionRepository txRepo,
                                   EventPublisher publisher) {
        this.txService = txService;
        this.txRepo = txRepo;
        this.publisher = publisher;
    }

    // Run at 02:00 on the 1st day of every month (server time)
    @Scheduled(cron = "0 0 2 1 * ?")
    public void publishPreviousMonthSummaries() {
        YearMonth prev = YearMonth.now().minusMonths(1);
        int year = prev.getYear();
        int month = prev.getMonthValue();

        // get all users that have transactions (simple approach)
        List<String> users = txRepo.findDistinctUserIds();

        for (String userId : users) {
            var sum = txService.monthlySummary(userId, year, month);
            MonthlySummaryEvent evt = new MonthlySummaryEvent(
                    userId,
                    year,
                    month,
                    sum.income(),
                    sum.expense(),
                    sum.savings(),
                    LocalDateTime.now()
            );
            publisher.publishMonthlySummary(evt);
        }
    }
}