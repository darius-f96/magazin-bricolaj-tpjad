package bricolage.service.interfaces;

import bricolage.entity.Order;
import bricolage.enums.OrderStatus;

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
}

