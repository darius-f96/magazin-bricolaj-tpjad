package bricolage.service.interfaces;

import bricolage.entity.OrderItem;

import java.util.List;

public interface OrderItemService {
    OrderItem createOrderItem(OrderItem orderItem);
    OrderItem getOrderItemById(Long id);
    List<OrderItem> getAllOrderItems();
    OrderItem updateOrderItem(Long id, OrderItem orderItem);
    void deleteOrderItem(Long id);
}

