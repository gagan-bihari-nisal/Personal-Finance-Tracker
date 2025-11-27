package com.pft.finance_service.repository;

import com.pft.finance_service.dao.Transaction;
import com.pft.finance_service.util.Type;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
  List<Transaction> findByUserIdOrderByDateDesc(String userId);
  Page<Transaction> findByUserIdOrderByDateDesc(String userId, Pageable pageable);
  List<Transaction> findByUserIdAndDateBetween(String userId, LocalDate start, LocalDate end);
  Optional<Transaction> findByIdAndUserId(Long id, String userId);
  @Query("""
    select coalesce(sum(t.amount),0) from Transaction t
    where t.userId = :userId and t.type = :type
      and t.date between :start and :end
  """)
  Double sumByUserAndTypeBetween(String userId, Type type, LocalDate start, LocalDate end);
  @Query("""
    select t.categoryName, coalesce(sum(t.amount),0) from Transaction t
    where t.userId = :userId and t.type = 'EXPENSE'
      and t.date between :start and :end
    group by t.categoryName
    order by 2 desc
  """)
  List<Object[]> expenseByCategory(String userId, LocalDate start, LocalDate end);

  @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
          "WHERE t.userId = :userId AND t.categoryName = :category " +
          "AND t.type = :type AND t.date BETWEEN :start AND :end")
  Double sumByUserAndCategoryAndTypeBetween(@Param("userId") String userId,
                                            @Param("category") String category,
                                            @Param("type") Type type,
                                            @Param("start") LocalDate start,
                                            @Param("end") LocalDate end);

  @Query("SELECT DISTINCT t.userId FROM Transaction t")
  List<String> findDistinctUserIds();
}