package com.pharmago.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistResponseDto {

    private Long id;
    private MedicineResponseDto medicine;
    private LocalDateTime createdAt;
}
