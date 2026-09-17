package com.pharmago.service.impl;

import com.pharmago.dto.request.CheckoutRequestDto;
import com.pharmago.dto.request.OrderStatusUpdateDto;
import com.pharmago.dto.response.OrderItemResponseDto;
import com.pharmago.dto.response.OrderResponseDto;
import com.pharmago.dto.response.PageResponseDto;
import com.pharmago.enums.NotificationType;
import com.pharmago.enums.OrderStatus;
import com.pharmago.enums.PaymentMethod;
import com.pharmago.enums.PaymentStatus;
import com.pharmago.exception.BadRequestException;
import com.pharmago.exception.ResourceNotFoundException;
import com.pharmago.model.*;
import com.pharmago.repository.*;
import com.pharmago.service.NotificationService;
import com.pharmago.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public OrderResponseDto checkout(String userEmail, CheckoutRequestDto request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart is empty. Please add items before checking out."));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot place order with an empty cart.");
        }

        for (CartItem cartItem : cart.getItems()) {
            Medicine medicine = cartItem.getMedicine();

            if (!Boolean.TRUE.equals(medicine.getIsActive())) {
                throw new BadRequestException("Medicine '" + medicine.getName() + "' is no longer available.");
            }

            if (cartItem.getQuantity() > medicine.getStockQuantity()) {
                throw new BadRequestException("Requested quantity for '" + medicine.getName() +
                        "' (" + cartItem.getQuantity() + ") exceeds available stock (" + medicine.getStockQuantity() + ").");
            }
        }

        BigDecimal totalAmount = cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String orderNumber = generateOrderNumber();

        PaymentStatus initialPaymentStatus = (request.getPaymentMethod() == PaymentMethod.COD)
                ? PaymentStatus.PENDING
                : PaymentStatus.SUCCESS;

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .totalAmount(totalAmount)
                .deliveryAddress(request.getDeliveryAddress())
                .contactNumber(request.getContactNumber())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(initialPaymentStatus)
                .orderStatus(OrderStatus.ORDERED)
                .notes(request.getNotes())
                .build();

        for (CartItem cartItem : cart.getItems()) {
            Medicine medicine = cartItem.getMedicine();

            medicine.setStockQuantity(medicine.getStockQuantity() - cartItem.getQuantity());
            medicineRepository.save(medicine);

            OrderItem orderItem = OrderItem.builder()
                    .medicine(medicine)
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getUnitPrice())
                    .subtotal(cartItem.getSubtotal())
                    .build();

            order.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        cart.clearItems();
        cartRepository.save(cart);

        // Dispatch Automatic Notification
        notificationService.sendNotification(
                user,
                "Order Placed Successfully",
                "Your order #" + savedOrder.getOrderNumber() + " for amount ₹" + savedOrder.getTotalAmount() + " has been placed successfully.",
                NotificationType.ORDER_UPDATE,
                savedOrder.getId()
        );

        return mapToOrderResponseDto(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDto<OrderResponseDto> getUserOrders(String userEmail, int pageNo, int pageSize) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("createdAt").descending());
        Page<Order> orderPage = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        Page<OrderResponseDto> dtoPage = orderPage.map(this::mapToOrderResponseDto);
        return PageResponseDto.fromPage(dtoPage);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(String userEmail, Long orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        return mapToOrderResponseDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDto<OrderResponseDto> getAllOrders(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("createdAt").descending());
        Page<Order> orderPage = orderRepository.findAll(pageable);

        Page<OrderResponseDto> dtoPage = orderPage.map(this::mapToOrderResponseDto);
        return PageResponseDto.fromPage(dtoPage);
    }

    @Override
    @Transactional
    public OrderResponseDto updateOrderStatus(Long orderId, OrderStatusUpdateDto request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        order.setOrderStatus(request.getOrderStatus());
        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus());
        }

        Order updatedOrder = orderRepository.save(order);

        // Dispatch Automatic Status Notification
        notificationService.sendNotification(
                updatedOrder.getUser(),
                "Order Status Updated",
                "Your order #" + updatedOrder.getOrderNumber() + " status has been updated to: " + updatedOrder.getOrderStatus(),
                NotificationType.ORDER_UPDATE,
                updatedOrder.getId()
        );

        return mapToOrderResponseDto(updatedOrder);
    }

    private String generateOrderNumber() {
        return "PG-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private OrderResponseDto mapToOrderResponseDto(Order order) {
        List<OrderItemResponseDto> itemDtos = order.getItems().stream()
                .map(item -> OrderItemResponseDto.builder()
                        .id(item.getId())
                        .medicineId(item.getMedicine().getId())
                        .medicineName(item.getMedicine().getName())
                        .brand(item.getMedicine().getBrand())
                        .dosageForm(item.getMedicine().getDosageForm())
                        .packSize(item.getMedicine().getPackSize())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponseDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser().getId())
                .userName(order.getUser().getFullName())
                .userEmail(order.getUser().getEmail())
                .totalAmount(order.getTotalAmount())
                .deliveryAddress(order.getDeliveryAddress())
                .contactNumber(order.getContactNumber())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .notes(order.getNotes())
                .items(itemDtos)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
