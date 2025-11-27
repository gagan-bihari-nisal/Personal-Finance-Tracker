package com.pft.finance_service.controller;

import com.pft.finance_service.dao.Budget;
import com.pft.finance_service.dto.BudgetRequest;
import com.pft.finance_service.service.BudgetService;
import com.pft.finance_service.util.AuthUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
public class BudgetController {
    private final BudgetService service;

    public BudgetController(BudgetService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Budget> upsert(@RequestBody @Valid BudgetRequest req) {
        return ResponseEntity.ok(service.upsert(AuthUtil.currentUserId(), req));
    }

    // Get all budgets for the current user
    @GetMapping
    public ResponseEntity<List<Budget>> getAll() {
        return ResponseEntity.ok(service.list(AuthUtil.currentUserId()));
    }

    // Delete budget
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(AuthUtil.currentUserId(), id);
        return ResponseEntity.noContent().build();
    }

    // Single category budget status
    @GetMapping("/status/category")
    public ResponseEntity<BudgetService.BudgetStatus> budgetStatusForCategory(
            @RequestParam String category,
            @RequestParam @Min(2000) @Max(2100) int year,
            @RequestParam @Min(1) @Max(12) int month) {
        return ResponseEntity.ok(
                service.budgetStatus(AuthUtil.currentUserId(), category, year, month)
        );
    }

    // Dashboard (all categories)
    @GetMapping("/status")
    public ResponseEntity<List<BudgetService.BudgetStatus>> budgetStatusForMonth(
            @RequestParam @Min(2000) @Max(2100) int year,
            @RequestParam @Min(1) @Max(12) int month) {
        return ResponseEntity.ok(
                service.budgetStatus(AuthUtil.currentUserId(), year, month)
        );
    }
}

