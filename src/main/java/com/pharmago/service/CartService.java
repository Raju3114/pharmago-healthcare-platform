package com.pharmago.service;

import com.pharmago.dto.request.AddToCartRequestDto;
import com.pharmago.dto.request.UpdateCartItemRequestDto;
import com.pharmago.dto.response.CartResponseDto;

public interface CartService {

    CartResponseDto getUserCart(String userEmail);

    CartResponseDto addToCart(String userEmail, AddToCartRequestDto request);

    CartResponseDto updateCartItem(String userEmail, Long cartItemId, UpdateCartItemRequestDto request);

    CartResponseDto removeCartItem(String userEmail, Long cartItemId);

    CartResponseDto clearCart(String userEmail);
}
