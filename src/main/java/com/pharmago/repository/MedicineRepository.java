package com.pharmago.repository;

import com.pharmago.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long>, JpaSpecificationExecutor<Medicine> {

    Optional<Medicine> findByIdAndIsActiveTrue(Long id);

    Boolean existsByName(String name);

    Boolean existsByNameAndIdNot(String name, Long id);
}
