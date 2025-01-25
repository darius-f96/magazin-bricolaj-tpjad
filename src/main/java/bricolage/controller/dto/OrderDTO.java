package bricolage.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private String status;
    private LocalDateTime orderDate;
    private LocalDateTime updated;
    private List<OrderItemDTO> products;
    private double totalPrice;
}
