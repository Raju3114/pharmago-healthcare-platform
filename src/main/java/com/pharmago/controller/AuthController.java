package com.pharmago.controller;

import com.pharmago.dto.request.LoginRequestDto;
import com.pharmago.dto.request.RefreshTokenRequestDto;
import com.pharmago.dto.request.RegisterRequestDto;
import com.pharmago.dto.response.ApiResponseDto;
import com.pharmago.dto.response.AuthResponseDto;
import com.pharmago.dto.response.UserResponseDto;
import com.pharmago.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDto<AuthResponseDto>> register(@Valid @RequestBody RegisterRequestDto registerRequest) {
        AuthResponseDto authResponse = authService.register(registerRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseDto.success("User registered successfully", authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto<AuthResponseDto>> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        AuthResponseDto authResponse = authService.login(loginRequest);
        return ResponseEntity
                .ok(ApiResponseDto.success("Authentication successful", authResponse));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponseDto<AuthResponseDto>> refreshToken(@Valid @RequestBody RefreshTokenRequestDto refreshTokenRequest) {
        AuthResponseDto authResponse = authService.refreshToken(refreshTokenRequest);
        return ResponseEntity
                .ok(ApiResponseDto.success("Token refreshed successfully", authResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponseDto<UserResponseDto>> getCurrentUser(Authentication authentication) {
        UserResponseDto userResponse = authService.getCurrentUser(authentication.getName());
        return ResponseEntity
                .ok(ApiResponseDto.success("Fetched profile successfully", userResponse));
    }
}
