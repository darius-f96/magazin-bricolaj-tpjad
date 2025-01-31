package bricolage.service;

import bricolage.controller.dto.ProductCreationDto;
import bricolage.entity.Product;
import bricolage.enums.ProductCategory;
import bricolage.mappers.ProductMapper;
import bricolage.repository.ProductRepository;
import bricolage.service.interfaces.ProductService;
import bricolage.specifications.ProductSpecification;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Product createProduct(ProductCreationDto productRequest) {
        Product product = ProductMapper.convertToEntity(productRequest);
        return productRepository.save(product);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product updateProduct(Long id, Product product) {
        Product existingProduct = getProductById(id);
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStock(product.getStock());
        existingProduct.setCategory(product.getCategory());
        return productRepository.save(existingProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public Page<Product> searchProducts(String search, Boolean hasStock, List<ProductCategory> productCategoryList, Pageable pageable) {
        Specification<Product> spec = ProductSpecification.createProductSpecification(search, hasStock, productCategoryList);
        return productRepository.findAll(spec, pageable);
    }
}

