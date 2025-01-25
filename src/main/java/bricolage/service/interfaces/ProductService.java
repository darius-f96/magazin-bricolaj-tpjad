package bricolage.service.interfaces;

import bricolage.controller.dto.ProductCreationDto;
import bricolage.entity.Product;

import java.util.List;

public interface ProductService {
    Product createProduct(ProductCreationDto product);
    Product getProductById(Long id);
    List<Product> getAllProducts();
    Product updateProduct(Long id, Product product);
    void deleteProduct(Long id);
}
