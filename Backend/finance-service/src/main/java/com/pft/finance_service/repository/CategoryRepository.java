package com.pft.finance_service.repository;

import com.pft.finance_service.dao.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
  List<Category> findByUserIdOrderByNameAsc(String userId);
}