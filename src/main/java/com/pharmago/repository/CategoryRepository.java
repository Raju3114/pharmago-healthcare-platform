package com.pharmago.repository;

import com.pharmago.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findBySlug(String slug);

    List<Category> findByIsActiveTrue();

    Boolean existsByName(String name);

    Boolean existsByNameAndIdNot(String name, Long id);
}
