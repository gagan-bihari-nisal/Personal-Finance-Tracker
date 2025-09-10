package com.pft.finance_service.controller;

import com.pft.finance_service.util.AuthUtil;
import com.pft.finance_service.dao.Transaction;
import com.pft.finance_service.dto.TransactionRequest;
import com.pft.finance_service.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
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
    public ResponseEntity<Transaction> add(@RequestBody @Valid TransactionRequest req, BindingResult bindingResults) throws Exception {
        if (bindingResults.hasErrors()) {
            throw new Exception(bindingResults.getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .reduce((e1, e2) -> e1 + " " + e2).orElse(""));
        }
        String userId = AuthUtil.currentUserId();

        return ResponseEntity.ok(service.add(userId, req));
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> list() {
        return ResponseEntity.ok(service.list(AuthUtil.currentUserId()));
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
            @RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(service.monthlySummary(AuthUtil.currentUserId(), year, month));
    }

    // Category-wise summary (good for charts)
    @GetMapping("/category-summary")
    public ResponseEntity<Map<String, Double>> categorySummary(@RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(service.categorySummary(AuthUtil.currentUserId(), year, month));
    }
}