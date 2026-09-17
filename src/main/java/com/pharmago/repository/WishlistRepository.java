package com.pharmago.repository;

import com.pharmago.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUserId(Long userId);

    Optional<Wishlist> findByUserIdAndMedicineId(Long userId, Long medicineId);

    Boolean existsByUserIdAndMedicineId(Long userId, Long medicineId);
}
