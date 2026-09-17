package com.pharmago.controller;

import com.pharmago.dto.request.MedicineRequestDto;
import com.pharmago.dto.response.ApiResponseDto;
import com.pharmago.dto.response.MedicineResponseDto;
import com.pharmago.dto.response.PageResponseDto;
import com.pharmago.service.MedicineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @GetMapping("/api/v1/medicines")
    public ResponseEntity<ApiResponseDto<PageResponseDto<MedicineResponseDto>>> getMedicines(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean prescriptionRequired,
            @RequestParam(required = false) Boolean inStockOnly,
            @RequestParam(required = false) String searchQuery,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        PageResponseDto<MedicineResponseDto> result = medicineService.getMedicines(
                categoryId,
                prescriptionRequired,
                inStockOnly,
                searchQuery,
                pageNo,
                pageSize,
                sortBy,
                sortDir
        );
        return ResponseEntity.ok(ApiResponseDto.success("Medicines retrieved successfully", result));
    }

    @GetMapping("/api/v1/medicines/{id}")
    public ResponseEntity<ApiResponseDto<MedicineResponseDto>> getMedicineById(@PathVariable Long id) {
        MedicineResponseDto medicine = medicineService.getMedicineById(id);
        return ResponseEntity.ok(ApiResponseDto.success("Medicine details retrieved successfully", medicine));
    }

    @GetMapping("/api/v1/medicines/search")
    public ResponseEntity<ApiResponseDto<PageResponseDto<MedicineResponseDto>>> searchMedicines(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        PageResponseDto<MedicineResponseDto> result = medicineService.searchMedicines(
                q,
                pageNo,
                pageSize,
                sortBy,
                sortDir
        );
        return ResponseEntity.ok(ApiResponseDto.success("Search results retrieved successfully", result));
    }

    @PostMapping("/api/v1/admin/medicines")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<MedicineResponseDto>> createMedicine(@Valid @RequestBody MedicineRequestDto medicineRequest) {
        MedicineResponseDto createdMedicine = medicineService.createMedicine(medicineRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseDto.success("Medicine created successfully", createdMedicine));
    }

    @PutMapping("/api/v1/admin/medicines/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<MedicineResponseDto>> updateMedicine(
            @PathVariable Long id,
            @Valid @RequestBody MedicineRequestDto medicineRequest
    ) {
        MedicineResponseDto updatedMedicine = medicineService.updateMedicine(id, medicineRequest);
        return ResponseEntity.ok(ApiResponseDto.success("Medicine updated successfully", updatedMedicine));
    }

    @DeleteMapping("/api/v1/admin/medicines/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<Void>> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok(ApiResponseDto.success("Medicine deleted successfully", null));
    }
}
