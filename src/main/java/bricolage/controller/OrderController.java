package bricolage.controller;

import bricolage.controller.dto.FullOrderDTO;
import bricolage.entity.Order;
import bricolage.enums.OrderStatus;
import bricolage.mappers.OrderMapper;
import bricolage.service.interfaces.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class OrderController {

    private final OrderService orderService;

    @DeleteMapping("/{orderId}/items/{productId}")
    public ResponseEntity<Void> removeItemFromOrder(@PathVariable Long orderId, @PathVariable Long productId) {
        orderService.removeItemFromOrder(orderId, productId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{orderId}/items/{productId}/updateQt")
    public ResponseEntity<Void> updateProductQuantity(@PathVariable Long orderId,
                                                      @PathVariable Long productId,
                                                      @RequestParam int quantity) {
        if (quantity <= 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        orderService.updateProductQuantity(orderId, productId, quantity);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Void> changeOrderStatus(@PathVariable Long orderId,
                                                  @RequestParam OrderStatus newStatus) {
        orderService.changeOrderStatus(orderId, newStatus);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FullOrderDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(OrderMapper.toFullOrderDTO(orderService.getOrderById(id)));
    }

    @GetMapping
    public ResponseEntity<List<FullOrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders().stream().map(
                OrderMapper::toFullOrderDTO
        ).toList());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}

