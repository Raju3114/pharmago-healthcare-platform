package com.pharmago.dto.response;

import com.pharmago.enums.PrescriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionResponseDto {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long orderId;
    private String orderNumber;
    private String fileName;
    private String fileUrl;
    private String originalFileName;
    private Long fileSize;
    private PrescriptionStatus status;
    private String adminNotes;
    private LocalDateTime uploadedAt;
    private LocalDateTime reviewedAt;
}
