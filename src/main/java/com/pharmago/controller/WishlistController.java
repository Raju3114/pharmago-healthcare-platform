package com.pharmago.controller;

import com.pharmago.dto.response.ApiResponseDto;
import com.pharmago.dto.response.WishlistResponseDto;
import com.pharmago.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<ApiResponseDto<List<WishlistResponseDto>>> getUserWishlist(Authentication authentication) {
        List<WishlistResponseDto> wishlist = wishlistService.getUserWishlist(authentication.getName());
        return ResponseEntity.ok(ApiResponseDto.success("Wishlist retrieved successfully", wishlist));
    }

    @PostMapping("/{medicineId}")
    public ResponseEntity<ApiResponseDto<WishlistResponseDto>> addToWishlist(
            Authentication authentication,
            @PathVariable Long medicineId
    ) {
        WishlistResponseDto item = wishlistService.addToWishlist(authentication.getName(), medicineId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseDto.success("Medicine added to wishlist successfully", item));
    }

    @DeleteMapping("/{medicineId}")
    public ResponseEntity<ApiResponseDto<Void>> removeFromWishlist(
            Authentication authentication,
            @PathVariable Long medicineId
    ) {
        wishlistService.removeFromWishlist(authentication.getName(), medicineId);
        return ResponseEntity.ok(ApiResponseDto.success("Medicine removed from wishlist successfully", null));
    }
}
