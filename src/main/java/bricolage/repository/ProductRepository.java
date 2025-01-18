package bricolage.repository;

import bricolage.entity.Product;
import bricolage.entity.User;
import bricolage.utils.JpaRepositoryExtensions;

public interface ProductRepository extends JpaRepositoryExtensions<Product, Long> {
}

