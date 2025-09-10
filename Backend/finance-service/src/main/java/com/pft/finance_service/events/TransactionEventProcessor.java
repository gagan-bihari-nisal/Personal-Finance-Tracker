package com.pft.finance_service.events;

import com.pft.finance_service.dao.Budget;
import com.pft.finance_service.dao.Transaction;
import com.pft.finance_service.repository.BudgetRepository;
import com.pft.finance_service.repository.TransactionRepository;
import com.pft.finance_service.util.Type;
import com.pft.pft_events.events.BudgetExceededEvent;
import com.pft.pft_events.events.ExpenseExceedsIncomeEvent;
import com.pft.pft_events.events.IncomeAddedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TransactionEventProcessor {

    private final TransactionRepository repo;
    private final BudgetRepository budgetRepo;
    private final EventPublisher publisher;

    public void processAfterTransactionSaved(Transaction t) {
        YearMonth ym = YearMonth.from(t.getDate());
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        // 1. Income event
        if (t.getType() == Type.INCOME) {
            publisher.publishIncomeAdded(new IncomeAddedEvent(
                t.getUserId(), t.getCategoryName(), t.getAmount(), t.getDate(), LocalDateTime.now()
            ));
        }

        // 2. Budget exceeded event
        if (t.getType() == Type.EXPENSE) {
            Optional<Budget> maybeBudget =
                budgetRepo.findByUserIdAndCategoryNameAndYearAndMonth(
                    t.getUserId(), t.getCategoryName(), ym.getYear(), ym.getMonthValue());
            maybeBudget.ifPresent(budget -> {
                double prevSpent = repo.sumByUserAndCategoryAndTypeBetween(
                    t.getUserId(), t.getCategoryName(), Type.EXPENSE, start, end) - t.getAmount();
                double newSpent = prevSpent + t.getAmount();
                if (newSpent > budget.getAmount()) {
                    publisher.publishBudgetExceeded(new BudgetExceededEvent(
                        t.getUserId(), t.getCategoryName(),
                        budget.getAmount(), newSpent, LocalDateTime.now()
                    ));
                }
            });
        }

        // 3. Expense > Income event
        double income = repo.sumByUserAndTypeBetween(t.getUserId(), Type.INCOME, start, end);
        double expense = repo.sumByUserAndTypeBetween(t.getUserId(), Type.EXPENSE, start, end);

        if (expense > income) {
            publisher.publishExpenseExceedsIncome(new ExpenseExceedsIncomeEvent(
                t.getUserId(), income, expense, expense - income,
                ym.getYear(), ym.getMonthValue(), LocalDateTime.now()
            ));
        }
    }
}