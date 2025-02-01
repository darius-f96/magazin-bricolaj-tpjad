package bricolage;

import bricolage.entity.Order;
import bricolage.entity.OrderItem;
import bricolage.entity.Product;
import bricolage.enums.OrderStatus;
import bricolage.repository.OrderRepository;
import bricolage.repository.ProductRepository;
import bricolage.service.OrderServiceImpl;
import bricolage.service.interfaces.OrderService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    OrderRepository orderRepository;

    @Mock
    ProductRepository productRepository;

    OrderService orderService;

    private Order order;
    private Product product;
    private OrderItem orderItem;

    @BeforeEach
    void setUp() {
        orderService = new OrderServiceImpl(orderRepository, productRepository);

        order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.SUBMITTED);
        order.setOrderItems(new ArrayList<>());

        product = new Product();
        product.setId(2L);
        product.setStock(10);
        product.setName("Hammer");

        orderItem = new OrderItem();
        orderItem.setProduct(product);
        orderItem.setQuantity(2);
        order.getOrderItems().add(orderItem);
    }

    @Test
    void shouldCreateOrder() {
        when(orderRepository.save(order)).thenReturn(order);

        Order createdOrder = orderService.createOrder(order);

        assertNotNull(createdOrder);
        assertEquals(order.getId(), createdOrder.getId());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void shouldGetOrderById() {
        when(orderRepository.findById(1L)).thenReturn(Optional.ofNullable(order));

        Order foundOrder = orderService.getOrderById(1L);

        assertNotNull(foundOrder);
        assertEquals(1L, foundOrder.getId());
        verify(orderRepository, times(1)).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenOrderNotFound() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () -> orderService.getOrderById(99L));

        assertEquals("Order not found with id: 99", exception.getMessage());
    }

    @Test
    void shouldGetAllOrders() {
        when(orderRepository.findAll()).thenReturn(List.of(order));

        List<Order> orders = orderService.getAllOrders();

        assertFalse(orders.isEmpty());
        assertEquals(1, orders.size());
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    void shouldRemoveItemFromOrder() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        orderService.removeItemFromOrder(1L, 2L);

        assertTrue(order.getOrderItems().isEmpty());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void shouldThrowExceptionWhenRemovingNonExistentItem() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        Exception exception = assertThrows(EntityNotFoundException.class,
                () -> orderService.removeItemFromOrder(1L, 99L));

        assertEquals("Product not found in this order", exception.getMessage());
    }

    @Test
    void shouldUpdateProductQuantity() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        orderService.updateProductQuantity(1L, 2L, 5);

        assertEquals(5, orderItem.getQuantity());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void shouldRemoveProductIfQuantityZero() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        orderService.updateProductQuantity(1L, 2L, 0);

        assertTrue(order.getOrderItems().isEmpty());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void shouldChangeOrderStatusToConfirmed() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        orderService.changeOrderStatus(1L, OrderStatus.CONFIRMED);

        assertEquals(OrderStatus.CONFIRMED, order.getStatus());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void shouldThrowExceptionIfOrderNotSubmittedForConfirmation() {
        order.setStatus(OrderStatus.DELIVERED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        Exception exception = assertThrows(IllegalStateException.class,
                () -> orderService.changeOrderStatus(1L, OrderStatus.CONFIRMED));

        assertEquals("Order must be SUBMITTED before it can be confirmed", exception.getMessage());
    }

    @Test
    void shouldChangeOrderStatusToDelivered() {
        order.setStatus(OrderStatus.CONFIRMED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        orderService.changeOrderStatus(1L, OrderStatus.DELIVERED);

        assertEquals(OrderStatus.DELIVERED, order.getStatus());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void shouldThrowExceptionIfOrderNotConfirmedForDelivery() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        Exception exception = assertThrows(IllegalStateException.class,
                () -> orderService.changeOrderStatus(1L, OrderStatus.DELIVERED));

        assertEquals("Order must be CONFIRMED before it can be marked as DELIVERED", exception.getMessage());
    }

    @Test
    void shouldChangeOrderStatusToCancelled() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        orderService.changeOrderStatus(1L, OrderStatus.CANCELLED);

        assertEquals(OrderStatus.CANCELLED, order.getStatus());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void shouldDeleteOrder() {
        doNothing().when(orderRepository).deleteById(1L);

        orderService.deleteOrder(1L);

        verify(orderRepository, times(1)).deleteById(1L);
    }
}
