package bricolage.mappers;

import bricolage.controller.dto.ProductCreationDto;
import bricolage.entity.Product;

public class ProductMapper {

    public static Product convertToEntity(ProductCreationDto dto) {
        if (dto == null) {
            return null;
        }

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setCategory(dto.getCategory());

        return product;
    }
}