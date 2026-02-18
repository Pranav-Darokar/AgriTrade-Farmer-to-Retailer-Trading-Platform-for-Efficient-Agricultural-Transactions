package com.farmtrade.backend.dto;

import java.util.Set;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    private Set<String> role;

    private String fullName;

    @NotBlank
    @Size(min = 10, max = 15)
    private String mobileNumber;

    @Email
    private String email;

    @NotBlank
    private String address;

    private String gender;

    private java.time.LocalDate dateOfBirth;

    @Size(min = 12, max = 12)
    private String aadhaarNumber;

    // For retailers
    private String licenceNumber;

    // Optional/Deprecated
    private String contactInfo;
}
