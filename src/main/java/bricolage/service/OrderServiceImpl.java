package bricolage.service;

import bricolage.entity.Order;
import bricolage.repository.OrderRepository;
import bricolage.service.interfaces.OrderService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + id));
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order updateOrder(Long id, Order order) {
        Order existingOrder = getOrderById(id);
        existingOrder.setOrderDate(order.getOrderDate());
        existingOrder.setTotalPrice(order.getTotalPrice());
        existingOrder.setUser(order.getUser());
        return orderRepository.save(existingOrder);
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}

