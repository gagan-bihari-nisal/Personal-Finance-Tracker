package com.pft.finance_service.service;

import com.pft.finance_service.dao.Transaction;
import com.pft.finance_service.dto.TransactionRequest;
import com.pft.finance_service.events.TransactionEventProcessor;
import com.pft.finance_service.util.Type;
import com.pft.finance_service.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    private final TransactionRepository repo;
    private final TransactionEventProcessor eventProcessor;

    public TransactionService(TransactionRepository repo, TransactionEventProcessor eventProcessor) {
        this.repo = repo;
        this.eventProcessor = eventProcessor;
    }

    @Transactional
    public Transaction add(String userId, TransactionRequest r) {
        Transaction t = Transaction.builder()
                .userId(userId)
                .type(r.type())
                .categoryName(r.categoryName())
                .amount(r.amount())
                .description(r.description())
                .date(r.date())
                .build();
        Transaction saved = repo.save(t);

        eventProcessor.processAfterTransactionSaved(saved);

        return saved;
    }

    public List<Transaction> list(String userId) {
        return repo.findByUserIdOrderByDateDesc(userId);
    }

    public record MonthlySummary(double income, double expense, double savings, boolean overspent) {
    }

    public MonthlySummary monthlySummary(String userId, int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        double income = repo.sumByUserAndTypeBetween(userId, Type.INCOME, start, end);
        double expense = repo.sumByUserAndTypeBetween(userId, Type.EXPENSE, start, end);
        boolean overspent = expense > income;
        return new MonthlySummary(income, expense, income - expense, overspent);
    }

    // Update an existing transaction
    @Transactional
    public Transaction update(String userId, Long id, TransactionRequest r) {
        Transaction existing = repo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        existing.setType(r.type());
        existing.setCategoryName(r.categoryName());
        existing.setAmount(r.amount());
        existing.setDescription(r.description());
        existing.setDate(r.date());

        return repo.save(existing);
    }

    // Delete a transaction
    @Transactional
    public void delete(String userId, Long id) {
        Transaction existing = repo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        repo.delete(existing);
    }

    // Category summary for a given month
    public Map<String, Double> categorySummary(String userId, int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Transaction> txs = repo.findByUserIdAndDateBetween(userId, start, end);

        return txs.stream()
                .filter(t -> t.getType() == Type.EXPENSE) // group only expenses
                .collect(Collectors.groupingBy(
                        Transaction::getCategoryName,
                        Collectors.summingDouble(Transaction::getAmount)
                ));
    }
}