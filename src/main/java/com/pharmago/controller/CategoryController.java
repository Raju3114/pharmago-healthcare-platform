package com.pharmago.controller;

import com.pharmago.dto.request.CategoryRequestDto;
import com.pharmago.dto.response.ApiResponseDto;
import com.pharmago.dto.response.CategoryResponseDto;
import com.pharmago.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/api/v1/categories")
    public ResponseEntity<ApiResponseDto<List<CategoryResponseDto>>> getActiveCategories() {
        List<CategoryResponseDto> categories = categoryService.getActiveCategories();
        return ResponseEntity.ok(ApiResponseDto.success("Categories fetched successfully", categories));
    }

    @GetMapping("/api/v1/categories/{id}")
    public ResponseEntity<ApiResponseDto<CategoryResponseDto>> getCategoryById(@PathVariable Long id) {
        CategoryResponseDto category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponseDto.success("Category fetched successfully", category));
    }

    @PostMapping("/api/v1/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<CategoryResponseDto>> createCategory(@Valid @RequestBody CategoryRequestDto categoryRequest) {
        CategoryResponseDto createdCategory = categoryService.createCategory(categoryRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseDto.success("Category created successfully", createdCategory));
    }

    @PutMapping("/api/v1/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<CategoryResponseDto>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequestDto categoryRequest
    ) {
        CategoryResponseDto updatedCategory = categoryService.updateCategory(id, categoryRequest);
        return ResponseEntity.ok(ApiResponseDto.success("Category updated successfully", updatedCategory));
    }

    @DeleteMapping("/api/v1/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponseDto.success("Category deleted successfully", null));
    }
}
