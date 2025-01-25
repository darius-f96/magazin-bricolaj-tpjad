package bricolage.repository;

import bricolage.entity.Order;
import bricolage.enums.OrderStatus;
import bricolage.utils.JpaRepositoryExtensions;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepositoryExtensions<Order, Long> {
    Order findByUserIdAndStatus(Long userId, OrderStatus status);
}

