package bricolage.controller.dto;

import bricolage.entity.DeliveryDetails;
import bricolage.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDetailsDTO {

    private Long id; // Used when reading the details (optional for creating)

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String county;

    private String country;

    private String phoneNumber;

    private String postalCode;

    public static DeliveryDetailsDTO fromEntity(DeliveryDetails deliveryDetails) {
        return new DeliveryDetailsDTO(
                deliveryDetails.getId(),
                deliveryDetails.getAddressLine1(),
                deliveryDetails.getAddressLine2(),
                deliveryDetails.getCity(),
                deliveryDetails.getCounty(),
                deliveryDetails.getCountry(),
                deliveryDetails.getPhoneNumber(),
                deliveryDetails.getPostalCode()
        );
    }
    public static DeliveryDetails toEntity(DeliveryDetailsDTO dto, User user) {
        return new DeliveryDetails(
                dto.getId() != null ? dto.getId() : null,
                user,
                dto.getAddressLine1(),
                dto.getAddressLine2(),
                dto.getCity(),
                dto.getCounty(),
                dto.getCountry(),
                dto.getPhoneNumber(),
                dto.getPostalCode()
        );
    }
}