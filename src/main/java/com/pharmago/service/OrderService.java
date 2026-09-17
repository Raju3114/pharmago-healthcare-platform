package com.pharmago.service;

import com.pharmago.dto.request.CheckoutRequestDto;
import com.pharmago.dto.request.OrderStatusUpdateDto;
import com.pharmago.dto.response.OrderResponseDto;
import com.pharmago.dto.response.PageResponseDto;

public interface OrderService {

    OrderResponseDto checkout(String userEmail, CheckoutRequestDto request);

    PageResponseDto<OrderResponseDto> getUserOrders(String userEmail, int pageNo, int pageSize);

    OrderResponseDto getOrderById(String userEmail, Long orderId);

    PageResponseDto<OrderResponseDto> getAllOrders(int pageNo, int pageSize);

    OrderResponseDto updateOrderStatus(Long orderId, OrderStatusUpdateDto request);
}
