package bricolage.service.interfaces;

import bricolage.controller.dto.ProductCreationDto;
import bricolage.entity.Product;
import bricolage.enums.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    Product createProduct(ProductCreationDto product);
    Product getProductById(Long id);
    List<Product> getAllProducts();
    Product updateProduct(Long id, Product product);
    void deleteProduct(Long id);
    Page<Product> searchProducts(String search, Boolean hasStock, List<ProductCategory> productCategoryList, Pageable pageable);
}
