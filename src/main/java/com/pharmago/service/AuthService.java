package com.pharmago.service;

import com.pharmago.dto.request.LoginRequestDto;
import com.pharmago.dto.request.RefreshTokenRequestDto;
import com.pharmago.dto.request.RegisterRequestDto;
import com.pharmago.dto.response.AuthResponseDto;
import com.pharmago.dto.response.UserResponseDto;

public interface AuthService {

    AuthResponseDto register(RegisterRequestDto registerRequest);

    AuthResponseDto login(LoginRequestDto loginRequest);

    AuthResponseDto refreshToken(RefreshTokenRequestDto refreshTokenRequest);

    UserResponseDto getCurrentUser(String email);
}
