package bricolage.service;

import bricolage.entity.Order;
import bricolage.entity.OrderItem;
import bricolage.entity.Product;
import bricolage.entity.User;
import bricolage.enums.OrderStatus;
import bricolage.repository.OrderItemRepository;
import bricolage.repository.OrderRepository;
import bricolage.repository.ProductRepository;
import bricolage.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderManagementService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /**
     * Retrieves the "cart" for the user. 
     * If no OPEN order exists, creates a new one.
     */
    @Transactional
    public Order getCartForUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Order openOrder = orderRepository.findByUserIdAndStatus(userId, OrderStatus.OPEN);
        if (openOrder == null) {
            openOrder = new Order();
            openOrder.setUser(user);
            openOrder.setStatus(OrderStatus.OPEN);
            openOrder = orderRepository.save(openOrder);
        }

        return openOrder;
    }

    /**
     * Adds a product to the user's order (cart).
     * If the product already exists in the order, updates the quantity.
     */
    @Transactional
    public Order addItemToCart(Long userId, Long productId, Integer quantity) {
        Order cart = getCartForUser(userId);

        if (cart.getStatus() != OrderStatus.OPEN) {
            throw new IllegalStateException("Cart is not editable (Order is not OPEN).");
        }

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        OrderItem orderItem = orderItemRepository.findByOrderIdAndProductId(cart.getId(), productId);

        if (orderItem == null) {
            orderItem = new OrderItem();
            orderItem.setOrder(cart);
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setPrice(product.getPrice());
        } else {
            orderItem.setQuantity(orderItem.getQuantity() + quantity);
        }

        orderItemRepository.save(orderItem);

        return cart;
    }

    /**
     * Removes a product from the user's order (cart).
     */
    @Transactional
    public Order removeItemFromCart(Long userId, Long productId) {
        Order cart = getCartForUser(userId);

        if (cart.getStatus() != OrderStatus.OPEN) {
            throw new IllegalStateException("Cart is not editable (Order is not OPEN).");
        }

        OrderItem orderItem = orderItemRepository.findByOrderIdAndProductId(cart.getId(), productId);

        if (orderItem == null) {
            throw new EntityNotFoundException("The product is not in the cart.");
        }

        orderItemRepository.delete(orderItem);

        return cart;
    }

    /**
     * Submits the user's order, marking it as "SUBMITTED" and preventing further changes.
     */
    @Transactional
    public Order submitOrder(Long userId) {
        Order cart = getCartForUser(userId);

        if (cart.getStatus() != OrderStatus.OPEN) {
            throw new IllegalStateException("Order cannot be submitted (it is not OPEN).");
        }

        cart.setStatus(OrderStatus.SUBMITTED);

        return orderRepository.save(cart);
    }
}