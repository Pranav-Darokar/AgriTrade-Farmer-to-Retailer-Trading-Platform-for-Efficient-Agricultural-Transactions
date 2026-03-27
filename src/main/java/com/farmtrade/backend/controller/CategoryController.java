package com.farmtrade.backend.controller;

import com.farmtrade.backend.model.Category;
import com.farmtrade.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private com.farmtrade.backend.repository.ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> addCategory(@RequestBody Category categoryRequest) {
        if (categoryRepository.findByName(categoryRequest.getName()).isPresent()) {
            return ResponseEntity.badRequest().body("Category already exists");
        }
        Category newCategory = categoryRepository.save(new Category(categoryRequest.getName()));
        return ResponseEntity.ok(newCategory);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        return categoryRepository.findById(id).map(category -> {
            // Find products using this category name and reset them
            List<com.farmtrade.backend.model.Product> products = productRepository.findByCategory(category.getName());
            for (com.farmtrade.backend.model.Product p : products) {
                p.setCategory("Uncategorized");
                productRepository.save(p);
            }
            categoryRepository.delete(category);
            return ResponseEntity.ok("Category deleted and related products updated to 'Uncategorized'");
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category categoryRequest) {
        return categoryRepository.findById(id)
                .map(category -> {
                    String oldName = category.getName();
                    String newName = categoryRequest.getName();

                    category.setName(newName);
                    categoryRepository.save(category);

                    // Sync all products with the new name
                    List<com.farmtrade.backend.model.Product> products = productRepository.findByCategory(oldName);
                    for (com.farmtrade.backend.model.Product p : products) {
                        p.setCategory(newName);
                        productRepository.save(p);
                    }

                    return ResponseEntity.ok("Category updated and products synced successfully");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
