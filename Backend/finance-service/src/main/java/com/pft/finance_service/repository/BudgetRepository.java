package com.pft.finance_service.repository;

import com.pft.finance_service.dao.Budget;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
  // Pessimistic read lock to prevent race conditions on upsert
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("SELECT b FROM Budget b WHERE b.userId = :userId AND b.categoryName = :categoryName AND b.year = :year AND b.month = :month")
  Optional<Budget> findByUserIdAndCategoryNameAndYearAndMonth(
      String userId, String categoryName, Integer year, Integer month);
  
  List<Budget> findByUserId(String userId);
  Optional<Budget> findByIdAndUserId(Long id, String userId);
  // For dashboard view (all categories in a month)
  List<Budget> findByUserIdAndYearAndMonth(String userId, int year, int month);
  // For single category status (read-only, no lock needed)
  @Query("SELECT b FROM Budget b WHERE b.userId = :userId AND b.categoryName = :categoryName AND b.year = :year AND b.month = :month")
  Optional<Budget> findBudgetStatus(
          String userId,
          String categoryName,
          int year,
          int month
  );


}