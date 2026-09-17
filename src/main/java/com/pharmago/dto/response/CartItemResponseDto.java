package com.pharmago.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponseDto {

    private Long id;
    private Long medicineId;
    private String medicineName;
    private String brand;
    private String dosageForm;
    private String packSize;
    private Boolean prescriptionRequired;
    private Integer availableStock;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}
