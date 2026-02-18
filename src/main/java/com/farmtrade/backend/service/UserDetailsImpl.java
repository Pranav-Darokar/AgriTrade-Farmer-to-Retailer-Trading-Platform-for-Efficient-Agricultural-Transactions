package com.farmtrade.backend.service;

import com.farmtrade.backend.model.User;
import com.farmtrade.backend.model.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;

    private String email;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    private String fullName;
    private String mobileNumber;
    private String address;
    private String gender;
    private java.time.LocalDate dateOfBirth;
    private String aadhaarNumber;
    private String licenceNumber;
    private String profilePhoto;
    private UserStatus status;

    public UserDetailsImpl(Long id, String email, String password,
            Collection<? extends GrantedAuthority> authorities,
            String fullName, String mobileNumber, String address, String gender,
            java.time.LocalDate dateOfBirth, String aadhaarNumber, String licenceNumber, String profilePhoto,
            UserStatus status) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.fullName = fullName;
        this.mobileNumber = mobileNumber;
        this.address = address;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.aadhaarNumber = aadhaarNumber;
        this.licenceNumber = licenceNumber;
        this.profilePhoto = profilePhoto;
        this.status = status;
    }

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(user.getRole().name()));

        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                authorities,
                user.getFullName(),
                user.getMobileNumber(),
                user.getAddress(),
                user.getGender(),
                user.getDateOfBirth(),
                user.getAadhaarNumber(),
                user.getLicenceNumber(),
                user.getProfilePhoto(),
                user.getStatus());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Long getId() {
        return id;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Only allow login if status is APPROVED
        return status == UserStatus.APPROVED;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public String getAddress() {
        return address;
    }

    public String getGender() {
        return gender;
    }

    public java.time.LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public String getLicenceNumber() {
        return licenceNumber;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
