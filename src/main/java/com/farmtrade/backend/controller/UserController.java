package com.farmtrade.backend.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import com.farmtrade.backend.dto.MessageResponse;
import com.farmtrade.backend.model.User;
import com.farmtrade.backend.repository.UserRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public UserController() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @PostMapping("/{id}/photo")
    @PreAuthorize("hasAuthority('FARMER') or hasAuthority('RETAILER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> uploadProfilePhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        try {
            // Normalize file name
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = "";
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            // Generate unique file name
            String fileName = UUID.randomUUID().toString() + fileExtension;

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Update user profile photo URL (relative path)
            String fileUrl = "/uploads/" + fileName;
            user.setProfilePhoto(fileUrl);
            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse(fileUrl)); // Return the URL
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(new MessageResponse("Could not upload file: " + ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('FARMER') or hasAuthority('RETAILER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        // Update fields if they are not null
        if (updatedUser.getFullName() != null)
            user.setFullName(updatedUser.getFullName());
        if (updatedUser.getMobileNumber() != null)
            user.setMobileNumber(updatedUser.getMobileNumber());
        if (updatedUser.getAddress() != null)
            user.setAddress(updatedUser.getAddress());
        if (updatedUser.getGender() != null)
            user.setGender(updatedUser.getGender());
        if (updatedUser.getDateOfBirth() != null)
            user.setDateOfBirth(updatedUser.getDateOfBirth());
        // Add other fields as needed

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Profile updated successfully!"));
    }
}
