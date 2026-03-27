package com.farmtrade.backend.service;

import com.farmtrade.backend.model.Product;
import com.farmtrade.backend.model.User;
import com.farmtrade.backend.repository.ProductRepository;
import com.farmtrade.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Product addProduct(Product product, String email) {
        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        if (farmer.getStatus() != com.farmtrade.backend.model.UserStatus.APPROVED) {
            throw new RuntimeException(
                    "Your account is pending approval. You can only add products after admin verification.");
        }
        product.setFarmer(farmer);
        return productRepository.save(product);
    }

    public List<Product> getProductsByFarmer(String email) {
        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        return productRepository.findByFarmer(farmer);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Transactional
    public Product updateProduct(Long id, Product productDetails, String email) {
        Product product = getProductById(id);

        if (!product.getFarmer().getEmail().equals(email)) {
            throw new RuntimeException("You are not authorized to update this product");
        }

        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        if (farmer.getStatus() != com.farmtrade.backend.model.UserStatus.APPROVED) {
            throw new RuntimeException(
                    "Your account is pending approval. You can only manage products after admin verification.");
        }

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setQuantity(productDetails.getQuantity());
        product.setUnit(productDetails.getUnit());
        product.setCategory(productDetails.getCategory());
        product.setImageUrl(productDetails.getImageUrl());
        product.setPerishable(productDetails.getPerishable());
        product.setShelfLifeHours(productDetails.getShelfLifeHours());

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id, String email) {
        Product product = getProductById(id);

        if (!product.getFarmer().getEmail().equals(email)) {
            throw new RuntimeException("You are not authorized to delete this product");
        }

        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        if (farmer.getStatus() != com.farmtrade.backend.model.UserStatus.APPROVED) {
            throw new RuntimeException(
                    "Your account is pending approval. You can only manage products after admin verification.");
        }

        productRepository.delete(product);
    }
}
