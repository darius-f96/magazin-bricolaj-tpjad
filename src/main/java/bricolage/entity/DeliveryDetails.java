package bricolage.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "delivery_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "addres_line1")
    private String addressLine1;

    @Column(name = "addres_line2")
    private String addressLine2;

    @Column(name = "city")
    private String city;

    @Column(name = "county")
    private String county;

    @Column(name = "country")
    private String country;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "postal_code")
    private String postalCode;
}
