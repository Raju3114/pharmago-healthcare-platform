package com.pharmago.controller;

import com.pharmago.dto.request.PrescriptionReviewDto;
import com.pharmago.dto.response.ApiResponseDto;
import com.pharmago.dto.response.PageResponseDto;
import com.pharmago.dto.response.PrescriptionResponseDto;
import com.pharmago.enums.PrescriptionStatus;
import com.pharmago.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    // Customer Endpoints
    @PostMapping(value = "/api/v1/prescriptions/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponseDto<PrescriptionResponseDto>> uploadPrescription(
            Authentication authentication,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "orderId", required = false) Long orderId
    ) {
        PrescriptionResponseDto prescription = prescriptionService.uploadPrescription(authentication.getName(), file, orderId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseDto.success("Prescription uploaded successfully", prescription));
    }

    @GetMapping("/api/v1/prescriptions")
    public ResponseEntity<ApiResponseDto<List<PrescriptionResponseDto>>> getUserPrescriptions(Authentication authentication) {
        List<PrescriptionResponseDto> prescriptions = prescriptionService.getUserPrescriptions(authentication.getName());
        return ResponseEntity.ok(ApiResponseDto.success("User prescriptions retrieved successfully", prescriptions));
    }

    @GetMapping("/api/v1/prescriptions/{id}")
    public ResponseEntity<ApiResponseDto<PrescriptionResponseDto>> getPrescriptionById(
            Authentication authentication,
            @PathVariable Long id
    ) {
        PrescriptionResponseDto prescription = prescriptionService.getPrescriptionById(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponseDto.success("Prescription details retrieved successfully", prescription));
    }

    // Admin Endpoints
    @GetMapping("/api/v1/admin/prescriptions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<PageResponseDto<PrescriptionResponseDto>>> getAllPrescriptions(
            @RequestParam(required = false) PrescriptionStatus status,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        PageResponseDto<PrescriptionResponseDto> result = prescriptionService.getAllPrescriptions(status, pageNo, pageSize);
        return ResponseEntity.ok(ApiResponseDto.success("All prescriptions retrieved successfully", result));
    }

    @PutMapping("/api/v1/admin/prescriptions/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<PrescriptionResponseDto>> reviewPrescription(
            @PathVariable Long id,
            @Valid @RequestBody PrescriptionReviewDto reviewDto
    ) {
        PrescriptionResponseDto prescription = prescriptionService.reviewPrescription(id, reviewDto);
        return ResponseEntity.ok(ApiResponseDto.success("Prescription reviewed successfully", prescription));
    }
}
