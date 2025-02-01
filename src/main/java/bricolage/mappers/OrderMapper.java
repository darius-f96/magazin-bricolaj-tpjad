package bricolage.mappers;

import bricolage.controller.dto.*;
import bricolage.entity.Order;

import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderDTO toOrderDTO(Order order) {
        OrderDTO dto = new OrderDTO();

        dto.setId(order.getId());
        dto.setStatus(order.getStatus().toString());
        dto.setOrderDate(order.getOrderDate());
        dto.setUpdated(order.getUpdated());
        dto.setTotalPrice(order.getTotalPrice());
        var deliveryDetails = order.getDeliveryDetails();
        if (deliveryDetails != null) {
            dto.setDeliveryDetails(DeliveryDetailsDTO.fromEntity(deliveryDetails));
        }

        if (order.getOrderItems() != null) {
            dto.setProducts(order.getOrderItems().stream()
                .map(item -> {
                    OrderItemDTO orderItemDTO = new OrderItemDTO();
                    orderItemDTO.setId(item.getProduct().getId());
                    orderItemDTO.setName(item.getProduct().getName());
                    orderItemDTO.setQuantity(item.getQuantity());
                    orderItemDTO.setPrice(item.getProduct().getPrice());
                    return orderItemDTO;
                })
                .collect(Collectors.toList()));
        }

        return dto;
    }

    public static FullOrderDTO toFullOrderDTO(Order order) {
        FullOrderDTO dto = new FullOrderDTO();

        dto.setId(order.getId());
        dto.setStatus(order.getStatus().toString());
        dto.setOrderDate(order.getOrderDate());
        dto.setUpdated(order.getUpdated());
        dto.setEmail(order.getUser().getEmail());
        dto.setName(order.getUser().getName());
        dto.setTotalPrice(order.getTotalPrice());
        var deliveryDetails = order.getDeliveryDetails();
        if (deliveryDetails != null) {
            dto.setDeliveryDetails(DeliveryDetailsDTO.fromEntity(deliveryDetails));
        }

        if (order.getOrderItems() != null) {
            dto.setProducts(order.getOrderItems().stream()
                    .map(item -> {
                        FullOrderItemDTO orderItemDTO = new FullOrderItemDTO();
                        orderItemDTO.setProductId(item.getProduct().getId());
                        orderItemDTO.setAvailableStock(item.getProduct().getStock());
                        orderItemDTO.setOrderItemId(item.getId());
                        orderItemDTO.setName(item.getProduct().getName());
                        orderItemDTO.setQuantity(item.getQuantity());
                        orderItemDTO.setPrice(item.getProduct().getPrice());
                        return orderItemDTO;
                    })
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}