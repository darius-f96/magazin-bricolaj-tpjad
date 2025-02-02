package bricolage.service.interfaces;

import bricolage.controller.dto.FullOrderDTO;
import bricolage.entity.Order;
import bricolage.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    Order createOrder(Order order);
    Order getOrderById(Long id);
    List<Order> getAllOrders();
    Order updateOrder(Long id, Order order);
    void deleteOrder(Long id);
    void removeItemFromOrder(Long orderId, Long productId);
    void updateProductQuantity(Long orderId, Long productId, int newQuantity);
    void changeOrderStatus(Long orderId, OrderStatus newStatus);
    Page<FullOrderDTO> searchOrders(Pageable pageable, String productName, String startDate, String endDate, String minPrice, String maxPrice);
}

