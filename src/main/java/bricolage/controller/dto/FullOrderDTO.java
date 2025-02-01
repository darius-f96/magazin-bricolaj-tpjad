package bricolage.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FullOrderDTO {
    private Long id;
    private String name;
    private String email;
    private String status;
    private LocalDateTime orderDate;
    private LocalDateTime updated;
    private List<FullOrderItemDTO> products;
    private double totalPrice;
    private DeliveryDetailsDTO deliveryDetails;
}
