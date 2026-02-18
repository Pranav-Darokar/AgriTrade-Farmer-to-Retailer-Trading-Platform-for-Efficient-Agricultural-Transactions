package com.farmtrade.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String fullName;

    // mobileNumber replaces contactInfo
    private String mobileNumber;

    private String address;
    private String gender;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    private java.time.LocalDate dateOfBirth;
    private String aadhaarNumber;
    private String licenceNumber;

    // Deprecated, use mobileNumber and email instead
    private String contactInfo;

    private String profilePhoto;
}
