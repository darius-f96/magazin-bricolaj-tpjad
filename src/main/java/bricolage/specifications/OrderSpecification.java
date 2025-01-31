package bricolage.specifications;

import bricolage.entity.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderSpecification {

    public static Specification<bricolage.entity.Order>  filterByProductName(String name) {
        return (root, query, criteriaBuilder) -> {
            var orderItemJoin = root.join("orderItems", JoinType.INNER);
            var productJoin = orderItemJoin.join("product", JoinType.INNER);
            return criteriaBuilder.like(
                    criteriaBuilder.lower(productJoin.get("name")),
                    "%" + name.toLowerCase() + "%"
            );
        };
    }

    public static Specification<bricolage.entity.Order> hasDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.between(root.get("orderDate"), startDate, endDate);
    }

    public static Specification<bricolage.entity.Order> hasPriceInRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.between(root.get("totalPrice"), minPrice, maxPrice);
    }

    public static Specification<bricolage.entity.Order> hasUserId(Long userId) {
        return (root, query, criteriaBuilder) -> {
            Join<jakarta.persistence.criteria.Order, User> userJoin = root.join("user");

            return criteriaBuilder.equal(userJoin.get("id"), userId);
        };
    }

    public static Specification<bricolage.entity.Order> createOrderSpecification(Long userId, String productName, LocalDateTime startDate,
                                                                LocalDateTime endDate, BigDecimal minPrice,
                                                                BigDecimal maxPrice) {
        return Specification.where(productName != null ? filterByProductName(productName) : null)
                .and(startDate != null && endDate != null ? hasDateBetween(startDate, endDate) : null)
                .and(minPrice != null && maxPrice != null ? hasPriceInRange(minPrice, maxPrice) : null)
                .and(hasUserId(userId));
    }
}