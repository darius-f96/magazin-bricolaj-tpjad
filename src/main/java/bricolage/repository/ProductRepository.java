package bricolage.repository;

import bricolage.entity.Product;
import bricolage.utils.JpaRepositoryExtensions;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepositoryExtensions<Product, Long> {
}

