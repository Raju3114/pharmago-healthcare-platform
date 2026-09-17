package com.pharmago.service.impl;

import com.pharmago.dto.request.CategoryRequestDto;
import com.pharmago.dto.response.CategoryResponseDto;
import com.pharmago.exception.BadRequestException;
import com.pharmago.exception.ResourceNotFoundException;
import com.pharmago.model.Category;
import com.pharmago.repository.CategoryRepository;
import com.pharmago.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToCategoryResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDto> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToCategoryResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponseDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        return mapToCategoryResponseDto(category);
    }

    @Override
    @Transactional
    public CategoryResponseDto createCategory(CategoryRequestDto categoryRequest) {
        if (categoryRepository.existsByName(categoryRequest.getName())) {
            throw new BadRequestException("Category with name '" + categoryRequest.getName() + "' already exists");
        }

        String slug = generateSlug(categoryRequest.getName());

        Category category = Category.builder()
                .name(categoryRequest.getName())
                .slug(slug)
                .description(categoryRequest.getDescription())
                .imageUrl(categoryRequest.getImageUrl())
                .isActive(categoryRequest.getIsActive() != null ? categoryRequest.getIsActive() : true)
                .build();

        Category savedCategory = categoryRepository.save(category);
        return mapToCategoryResponseDto(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponseDto updateCategory(Long id, CategoryRequestDto categoryRequest) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        if (categoryRepository.existsByNameAndIdNot(categoryRequest.getName(), id)) {
            throw new BadRequestException("Another category with name '" + categoryRequest.getName() + "' already exists");
        }

        category.setName(categoryRequest.getName());
        category.setSlug(generateSlug(categoryRequest.getName()));
        category.setDescription(categoryRequest.getDescription());
        category.setImageUrl(categoryRequest.getImageUrl());
        if (categoryRequest.getIsActive() != null) {
            category.setIsActive(categoryRequest.getIsActive());
        }

        Category updatedCategory = categoryRepository.save(category);
        return mapToCategoryResponseDto(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        // Soft delete for integrity
        category.setIsActive(false);
        categoryRepository.save(category);
    }

    private CategoryResponseDto mapToCategoryResponseDto(Category category) {
        return CategoryResponseDto.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .isActive(category.getIsActive())
                .createdAt(category.getCreatedAt())
                .build();
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
    }
}
