package com.pharmago.service.impl;

import com.pharmago.dto.request.CreateNotificationDto;
import com.pharmago.dto.response.NotificationResponseDto;
import com.pharmago.dto.response.PageResponseDto;
import com.pharmago.enums.NotificationType;
import com.pharmago.exception.ResourceNotFoundException;
import com.pharmago.model.Notification;
import com.pharmago.model.User;
import com.pharmago.repository.NotificationRepository;
import com.pharmago.repository.UserRepository;
import com.pharmago.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponseDto<NotificationResponseDto> getUserNotifications(String userEmail, int pageNo, int pageSize) {
        User user = getUserByEmail(userEmail);
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("createdAt").descending());

        Page<Notification> notificationPage = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);
        Page<NotificationResponseDto> dtoPage = notificationPage.map(this::mapToNotificationResponseDto);

        return PageResponseDto.fromPage(dtoPage);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getUnreadCount(String userEmail) {
        User user = getUserByEmail(userEmail);
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Override
    @Transactional
    public NotificationResponseDto markAsRead(String userEmail, Long id) {
        User user = getUserByEmail(userEmail);
        Notification notification = notificationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));

        notification.setIsRead(true);
        Notification updatedNotification = notificationRepository.save(notification);
        return mapToNotificationResponseDto(updatedNotification);
    }

    @Override
    @Transactional
    public void markAllAsRead(String userEmail) {
        User user = getUserByEmail(userEmail);
        notificationRepository.markAllAsReadByUserId(user.getId());
    }

    @Override
    @Transactional
    public void sendPromotionalNotification(CreateNotificationDto dto) {
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

            sendNotification(user, dto.getTitle(), dto.getMessage(), NotificationType.PROMOTION, dto.getReferenceId());
        } else {
            // Broadcast to all users
            List<User> users = userRepository.findAll();
            List<Notification> notifications = users.stream()
                    .map(u -> Notification.builder()
                            .user(u)
                            .title(dto.getTitle())
                            .message(dto.getMessage())
                            .type(NotificationType.PROMOTION)
                            .isRead(false)
                            .referenceId(dto.getReferenceId())
                            .build())
                    .collect(Collectors.toList());

            notificationRepository.saveAll(notifications);
        }
    }

    @Override
    @Transactional
    public void sendNotification(User user, String title, String message, NotificationType type, Long referenceId) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .referenceId(referenceId)
                .build();

        notificationRepository.save(notification);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private NotificationResponseDto mapToNotificationResponseDto(Notification notification) {
        return NotificationResponseDto.builder()
                .id(notification.getId())
                .userId(notification.getUser().getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .referenceId(notification.getReferenceId())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
