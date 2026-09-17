package com.pharmago.service;

import com.pharmago.dto.request.PrescriptionReviewDto;
import com.pharmago.dto.response.PageResponseDto;
import com.pharmago.dto.response.PrescriptionResponseDto;
import com.pharmago.enums.PrescriptionStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PrescriptionService {

    PrescriptionResponseDto uploadPrescription(String userEmail, MultipartFile file, Long orderId);

    List<PrescriptionResponseDto> getUserPrescriptions(String userEmail);

    PrescriptionResponseDto getPrescriptionById(String userEmail, Long id);

    PageResponseDto<PrescriptionResponseDto> getAllPrescriptions(PrescriptionStatus status, int pageNo, int pageSize);

    PrescriptionResponseDto reviewPrescription(Long id, PrescriptionReviewDto reviewDto);
}
