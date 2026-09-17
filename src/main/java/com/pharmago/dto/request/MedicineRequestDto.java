package com.pharmago.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineRequestDto {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Medicine name is required")
    @Size(min = 2, max = 200, message = "Medicine name must be between 2 and 200 characters")
    private String name;

    @NotBlank(message = "Brand is required")
    @Size(min = 2, max = 100, message = "Brand name must be between 2 and 100 characters")
    private String brand;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Composition is required")
    @Size(max = 255, message = "Composition must not exceed 255 characters")
    private String composition;

    @NotBlank(message = "Dosage form is required")
    @Size(max = 50, message = "Dosage form must not exceed 50 characters")
    private String dosageForm;

    @NotBlank(message = "Pack size is required")
    @Size(max = 50, message = "Pack size must not exceed 50 characters")
    private String packSize;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @DecimalMin(value = "0.00", message = "Discount percentage cannot be negative")
    @DecimalMax(value = "100.00", message = "Discount percentage cannot exceed 100")
    private BigDecimal discountPercentage;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    private Boolean prescriptionRequired;
    private Boolean isActive;
}
