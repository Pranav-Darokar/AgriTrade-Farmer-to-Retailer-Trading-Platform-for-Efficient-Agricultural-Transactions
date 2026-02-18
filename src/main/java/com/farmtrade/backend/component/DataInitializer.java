package com.farmtrade.backend.component;

import com.farmtrade.backend.model.Role;
import com.farmtrade.backend.model.User;
import com.farmtrade.backend.model.UserStatus;
import com.farmtrade.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin exists
        if (!userRepository.existsByEmail("admin@farmtrade.com")) {
            User admin = new User();
            admin.setEmail("admin@farmtrade.com");
            admin.setPassword(encoder.encode("admin123"));
            admin.setFullName("Super Admin");
            admin.setRole(Role.ADMIN);
            admin.setStatus(UserStatus.APPROVED);
            admin.setMobileNumber("0000000000");
            admin.setAddress("Admin HQ");

            userRepository.save(admin);
            System.out.println("Admin user seeded: admin@farmtrade.com / admin123");
        }
    }
}
