package com.farmtrade.backend.controller;

import com.farmtrade.backend.model.Product;
import com.farmtrade.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    @Autowired
    private ProductService productService;

    // Public endpoint to view all products (for Retailers and browsing)
    @GetMapping("/public/products")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Farmer endpoints
    @PostMapping("/farmer/products")
    @PreAuthorize("hasAuthority('FARMER')")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // In our case, principal name is username
        // Actually UsernamePasswordAuthenticationToken principal is UserDetails, but
        // getName() delegates probably.
        // Let's use UserDetails to be safe if needed, but getName() usually works if
        // principal is standard.
        // In AuthTokenFilter we set authentication with UserDetails.
        // SecurityContextHolder.getContext().getAuthentication().getName() returns
        // username from UserDetails.

        return ResponseEntity.ok(productService.addProduct(product, username));
    }

    @GetMapping("/farmer/products")
    @PreAuthorize("hasAuthority('FARMER')")
    public List<Product> getMyProducts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return productService.getProductsByFarmer(auth.getName());
    }

    @PutMapping("/farmer/products/{id}")
    @PreAuthorize("hasAuthority('FARMER')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(productService.updateProduct(id, product, auth.getName()));
    }

    @DeleteMapping("/farmer/products/{id}")
    @PreAuthorize("hasAuthority('FARMER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        productService.deleteProduct(id, auth.getName());
        return ResponseEntity.ok("Product deleted successfully");
    }
}
