package bricolage;

import bricolage.entity.Order;
import bricolage.entity.OrderItem;
import bricolage.entity.Product;
import bricolage.entity.User;
import bricolage.enums.OrderStatus;
import bricolage.repository.OrderItemRepository;
import bricolage.repository.OrderRepository;
import bricolage.repository.ProductRepository;
import bricolage.repository.UserRepository;
import bricolage.service.OrderManagementService;
import bricolage.service.interfaces.DeliveryDetailsService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderManagementServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private DeliveryDetailsService deliveryDetailsService;

    private OrderManagementService orderManagementService;

    private User user;
    private Order order;
    private Product product;
    private OrderItem orderItem;

    @BeforeEach
    void setUp() {
        orderManagementService = new OrderManagementService(orderRepository, orderItemRepository, productRepository, userRepository, deliveryDetailsService);
        user = new User();
        user.setId(1L);

        order = new Order();
        order.setId(1L);
        order.setUser(user);
        order.setStatus(OrderStatus.OPEN);

        product = new Product();
        product.setId(1L);

        orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(2);
    }

    @Test
    void getCartForUser_ShouldCreateNewCartIfNoneExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(orderRepository.findByUserIdAndStatus(1L, OrderStatus.OPEN)).thenReturn(null);
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order result = orderManagementService.getCartForUser(1L);

        assertNotNull(result);
        assertEquals(OrderStatus.OPEN, result.getStatus());
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void getCartForUser_ShouldReturnExistingCart_WhenOpenOrderExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(orderRepository.findByUserIdAndStatus(1L, OrderStatus.OPEN)).thenReturn(order);

        Order result = orderManagementService.getCartForUser(1L);

        assertNotNull(result);
        assertEquals(order, result);
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void addItemToCart_ShouldAddNewItem_WhenProductNotInCart() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(orderRepository.findByUserIdAndStatus(1L, OrderStatus.OPEN)).thenReturn(order);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderItemRepository.findByOrderIdAndProductId(order.getId(), product.getId())).thenReturn(null);

        orderManagementService.addItemToCart(1L, 1L, 3);

        verify(orderItemRepository).save(any(OrderItem.class));
    }

    @Test
    void removeItemFromCart_ShouldThrowException_WhenProductNotInCart() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(orderRepository.findByUserIdAndStatus(1L, OrderStatus.OPEN)).thenReturn(order);
        when(orderItemRepository.findByOrderIdAndProductId(order.getId(), product.getId())).thenReturn(null);

        assertThrows(EntityNotFoundException.class, () -> orderManagementService.removeItemFromCart(1L, 1L));
    }

    @Test
    void removeItemFromCart_ShouldRemoveItem_WhenProductExistsInCart() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(orderRepository.findByUserIdAndStatus(1L, OrderStatus.OPEN)).thenReturn(order);
        when(orderItemRepository.findByOrderIdAndProductId(order.getId(), product.getId())).thenReturn(orderItem);
        doNothing().when(orderItemRepository).delete(orderItem);

        orderManagementService.removeItemFromCart(1L, 1L);

        verify(orderItemRepository).delete(orderItem);
    }

}
