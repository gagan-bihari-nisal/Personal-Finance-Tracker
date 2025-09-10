package com.pft.finance_service.dao;

import com.pft.finance_service.util.Type;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name="transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false) private String userId;

  @Enumerated(EnumType.STRING) @Column(nullable = false)
  private Type type; // INCOME / EXPENSE


  @Column(nullable = false) private String categoryName;
  @Column(nullable = false) private Double amount;
  private String description;
  @Column(nullable = false) private LocalDate date;
}