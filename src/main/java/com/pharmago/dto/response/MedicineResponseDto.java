package com.pharmago.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineResponseDto {

    private Long id;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String brand;
    private String description;
    private String composition;
    private String dosageForm;
    private String packSize;
    private BigDecimal price;
    private BigDecimal discountPercentage;
    private BigDecimal discountedPrice;
    private Integer stockQuantity;
    private Boolean inStock;
    private Boolean prescriptionRequired;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
