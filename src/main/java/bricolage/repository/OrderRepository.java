package bricolage.repository;

import bricolage.entity.Order;
import bricolage.utils.JpaRepositoryExtensions;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepositoryExtensions<Order, Long> {
}

