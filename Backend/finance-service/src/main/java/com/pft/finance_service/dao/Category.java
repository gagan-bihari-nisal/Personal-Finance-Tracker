package com.pft.finance_service.dao;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="categories",
  uniqueConstraints = @UniqueConstraint(name="uk_user_category", columnNames={"user_id","name"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name="user_id", nullable=false)
  private String userId;
  @Column(nullable=false) private String name;
}