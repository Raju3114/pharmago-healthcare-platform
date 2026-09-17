package com.pharmago.service.impl;

import com.pharmago.dto.request.MedicineRequestDto;
import com.pharmago.dto.response.MedicineResponseDto;
import com.pharmago.dto.response.PageResponseDto;
import com.pharmago.exception.BadRequestException;
import com.pharmago.exception.ResourceNotFoundException;
import com.pharmago.model.Category;
import com.pharmago.model.Medicine;
import com.pharmago.repository.CategoryRepository;
import com.pharmago.repository.MedicineRepository;
import com.pharmago.service.MedicineService;
import com.pharmago.specification.MedicineSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponseDto<MedicineResponseDto> getMedicines(
            Long categoryId,
            Boolean prescriptionRequired,
            Boolean inStockOnly,
            String searchQuery,
            int pageNo,
            int pageSize,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Specification<Medicine> spec = MedicineSpecification.filterMedicines(
                categoryId,
                prescriptionRequired,
                inStockOnly,
                searchQuery,
                true // Active medicines only for customer view
        );

        Page<Medicine> medicinePage = medicineRepository.findAll(spec, pageable);
        Page<MedicineResponseDto> dtoPage = medicinePage.map(this::mapToMedicineResponseDto);

        return PageResponseDto.fromPage(dtoPage);
    }

    @Override
    @Transactional(readOnly = true)
    public MedicineResponseDto getMedicineById(Long id) {
        Medicine medicine = medicineRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + id));

        return mapToMedicineResponseDto(medicine);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDto<MedicineResponseDto> searchMedicines(
            String query,
            int pageNo,
            int pageSize,
            String sortBy,
            String sortDir
    ) {
        return getMedicines(null, null, null, query, pageNo, pageSize, sortBy, sortDir);
    }

    @Override
    @Transactional
    public MedicineResponseDto createMedicine(MedicineRequestDto medicineRequest) {
        Category category = categoryRepository.findById(medicineRequest.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + medicineRequest.getCategoryId()));

        if (medicineRepository.existsByName(medicineRequest.getName())) {
            throw new BadRequestException("Medicine with name '" + medicineRequest.getName() + "' already exists");
        }

        Medicine medicine = Medicine.builder()
                .category(category)
                .name(medicineRequest.getName())
                .brand(medicineRequest.getBrand())
                .description(medicineRequest.getDescription())
                .composition(medicineRequest.getComposition())
                .dosageForm(medicineRequest.getDosageForm())
                .packSize(medicineRequest.getPackSize())
                .price(medicineRequest.getPrice())
                .discountPercentage(medicineRequest.getDiscountPercentage() != null ? medicineRequest.getDiscountPercentage() : BigDecimal.ZERO)
                .stockQuantity(medicineRequest.getStockQuantity())
                .prescriptionRequired(medicineRequest.getPrescriptionRequired() != null ? medicineRequest.getPrescriptionRequired() : false)
                .isActive(medicineRequest.getIsActive() != null ? medicineRequest.getIsActive() : true)
                .build();

        Medicine savedMedicine = medicineRepository.save(medicine);
        return mapToMedicineResponseDto(savedMedicine);
    }

    @Override
    @Transactional
    public MedicineResponseDto updateMedicine(Long id, MedicineRequestDto medicineRequest) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + id));

        Category category = categoryRepository.findById(medicineRequest.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + medicineRequest.getCategoryId()));

        if (medicineRepository.existsByNameAndIdNot(medicineRequest.getName(), id)) {
            throw new BadRequestException("Another medicine with name '" + medicineRequest.getName() + "' already exists");
        }

        medicine.setCategory(category);
        medicine.setName(medicineRequest.getName());
        medicine.setBrand(medicineRequest.getBrand());
        medicine.setDescription(medicineRequest.getDescription());
        medicine.setComposition(medicineRequest.getComposition());
        medicine.setDosageForm(medicineRequest.getDosageForm());
        medicine.setPackSize(medicineRequest.getPackSize());
        medicine.setPrice(medicineRequest.getPrice());
        if (medicineRequest.getDiscountPercentage() != null) {
            medicine.setDiscountPercentage(medicineRequest.getDiscountPercentage());
        }
        medicine.setStockQuantity(medicineRequest.getStockQuantity());
        if (medicineRequest.getPrescriptionRequired() != null) {
            medicine.setPrescriptionRequired(medicineRequest.getPrescriptionRequired());
        }
        if (medicineRequest.getIsActive() != null) {
            medicine.setIsActive(medicineRequest.getIsActive());
        }

        Medicine updatedMedicine = medicineRepository.save(medicine);
        return mapToMedicineResponseDto(updatedMedicine);
    }

    @Override
    @Transactional
    public void deleteMedicine(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + id));

        // Soft delete
        medicine.setIsActive(false);
        medicineRepository.save(medicine);
    }

    private MedicineResponseDto mapToMedicineResponseDto(Medicine medicine) {
        BigDecimal discount = medicine.getDiscountPercentage() != null ? medicine.getDiscountPercentage() : BigDecimal.ZERO;
        BigDecimal multiplier = BigDecimal.valueOf(100).subtract(discount).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        BigDecimal discountedPrice = medicine.getPrice().multiply(multiplier).setScale(2, RoundingMode.HALF_UP);

        return MedicineResponseDto.builder()
                .id(medicine.getId())
                .categoryId(medicine.getCategory().getId())
                .categoryName(medicine.getCategory().getName())
                .name(medicine.getName())
                .brand(medicine.getBrand())
                .description(medicine.getDescription())
                .composition(medicine.getComposition())
                .dosageForm(medicine.getDosageForm())
                .packSize(medicine.getPackSize())
                .price(medicine.getPrice())
                .discountPercentage(medicine.getDiscountPercentage())
                .discountedPrice(discountedPrice)
                .stockQuantity(medicine.getStockQuantity())
                .inStock(medicine.getStockQuantity() > 0)
                .prescriptionRequired(medicine.getPrescriptionRequired())
                .isActive(medicine.getIsActive())
                .createdAt(medicine.getCreatedAt())
                .build();
    }
}
