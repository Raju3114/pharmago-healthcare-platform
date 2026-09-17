package com.pharmago.service;

import com.pharmago.dto.request.CategoryRequestDto;
import com.pharmago.dto.response.CategoryResponseDto;

import java.util.List;

public interface CategoryService {

    List<CategoryResponseDto> getAllCategories();

    List<CategoryResponseDto> getActiveCategories();

    CategoryResponseDto getCategoryById(Long id);

    CategoryResponseDto createCategory(CategoryRequestDto categoryRequest);

    CategoryResponseDto updateCategory(Long id, CategoryRequestDto categoryRequest);

    void deleteCategory(Long id);
}
