package bricolage.service;

import bricolage.controller.dto.FullOrderDTO;
import bricolage.entity.Order;
import bricolage.entity.OrderItem;
import bricolage.entity.Product;
import bricolage.enums.OrderStatus;
import bricolage.mappers.OrderMapper;
import bricolage.mappers.UtilMapper;
import bricolage.repository.OrderRepository;
import bricolage.repository.ProductRepository;
import bricolage.service.interfaces.OrderService;
import bricolage.specifications.OrderSpecification;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + id));
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
    @Transactional
    public void removeItemFromOrder(Long orderId, Long productId) {
        Order order = getOrderById(orderId);
        List<OrderItem> items = order.getOrderItems();

        OrderItem itemToRemove = items.stream().filter(item -> item.getProduct().getId().equals(productId)).findFirst().orElseThrow(() -> new EntityNotFoundException("Product not found in this order"));

        items.remove(itemToRemove);
        order.setOrderItems(items);

        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void updateProductQuantity(Long orderId, Long productId, int newQuantity) {
        Order order = getOrderById(orderId);
        List<OrderItem> items = order.getOrderItems();

        OrderItem itemToUpdate = items.stream().filter(item -> item.getProduct().getId().equals(productId)).findFirst().orElseThrow(() -> new EntityNotFoundException("Product not found in this order"));

        if (newQuantity <= 0) {
            items.remove(itemToUpdate);
        } else {
            itemToUpdate.setQuantity(newQuantity);
        }

        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void changeOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = getOrderById(orderId);

        switch (newStatus) {
            case CONFIRMED:
                confirmOrder(order);
                break;
            case DELIVERED:
                markOrderAsDelivered(order);
                break;
            case CANCELLED:
                markOrderAsCanceled(order);
                break;
            default:
                throw new IllegalArgumentException("Unsupported order status: " + newStatus);
        }

        orderRepository.save(order);
    }

    @Override
    public Page<FullOrderDTO> searchOrders(Pageable pageable, String productName, String startDate, String endDate, String minPrice, String maxPrice) {
        return orderRepository.findAll(OrderSpecification.createAdminOrderSpecification(productName, UtilMapper.parseDate(startDate), UtilMapper.parseDate(endDate), UtilMapper.parseBigDecimal(minPrice), UtilMapper.parseBigDecimal(maxPrice)), pageable).map(OrderMapper::toFullOrderDTO);
    }

    private void confirmOrder(Order order) {
        if (order.getStatus() != OrderStatus.SUBMITTED)
            throw new IllegalStateException("Order must be SUBMITTED before it can be confirmed");
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new IllegalStateException("Insufficient stock for product: " + product.getName());
            }
        }

        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CONFIRMED);
    }

    private void markOrderAsDelivered(Order order) {
        if (order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalStateException("Order must be CONFIRMED before it can be marked as DELIVERED");
        }
        order.setStatus(OrderStatus.DELIVERED);
    }

    private void markOrderAsCanceled(Order order) {
        // eventually restock products if order is cancelled
        order.setStatus(OrderStatus.CANCELLED);
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}

