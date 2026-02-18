package com.farmtrade.backend.dto;

import java.util.List;
import lombok.Data;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email; // Keeping for compatibility, though we use username
    private List<String> roles;

    private String fullName;
    private String mobileNumber;
    private String address;
    private String gender;
    private String dateOfBirth;
    private String aadhaarNumber;
    private String licenceNumber;
    private String profilePhoto;

    public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles,
            String fullName, String mobileNumber, String address, String gender, String dateOfBirth,
            String aadhaarNumber, String licenceNumber, String profilePhoto) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.fullName = fullName;
        this.mobileNumber = mobileNumber;
        this.address = address;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.aadhaarNumber = aadhaarNumber;
        this.licenceNumber = licenceNumber;
        this.profilePhoto = profilePhoto;
    }
}
