package bricolage.controller;

import bricolage.controller.dto.OrderDTO;
import bricolage.entity.Order;
import bricolage.mappers.OrderMapper;
import bricolage.service.OrderManagementService;
import bricolage.service.UserServiceImpl;
import bricolage.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final OrderManagementService orderManagementService;
    private final UserService userService;

    /**
     * Retrieves the cart for the authenticated user.
     * If no cart exists, creates a new one.
     */
    @GetMapping
    public ResponseEntity<OrderDTO> getCart(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        OrderDTO cart = OrderMapper.toOrderDTO(orderManagementService.getCartForUser(userId));
        return ResponseEntity.ok(cart);
    }

    /**
     * Adds an item (product) to the authenticated user's cart.
     * 
     * @param productId ID of the product to add
     * @param quantity  Quantity of the product to add
     */
    @PostMapping("/addItem")
    public ResponseEntity<OrderDTO> addItemToCart(
            Authentication authentication,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        Long userId = getUserIdFromAuthentication(authentication);
        OrderDTO updatedCart = OrderMapper.toOrderDTO(orderManagementService.addItemToCart(userId, productId, quantity));
        return ResponseEntity.ok(updatedCart);
    }

    /**
     * Removes an item (product) from the authenticated user's cart.
     * 
     * @param productId ID of the product to remove
     */
    @DeleteMapping("/removeItem")
    public ResponseEntity<OrderDTO> removeItemFromCart(
            Authentication authentication,
            @RequestParam Long productId) {
        Long userId = getUserIdFromAuthentication(authentication);
        OrderDTO updatedCart = OrderMapper.toOrderDTO(orderManagementService.removeItemFromCart(userId, productId));
        return ResponseEntity.ok(updatedCart);
    }

    /**
     * Submits the authenticated user's cart, marking it as a finalized order.
     */
    @PostMapping("/submit")
    public ResponseEntity<OrderDTO> submitCart(Authentication authentication, @RequestBody Map<String, String> deliveryDetails) {
        var deliveryDetailsId = deliveryDetails.get("deliveryDetailsId");
        Long userId = getUserIdFromAuthentication(authentication);
        OrderDTO submittedOrder = OrderMapper.toOrderDTO(orderManagementService.submitOrder(userId, deliveryDetailsId));
        return ResponseEntity.ok(submittedOrder);
    }

    /**
     * Utility method to extract the user ID from the Authentication object.
     * 
     * Assumes the user ID is stored as a claim in the Bearer token (JWT).
     */
    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User userDetails) {
            return userService.getUserByUsername(userDetails.getUsername()).getId();
        }
        throw new IllegalStateException("Unable to extract user ID from authentication.");
    }

    @GetMapping("/userOrders")
    public Page<OrderDTO> getOrders(
            Authentication authentication,
            Pageable pageable,
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String minPrice,
            @RequestParam(required = false) String maxPrice

    ){
        Long userId = getUserIdFromAuthentication(authentication);

        return orderManagementService.getUserOrders(pageable, userId, productName, startDate, endDate, minPrice, maxPrice);
    }
}