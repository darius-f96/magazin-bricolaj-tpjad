package bricolage.repository;

import bricolage.entity.OrderItem;
import bricolage.utils.JpaRepositoryExtensions;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepositoryExtensions<OrderItem, Long> {
    OrderItem findByOrderIdAndProductId(Long orderId, Long productId);
}

