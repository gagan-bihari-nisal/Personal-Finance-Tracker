package com.pft.finance_service.controller;

import com.pft.finance_service.util.AuthUtil;
import com.pft.finance_service.dao.Transaction;
import com.pft.finance_service.dto.TransactionRequest;
import com.pft.finance_service.service.TransactionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Transaction> add(@RequestBody @Valid TransactionRequest req) {
        String userId = AuthUtil.currentUserId();
        return ResponseEntity.ok(service.add(userId, req));
    }

    @GetMapping
    public ResponseEntity<Page<Transaction>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return ResponseEntity.ok(service.list(AuthUtil.currentUserId(), pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> update(@PathVariable Long id,
                                              @RequestBody @Valid TransactionRequest req) {
        return ResponseEntity.ok(service.update(AuthUtil.currentUserId(), id, req));
    }

    // Delete a transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(AuthUtil.currentUserId(), id);
        return ResponseEntity.noContent().build();
    }

    // Monthly summary (income vs expenses)
    @GetMapping("/summary")
    public ResponseEntity<TransactionService.MonthlySummary> monthlySummary(
            @RequestParam @Min(2000) @Max(2100) int year,
            @RequestParam @Min(1) @Max(12) int month) {
        return ResponseEntity.ok(service.monthlySummary(AuthUtil.currentUserId(), year, month));
    }

    // Category-wise summary (good for charts)
    @GetMapping("/category-summary")
    public ResponseEntity<Map<String, Double>> categorySummary(
            @RequestParam @Min(2000) @Max(2100) int year,
            @RequestParam @Min(1) @Max(12) int month) {
        return ResponseEntity.ok(service.categorySummary(AuthUtil.currentUserId(), year, month));
    }
}