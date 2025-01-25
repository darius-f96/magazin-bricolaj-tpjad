package bricolage.controller.dto;

import bricolage.enums.ProductCategory;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductCreationDto {

    private String name = "Default Product Name";
    private String description = "Default Product Description";
    private Double price = 0.0;
    private Integer stock = 0;
    private ProductCategory category = ProductCategory.TOOLS;

}