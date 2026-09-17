package com.pharmago.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponseDto {

    private Long id;
    private Long userId;
    private List<CartItemResponseDto> items;
    private Integer totalItems;
    private BigDecimal totalAmount;
    private Boolean requiresPrescription;
}
