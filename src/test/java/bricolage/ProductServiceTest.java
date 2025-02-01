package bricolage;

import bricolage.controller.dto.ProductCreationDto;
import bricolage.entity.Product;
import bricolage.enums.ProductCategory;
import bricolage.repository.ProductRepository;
import bricolage.service.ProductServiceImpl;
import bricolage.service.interfaces.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        productService = new ProductServiceImpl(productRepository);

        product = new Product();
        product.setId(1L);
        product.setName("Hammer");
        product.setDescription("A strong hammer");
        product.setPrice(19.99);
        product.setStock(10);
        product.setCategory(ProductCategory.TOOLS);
    }

    @Test
    void createProduct_ShouldSaveProduct() {
        ProductCreationDto productRequest = new ProductCreationDto();
        productRequest.setName("Hammer");
        productRequest.setDescription("A strong hammer");
        productRequest.setPrice(19.99);
        productRequest.setCategory(ProductCategory.TOOLS);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product result = productService.createProduct(productRequest);

        assertNotNull(result);
        assertEquals("Hammer", result.getName());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void getProductById_ShouldReturnProduct_WhenProductExists() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Product result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getProductById_ShouldThrowException_WhenProductDoesNotExist() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> productService.getProductById(1L));
    }

    @Test
    void getAllProducts_ShouldReturnListOfProducts() {
        when(productRepository.findAll()).thenReturn(List.of(product));

        List<Product> products = productService.getAllProducts();

        assertFalse(products.isEmpty());
        assertEquals(1, products.size());
    }

    @Test
    void updateProduct_ShouldModifyAndSaveProduct() {
        Product updatedProduct = new Product();
        updatedProduct.setName("Updated Hammer");
        updatedProduct.setDescription("A better hammer");
        updatedProduct.setPrice(25.99);
        updatedProduct.setStock(5);
        updatedProduct.setCategory(ProductCategory.TOOLS);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        Product result = productService.updateProduct(1L, updatedProduct);

        assertNotNull(result);
        assertEquals("Updated Hammer", result.getName());
        verify(productRepository).save(any(Product.class));
    }

}