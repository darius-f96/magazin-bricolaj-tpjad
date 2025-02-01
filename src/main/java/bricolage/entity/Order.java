package bricolage.entity;

import bricolage.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, name = "order_date")
    @CreationTimestamp
    private LocalDateTime orderDate;

    @Column(nullable = false, name = "updated")
    @UpdateTimestamp
    private LocalDateTime updated;
    @Formula("(SELECT SUM(oi.quantity * p.price) FROM order_items oi " +
            "JOIN products p ON oi.product_id = p.id WHERE oi.order_id = id)")
    private Double totalPrice;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;

    @OneToOne
    @JoinColumn(name = "delivery_details_id")
    private DeliveryDetails deliveryDetails;

    public double getTotalPrice() {
        return totalPrice != null ? totalPrice : 0.0;
    }
}

