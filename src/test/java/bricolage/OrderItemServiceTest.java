package bricolage;

import bricolage.entity.Order;
import bricolage.entity.OrderItem;
import bricolage.entity.Product;
import bricolage.repository.OrderItemRepository;
import bricolage.service.OrderItemServiceImpl;
import bricolage.service.interfaces.OrderItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderItemServiceTest {

    @Mock
    private OrderItemRepository orderItemRepository;

    private OrderItemService orderItemService;
    private OrderItem orderItem;
    private Order order;
    private Product product;

    @BeforeEach
    void setUp() {
        orderItemService = new OrderItemServiceImpl(orderItemRepository);

        order = new Order();
        order.setId(1L);

        product = new Product();
        product.setId(2L);
        product.setName("Hammer");

        orderItem = new OrderItem();
        orderItem.setId(3L);
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(5);
        orderItem.setPrice(50.0);
    }

    @Test
    void shouldCreateOrderItem() {
        when(orderItemRepository.save(orderItem)).thenReturn(orderItem);

        OrderItem createdItem = orderItemService.createOrderItem(orderItem);

        assertNotNull(createdItem);
        assertEquals(orderItem.getId(), createdItem.getId());
        verify(orderItemRepository, times(1)).save(orderItem);
    }

    @Test
    void shouldGetOrderItemById() {
        when(orderItemRepository.findById(3L)).thenReturn(Optional.of(orderItem));

        OrderItem foundItem = orderItemService.getOrderItemById(3L);

        assertNotNull(foundItem);
        assertEquals(3L, foundItem.getId());
        verify(orderItemRepository, times(1)).findById(3L);
    }

    @Test
    void shouldThrowExceptionWhenOrderItemNotFound() {
        when(orderItemRepository.findById(99L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class,
                () -> orderItemService.getOrderItemById(99L));

        assertEquals("Order Item not found with id: 99", exception.getMessage());
    }

    @Test
    void shouldGetAllOrderItems() {
        when(orderItemRepository.findAll()).thenReturn(List.of(orderItem));

        List<OrderItem> orderItems = orderItemService.getAllOrderItems();

        assertFalse(orderItems.isEmpty());
        assertEquals(1, orderItems.size());
        verify(orderItemRepository, times(1)).findAll();
    }

    @Test
    void shouldUpdateOrderItem() {
        when(orderItemRepository.findById(3L)).thenReturn(Optional.of(orderItem));
        when(orderItemRepository.save(any(OrderItem.class))).thenReturn(orderItem);

        OrderItem updatedItem = new OrderItem();
        updatedItem.setOrder(order);
        updatedItem.setProduct(product);
        updatedItem.setQuantity(10);
        updatedItem.setPrice(100.0);

        OrderItem result = orderItemService.updateOrderItem(3L, updatedItem);

        assertNotNull(result);
        assertEquals(10, result.getQuantity());
        assertEquals(100.0, result.getPrice());
        verify(orderItemRepository, times(1)).save(orderItem);
    }

    @Test
    void shouldDeleteOrderItem() {
        doNothing().when(orderItemRepository).deleteById(3L);

        orderItemService.deleteOrderItem(3L);

        verify(orderItemRepository, times(1)).deleteById(3L);
    }
}

