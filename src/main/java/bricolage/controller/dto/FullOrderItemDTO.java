package bricolage.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FullOrderItemDTO {
    private long orderItemId;
    private Long productId;
    private int availableStock;
    private String name;
    private int quantity;
    private double price;
    DeliveryDetailsDTO deliveryDetails;
}
