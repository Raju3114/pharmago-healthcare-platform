package com.pharmago.specification;

import com.pharmago.model.Category;
import com.pharmago.model.Medicine;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class MedicineSpecification {

    public static Specification<Medicine> filterMedicines(
            Long categoryId,
            Boolean prescriptionRequired,
            Boolean inStockOnly,
            String searchQuery,
            Boolean isActiveOnly
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (isActiveOnly != null && isActiveOnly) {
                predicates.add(criteriaBuilder.equal(root.get("isActive"), true));
            }

            if (categoryId != null) {
                Join<Medicine, Category> categoryJoin = root.join("category");
                predicates.add(criteriaBuilder.equal(categoryJoin.get("id"), categoryId));
            }

            if (prescriptionRequired != null) {
                predicates.add(criteriaBuilder.equal(root.get("prescriptionRequired"), prescriptionRequired));
            }

            if (inStockOnly != null && inStockOnly) {
                predicates.add(criteriaBuilder.greaterThan(root.get("stockQuantity"), 0));
            }

            if (StringUtils.hasText(searchQuery)) {
                String likePattern = "%" + searchQuery.trim().toLowerCase() + "%";
                Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), likePattern);
                Predicate compositionLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("composition")), likePattern);
                Predicate brandLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("brand")), likePattern);

                predicates.add(criteriaBuilder.or(nameLike, compositionLike, brandLike));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
