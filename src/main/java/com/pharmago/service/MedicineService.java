package com.pharmago.service;

import com.pharmago.dto.request.MedicineRequestDto;
import com.pharmago.dto.response.MedicineResponseDto;
import com.pharmago.dto.response.PageResponseDto;

public interface MedicineService {

    PageResponseDto<MedicineResponseDto> getMedicines(
            Long categoryId,
            Boolean prescriptionRequired,
            Boolean inStockOnly,
            String searchQuery,
            int pageNo,
            int pageSize,
            String sortBy,
            String sortDir
    );

    MedicineResponseDto getMedicineById(Long id);

    PageResponseDto<MedicineResponseDto> searchMedicines(
            String query,
            int pageNo,
            int pageSize,
            String sortBy,
            String sortDir
    );

    MedicineResponseDto createMedicine(MedicineRequestDto medicineRequest);

    MedicineResponseDto updateMedicine(Long id, MedicineRequestDto medicineRequest);

    void deleteMedicine(Long id);
}
