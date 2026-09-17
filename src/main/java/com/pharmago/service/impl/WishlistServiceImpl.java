package com.pharmago.service.impl;

import com.pharmago.dto.response.MedicineResponseDto;
import com.pharmago.dto.response.WishlistResponseDto;
import com.pharmago.exception.BadRequestException;
import com.pharmago.exception.ResourceNotFoundException;
import com.pharmago.model.Medicine;
import com.pharmago.model.User;
import com.pharmago.model.Wishlist;
import com.pharmago.repository.MedicineRepository;
import com.pharmago.repository.UserRepository;
import com.pharmago.repository.WishlistRepository;
import com.pharmago.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<WishlistResponseDto> getUserWishlist(String userEmail) {
        User user = getUserByEmail(userEmail);
        return wishlistRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToWishlistResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WishlistResponseDto addToWishlist(String userEmail, Long medicineId) {
        User user = getUserByEmail(userEmail);

        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + medicineId));

        if (!Boolean.TRUE.equals(medicine.getIsActive())) {
            throw new BadRequestException("Cannot add inactive medicine to wishlist");
        }

        if (wishlistRepository.existsByUserIdAndMedicineId(user.getId(), medicineId)) {
            throw new BadRequestException("Medicine is already in your wishlist");
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .medicine(medicine)
                .build();

        Wishlist savedWishlist = wishlistRepository.save(wishlist);
        return mapToWishlistResponseDto(savedWishlist);
    }

    @Override
    @Transactional
    public void removeFromWishlist(String userEmail, Long medicineId) {
        User user = getUserByEmail(userEmail);

        Wishlist wishlist = wishlistRepository.findByUserIdAndMedicineId(user.getId(), medicineId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in user's wishlist"));

        wishlistRepository.delete(wishlist);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private WishlistResponseDto mapToWishlistResponseDto(Wishlist wishlist) {
        Medicine medicine = wishlist.getMedicine();
        BigDecimal discount = medicine.getDiscountPercentage() != null ? medicine.getDiscountPercentage() : BigDecimal.ZERO;
        BigDecimal multiplier = BigDecimal.valueOf(100).subtract(discount).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        BigDecimal discountedPrice = medicine.getPrice().multiply(multiplier).setScale(2, RoundingMode.HALF_UP);

        MedicineResponseDto medicineDto = MedicineResponseDto.builder()
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

        return WishlistResponseDto.builder()
                .id(wishlist.getId())
                .medicine(medicineDto)
                .createdAt(wishlist.getCreatedAt())
                .build();
    }
}
