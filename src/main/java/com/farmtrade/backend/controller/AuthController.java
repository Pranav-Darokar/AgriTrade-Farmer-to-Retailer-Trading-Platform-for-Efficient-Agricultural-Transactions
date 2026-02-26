package com.farmtrade.backend.controller;

import com.farmtrade.backend.model.UserStatus;
import org.springframework.security.authentication.DisabledException;

import java.util.List;

import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmtrade.backend.config.JwtUtils;
import com.farmtrade.backend.dto.JwtResponse;
import com.farmtrade.backend.dto.LoginRequest;
import com.farmtrade.backend.dto.MessageResponse;
import com.farmtrade.backend.dto.SignupRequest;
import com.farmtrade.backend.model.Role;
import com.farmtrade.backend.model.User;
import com.farmtrade.backend.repository.UserRepository;
import com.farmtrade.backend.service.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles,
                    userDetails.getFullName(),
                    userDetails.getMobileNumber(),
                    userDetails.getAddress(),
                    userDetails.getGender(),
                    userDetails.getDateOfBirth() != null ? userDetails.getDateOfBirth().toString() : null,
                    userDetails.getAadhaarNumber(),
                    userDetails.getLicenceNumber(),
                    userDetails.getProfilePhoto()));
        } catch (DisabledException e) {
            return ResponseEntity.badRequest().body(
                    new MessageResponse("Error: Account is pending approval. Please wait for admin verification."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid username or password"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        // Map new fields
        user.setFullName(signUpRequest.getFullName());
        user.setMobileNumber(signUpRequest.getMobileNumber());
        user.setContactInfo(signUpRequest.getMobileNumber()); // for backward compatibility
        // user.setEmail already set above
        user.setAddress(signUpRequest.getAddress());
        user.setGender(signUpRequest.getGender());
        user.setDateOfBirth(signUpRequest.getDateOfBirth());

        // Handle role-specific logic
        if (signUpRequest.getRole() != null && signUpRequest.getRole().contains("retailer")) {
            user.setRole(Role.RETAILER);
            user.setLicenceNumber(signUpRequest.getLicenceNumber());
        } else {
            user.setRole(Role.FARMER); // Default
            user.setAadhaarNumber(signUpRequest.getAadhaarNumber());
        }

        user.setStatus(UserStatus.APPROVED); // Allow login immediately after signup

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));

    }

    @Autowired
    private com.farmtrade.backend.repository.PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private com.farmtrade.backend.service.EmailService emailService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Error: User not found with email: " + email));

        // Create token
        String token = java.util.UUID.randomUUID().toString();

        // Delete any existing token for this user
        // Note: In a real app, handle transaction/cleanup properly.
        // For simplicity, we just save a new one. The repository method needs
        // @Transactional if using deleteByUser
        // checking if exists first might be safer for now without custom repo methods

        com.farmtrade.backend.model.PasswordResetToken resetToken = new com.farmtrade.backend.model.PasswordResetToken(
                token, user);
        passwordResetTokenRepository.save(resetToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        emailService.sendSimpleMessage(
                user.getEmail(),
                "Password Reset Request",
                "To reset your password, click the link below:\n" + resetLink);

        return ResponseEntity.ok(new MessageResponse("Reset link sent to your email."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        com.farmtrade.backend.model.PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.isExpired()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Token expired"));
        }

        User user = resetToken.getUser();
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);

        // Optional: Delete token after use
        passwordResetTokenRepository.delete(resetToken);

        return ResponseEntity.ok(new MessageResponse("Password reset successfully."));
    }
}
