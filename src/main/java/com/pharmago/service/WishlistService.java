package com.pharmago.service;

import com.pharmago.dto.response.WishlistResponseDto;

import java.util.List;

public interface WishlistService {

    List<WishlistResponseDto> getUserWishlist(String userEmail);

    WishlistResponseDto addToWishlist(String userEmail, Long medicineId);

    void removeFromWishlist(String userEmail, Long medicineId);
}
