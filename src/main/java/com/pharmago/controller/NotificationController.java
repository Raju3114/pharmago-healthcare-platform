package com.pharmago.controller;

import com.pharmago.dto.request.CreateNotificationDto;
import com.pharmago.dto.response.ApiResponseDto;
import com.pharmago.dto.response.NotificationResponseDto;
import com.pharmago.dto.response.PageResponseDto;
import com.pharmago.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // Customer Endpoints
    @GetMapping("/api/v1/notifications")
    public ResponseEntity<ApiResponseDto<PageResponseDto<NotificationResponseDto>>> getUserNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        PageResponseDto<NotificationResponseDto> result = notificationService.getUserNotifications(authentication.getName(), pageNo, pageSize);
        return ResponseEntity.ok(ApiResponseDto.success("Notifications retrieved successfully", result));
    }

    @GetMapping("/api/v1/notifications/unread-count")
    public ResponseEntity<ApiResponseDto<Long>> getUnreadCount(Authentication authentication) {
        Long unreadCount = notificationService.getUnreadCount(authentication.getName());
        return ResponseEntity.ok(ApiResponseDto.success("Unread notification count retrieved", unreadCount));
    }

    @PutMapping("/api/v1/notifications/{id}/read")
    public ResponseEntity<ApiResponseDto<NotificationResponseDto>> markAsRead(
            Authentication authentication,
            @PathVariable Long id
    ) {
        NotificationResponseDto notification = notificationService.markAsRead(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponseDto.success("Notification marked as read", notification));
    }

    @PutMapping("/api/v1/notifications/read-all")
    public ResponseEntity<ApiResponseDto<Void>> markAllAsRead(Authentication authentication) {
        notificationService.markAllAsRead(authentication.getName());
        return ResponseEntity.ok(ApiResponseDto.success("All notifications marked as read", null));
    }

    // Admin Endpoint
    @PostMapping("/api/v1/admin/notifications/promotion")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<Void>> sendPromotionalNotification(@Valid @RequestBody CreateNotificationDto dto) {
        notificationService.sendPromotionalNotification(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseDto.success("Promotional notification dispatched successfully", null));
    }
}
