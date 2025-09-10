package com.pft.finance_service.repository;

import com.pft.finance_service.dao.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
  Optional<Budget> findByUserIdAndCategoryNameAndYearAndMonth(
      String userId, String categoryName, Integer year, Integer month);
  List<Budget> findByUserId(String userId);
  Optional<Budget> findByIdAndUserId(Long id, String userId);
  // For dashboard view (all categories in a month)
  List<Budget> findByUserIdAndYearAndMonth(String userId, int year, int month);
  // For single category status
  Optional<Budget> findByUserIdAndCategoryNameAndYearAndMonth(
          String userId,
          String categoryName,
          int year,
          int month
  );


}