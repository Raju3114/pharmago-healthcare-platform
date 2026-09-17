package com.pharmago.repository;

import com.pharmago.enums.PrescriptionStatus;
import com.pharmago.model.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByUserIdOrderByUploadedAtDesc(Long userId);

    Optional<Prescription> findByIdAndUserId(Long id, Long userId);

    Page<Prescription> findByStatus(PrescriptionStatus status, Pageable pageable);
}
