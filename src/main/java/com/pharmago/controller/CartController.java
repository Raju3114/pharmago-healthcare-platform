package com.pharmago.controller;

import com.pharmago.dto.request.AddToCartRequestDto;
import com.pharmago.dto.request.UpdateCartItemRequestDto;
import com.pharmago.dto.response.ApiResponseDto;
import com.pharmago.dto.response.CartResponseDto;
import com.pharmago.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponseDto<CartResponseDto>> getUserCart(Authentication authentication) {
        CartResponseDto cart = cartService.getUserCart(authentication.getName());
        return ResponseEntity.ok(ApiResponseDto.success("Cart retrieved successfully", cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponseDto<CartResponseDto>> addToCart(
            Authentication authentication,
            @Valid @RequestBody AddToCartRequestDto request
    ) {
        CartResponseDto cart = cartService.addToCart(authentication.getName(), request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseDto.success("Item added to cart successfully", cart));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ApiResponseDto<CartResponseDto>> updateCartItem(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequestDto request
    ) {
        CartResponseDto cart = cartService.updateCartItem(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponseDto.success("Cart item updated successfully", cart));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<ApiResponseDto<CartResponseDto>> removeCartItem(
            Authentication authentication,
            @PathVariable Long id
    ) {
        CartResponseDto cart = cartService.removeCartItem(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponseDto.success("Cart item removed successfully", cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponseDto<CartResponseDto>> clearCart(Authentication authentication) {
        CartResponseDto cart = cartService.clearCart(authentication.getName());
        return ResponseEntity.ok(ApiResponseDto.success("Cart cleared successfully", cart));
    }
}
