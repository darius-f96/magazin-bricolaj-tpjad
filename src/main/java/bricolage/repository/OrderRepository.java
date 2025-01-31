package bricolage.repository;

import bricolage.entity.Order;
import bricolage.enums.OrderStatus;
import bricolage.utils.JpaRepositoryExtensions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepositoryExtensions<Order, Long> {
    Order findByUserIdAndStatus(Long userId, OrderStatus status);
    Page<Order> findAll(Specification<Order> spec, Pageable pageable);
    List<Order> findAll(Specification<Order> spec);
}

