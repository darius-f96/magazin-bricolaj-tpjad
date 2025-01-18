package bricolage.repository;

import bricolage.entity.Order;
import bricolage.entity.OrderItem;
import bricolage.utils.JpaRepositoryExtensions;

public interface OrderItemRepository extends JpaRepositoryExtensions<OrderItem, Long> {
}

