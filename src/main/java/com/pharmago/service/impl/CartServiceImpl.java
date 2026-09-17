package com.pharmago.service.impl;

import com.pharmago.dto.request.AddToCartRequestDto;
import com.pharmago.dto.request.UpdateCartItemRequestDto;
import com.pharmago.dto.response.CartItemResponseDto;
import com.pharmago.dto.response.CartResponseDto;
import com.pharmago.exception.BadRequestException;
import com.pharmago.exception.ResourceNotFoundException;
import com.pharmago.model.Cart;
import com.pharmago.model.CartItem;
import com.pharmago.model.Medicine;
import com.pharmago.model.User;
import com.pharmago.repository.CartItemRepository;
import com.pharmago.repository.CartRepository;
import com.pharmago.repository.MedicineRepository;
import com.pharmago.repository.UserRepository;
import com.pharmago.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CartResponseDto getUserCart(String userEmail) {
        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);
        return mapToCartResponseDto(cart);
    }

    @Override
    @Transactional
    public CartResponseDto addToCart(String userEmail, AddToCartRequestDto request) {
        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + request.getMedicineId()));

        if (!Boolean.TRUE.equals(medicine.getIsActive())) {
            throw new BadRequestException("Cannot add inactive medicine to cart");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndMedicineId(cart.getId(), medicine.getId());

        int newQuantity = request.getQuantity();
        if (existingItemOpt.isPresent()) {
            newQuantity += existingItemOpt.get().getQuantity();
        }

        if (newQuantity > medicine.getStockQuantity()) {
            throw new BadRequestException("Requested quantity (" + newQuantity + ") exceeds available stock (" + medicine.getStockQuantity() + ")");
        }

        BigDecimal unitPrice = calculateEffectivePrice(medicine);

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(newQuantity);
            existingItem.setUnitPrice(unitPrice);
            existingItem.calculateSubtotal();
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .medicine(medicine)
                    .quantity(request.getQuantity())
                    .unitPrice(unitPrice)
                    .subtotal(unitPrice.multiply(BigDecimal.valueOf(request.getQuantity())))
                    .build();

            cart.addItem(newItem);
            cartItemRepository.save(newItem);
        }

        Cart updatedCart = cartRepository.save(cart);
        return mapToCartResponseDto(updatedCart);
    }

    @Override
    @Transactional
    public CartResponseDto updateCartItem(String userEmail, Long cartItemId, UpdateCartItemRequestDto request) {
        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to the user's cart");
        }

        Medicine medicine = cartItem.getMedicine();
        if (!Boolean.TRUE.equals(medicine.getIsActive())) {
            throw new BadRequestException("Medicine is no longer active");
        }

        if (request.getQuantity() > medicine.getStockQuantity()) {
            throw new BadRequestException("Requested quantity (" + request.getQuantity() + ") exceeds available stock (" + medicine.getStockQuantity() + ")");
        }

        BigDecimal unitPrice = calculateEffectivePrice(medicine);

        cartItem.setQuantity(request.getQuantity());
        cartItem.setUnitPrice(unitPrice);
        cartItem.calculateSubtotal();
        cartItemRepository.save(cartItem);

        Cart updatedCart = cartRepository.save(cart);
        return mapToCartResponseDto(updatedCart);
    }

    @Override
    @Transactional
    public CartResponseDto removeCartItem(String userEmail, Long cartItemId) {
        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to the user's cart");
        }

        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);

        Cart updatedCart = cartRepository.save(cart);
        return mapToCartResponseDto(updatedCart);
    }

    @Override
    @Transactional
    public CartResponseDto clearCart(String userEmail) {
        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        cart.clearItems();
        Cart clearedCart = cartRepository.save(cart);
        return mapToCartResponseDto(clearedCart);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    private BigDecimal calculateEffectivePrice(Medicine medicine) {
        BigDecimal price = medicine.getPrice();
        BigDecimal discount = medicine.getDiscountPercentage() != null ? medicine.getDiscountPercentage() : BigDecimal.ZERO;

        if (discount.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal multiplier = BigDecimal.valueOf(100).subtract(discount).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            return price.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
        }
        return price;
    }

    private CartResponseDto mapToCartResponseDto(Cart cart) {
        List<CartItemResponseDto> itemDtos = cart.getItems().stream()
                .map(item -> CartItemResponseDto.builder()
                        .id(item.getId())
                        .medicineId(item.getMedicine().getId())
                        .medicineName(item.getMedicine().getName())
                        .brand(item.getMedicine().getBrand())
                        .dosageForm(item.getMedicine().getDosageForm())
                        .packSize(item.getMedicine().getPackSize())
                        .prescriptionRequired(item.getMedicine().getPrescriptionRequired())
                        .availableStock(item.getMedicine().getStockQuantity())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        BigDecimal totalAmount = itemDtos.stream()
                .map(CartItemResponseDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = itemDtos.stream()
                .mapToInt(CartItemResponseDto::getQuantity)
                .sum();

        boolean requiresPrescription = cart.getItems().stream()
                .anyMatch(item -> Boolean.TRUE.equals(item.getMedicine().getPrescriptionRequired()));

        return CartResponseDto.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(itemDtos)
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .requiresPrescription(requiresPrescription)
                .build();
    }
}
