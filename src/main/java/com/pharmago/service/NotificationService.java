package com.pharmago.service;

import com.pharmago.dto.request.CreateNotificationDto;
import com.pharmago.dto.response.NotificationResponseDto;
import com.pharmago.dto.response.PageResponseDto;
import com.pharmago.enums.NotificationType;
import com.pharmago.model.User;

public interface NotificationService {

    PageResponseDto<NotificationResponseDto> getUserNotifications(String userEmail, int pageNo, int pageSize);

    Long getUnreadCount(String userEmail);

    NotificationResponseDto markAsRead(String userEmail, Long id);

    void markAllAsRead(String userEmail);

    void sendPromotionalNotification(CreateNotificationDto dto);

    void sendNotification(User user, String title, String message, NotificationType type, Long referenceId);
}
