package bricolage.specifications;

import bricolage.entity.Product;
import bricolage.enums.ProductCategory;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> hasAttribute(String fieldName, String value) {
        return (root, query, criteriaBuilder) -> {
            if (fieldName.equals("price")) {
                return criteriaBuilder.equal(root.get(fieldName), new BigDecimal(value));
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get(fieldName)), "%" + value.toLowerCase() + "%");
        };
    }

    public static Specification<Product> hasStock(){
        return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThan(root.get("stock"), 0);
    }

    public static Specification<Product> categoryIn(List<ProductCategory> productCategoryList){
        return (root, query, criteriaBuilder) -> criteriaBuilder.in(root.get("category")).value(productCategoryList);
    }

    public static Specification<Product> createProductSpecification(String search) {
        return (root, query, cb) -> {
            Predicate namePredicate = cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%");
            Predicate descriptionPredicate = cb.like(cb.lower(root.get("description")), "%" + search.toLowerCase() + "%");

            return cb.or(namePredicate, descriptionPredicate);
        };
    }

    public static Specification<Product> createProductSpecification(String search, Boolean hasStock, List<ProductCategory> productCategoryList) {
        return Specification.where(hasAttribute("name", search)
                .or(hasAttribute("description", search)))
                .and(hasStock != null && hasStock ? hasStock() : null)
                .and(productCategoryList != null && !productCategoryList.isEmpty() ? categoryIn(productCategoryList) : null);
    }
}