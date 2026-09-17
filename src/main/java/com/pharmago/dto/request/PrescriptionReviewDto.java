package com.pharmago.dto.request;

import com.pharmago.enums.PrescriptionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionReviewDto {

    @NotNull(message = "Prescription status is required")
    private PrescriptionStatus status;

    private String adminNotes;
}
