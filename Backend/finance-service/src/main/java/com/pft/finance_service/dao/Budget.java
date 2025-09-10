package com.pft.finance_service.dao;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="budgets",
  uniqueConstraints = @UniqueConstraint(name="uk_user_cat_period",
    columnNames = {"user_id","category_name","year","month"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name="user_id", nullable=false) private String userId;
  @Column(name="category_name", nullable=false) private String categoryName;
  @Column(nullable=false) private Integer year;
  @Column(nullable=false) private Integer month;  // 1..12
  @Column(nullable=false) private Double amount;
}