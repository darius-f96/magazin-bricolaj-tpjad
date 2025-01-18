package bricolage.repository;

import bricolage.entity.Order;
import bricolage.entity.Product;
import bricolage.utils.JpaRepositoryExtensions;

public interface OrderRepository extends JpaRepositoryExtensions<Order, Long> {
}

