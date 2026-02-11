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

    public Product addProduct(Product product, String username) {
        User farmer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        product.setFarmer(farmer);
        return productRepository.save(product);
    }

    public List<Product> getProductsByFarmer(String username) {
        User farmer = userRepository.findByUsername(username)
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
    public Product updateProduct(Long id, Product productDetails, String username) {
        Product product = getProductById(id);

        if (!product.getFarmer().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to update this product");
        }

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setQuantity(productDetails.getQuantity());

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id, String username) {
        Product product = getProductById(id);

        if (!product.getFarmer().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this product");
        }

        productRepository.delete(product);
    }
}
