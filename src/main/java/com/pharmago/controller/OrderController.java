package com.pharmago.controller;

import com.pharmago.dto.request.CheckoutRequestDto;
import com.pharmago.dto.request.OrderStatusUpdateDto;
import com.pharmago.dto.response.ApiResponseDto;
import com.pharmago.dto.response.OrderResponseDto;
import com.pharmago.dto.response.PageResponseDto;
import com.pharmago.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Customer Endpoints
    @PostMapping("/api/v1/orders/checkout")
    public ResponseEntity<ApiResponseDto<OrderResponseDto>> checkout(
            Authentication authentication,
            @Valid @RequestBody CheckoutRequestDto request
    ) {
        OrderResponseDto order = orderService.checkout(authentication.getName(), request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseDto.success("Order placed successfully", order));
    }

    @GetMapping("/api/v1/orders")
    public ResponseEntity<ApiResponseDto<PageResponseDto<OrderResponseDto>>> getUserOrders(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        PageResponseDto<OrderResponseDto> result = orderService.getUserOrders(authentication.getName(), pageNo, pageSize);
        return ResponseEntity.ok(ApiResponseDto.success("User orders retrieved successfully", result));
    }

    @GetMapping("/api/v1/orders/{id}")
    public ResponseEntity<ApiResponseDto<OrderResponseDto>> getOrderById(
            Authentication authentication,
            @PathVariable Long id
    ) {
        OrderResponseDto order = orderService.getOrderById(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponseDto.success("Order details retrieved successfully", order));
    }

    // Admin Endpoints
    @GetMapping("/api/v1/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<PageResponseDto<OrderResponseDto>>> getAllOrders(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        PageResponseDto<OrderResponseDto> result = orderService.getAllOrders(pageNo, pageSize);
        return ResponseEntity.ok(ApiResponseDto.success("All orders retrieved successfully", result));
    }

    @PutMapping("/api/v1/admin/orders/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<OrderResponseDto>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateDto request
    ) {
        OrderResponseDto order = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponseDto.success("Order status updated successfully", order));
    }
}
