package com.pft.finance_service.service;

import com.pft.finance_service.dao.Budget;
import com.pft.finance_service.dto.BudgetRequest;
import com.pft.finance_service.repository.BudgetRepository;
import com.pft.finance_service.repository.TransactionRepository;
import com.pft.finance_service.util.Type;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class BudgetService {
  private final BudgetRepository repo;

  private final TransactionRepository transactionRepo;

  public BudgetService(BudgetRepository repo, TransactionRepository transactionRepo) {
    this.repo = repo;
    this.transactionRepo = transactionRepo;
  }

  @Transactional
  public Budget upsert(String userId, BudgetRequest r) {
    var existing = repo.findByUserIdAndCategoryNameAndYearAndMonth(
      userId, r.categoryName(), r.year(), r.month());
    if (existing.isPresent()) {
      var b = existing.get();
      b.setAmount(r.amount());
      return repo.save(b);
    }
    return repo.save(Budget.builder()
      .userId(userId).categoryName(r.categoryName())
      .year(r.year()).month(r.month()).amount(r.amount()).build());
  }

  // Get all budgets for a user
  public List<Budget> list(String userId) {
    return repo.findByUserId(userId);
  }

  // Get a budget for a specific category/month
  public Budget getBudget(String userId, String category, int year, int month) {
    return repo.findByUserIdAndCategoryNameAndYearAndMonth(userId, category, year, month)
            .orElseThrow(() -> new RuntimeException("Budget not found"));
  }

  // Delete a budget
  @Transactional
  public void delete(String userId, Long id) {
    Budget existing = repo.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new RuntimeException("Budget not found"));
    repo.delete(existing);
  }

  // Budget status record
  public record BudgetStatus(String category, double budget, double spent, double remaining, boolean exceeded) {}

  // Single-category check
  public BudgetStatus budgetStatus(String userId, String category, int year, int month) {
    Budget budget = repo.findByUserIdAndCategoryNameAndYearAndMonth(userId, category, year, month)
            .orElseThrow(() -> new RuntimeException("No budget found for category: " + category));

    YearMonth ym = YearMonth.of(year, month);
    LocalDate start = ym.atDay(1);
    LocalDate end   = ym.atEndOfMonth();

    double spent = transactionRepo.sumByUserAndCategoryAndTypeBetween(
            userId, category, Type.EXPENSE, start, end);

    double remaining = budget.getAmount() - spent;
    boolean exceeded = spent > budget.getAmount();

    return new BudgetStatus(category, budget.getAmount(), spent, remaining, exceeded);
  }

  // Dashboard view (all categories for a month)
  public List<BudgetStatus> budgetStatus(String userId, int year, int month) {
    var budgets = repo.findByUserIdAndYearAndMonth(userId, year, month);

    YearMonth ym = YearMonth.of(year, month);
    LocalDate start = ym.atDay(1);
    LocalDate end   = ym.atEndOfMonth();

    return budgets.stream().map(b -> {
      double spent = transactionRepo.sumByUserAndCategoryAndTypeBetween(
              userId, b.getCategoryName(), Type.EXPENSE, start, end);
      double remaining = b.getAmount() - spent;
      boolean exceeded = spent > b.getAmount();
      return new BudgetStatus(b.getCategoryName(), b.getAmount(), spent, remaining, exceeded);
    }).toList();
  }

}