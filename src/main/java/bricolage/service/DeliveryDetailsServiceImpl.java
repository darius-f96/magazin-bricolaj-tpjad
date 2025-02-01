package bricolage.service;

import bricolage.controller.dto.DeliveryDetailsDTO;
import bricolage.entity.DeliveryDetails;
import bricolage.entity.User;
import bricolage.repository.DeliveryDetailsRepository;
import bricolage.repository.UserRepository;
import bricolage.service.interfaces.DeliveryDetailsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DeliveryDetailsServiceImpl implements DeliveryDetailsService {

    private final DeliveryDetailsRepository deliveryDetailsRepository;
    private final UserRepository userRepository;

    @Override
    public DeliveryDetailsDTO createDeliveryDetails(Long userId, DeliveryDetailsDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        DeliveryDetails deliveryDetails = DeliveryDetailsDTO.toEntity(dto, user);

        deliveryDetails = deliveryDetailsRepository.save(deliveryDetails);

        return DeliveryDetailsDTO.fromEntity(deliveryDetails);
    }

    @Override
    public List<DeliveryDetailsDTO> getDeliveryDetailsByUser(Long userId) {
        List<DeliveryDetails> deliveryDetailsList = deliveryDetailsRepository.findByUserId(userId);

        return deliveryDetailsList.stream()
                .map(DeliveryDetailsDTO::fromEntity)
                .toList();
    }

    @Override
    public DeliveryDetailsDTO getDeliveryDetailsById(Long id){
        DeliveryDetails deliveryDetails = deliveryDetailsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery Details not found with id: " + id));

        return DeliveryDetailsDTO.fromEntity(deliveryDetails);
    }
    @Override
    public void deleteDeliveryDetailsById(Long userId, Long id){
        var deliveryDetail = deliveryDetailsRepository.findByIdOrNull(id);
        if (deliveryDetail != null && deliveryDetail.getUser().getId().equals(userId))
            deliveryDetailsRepository.deleteById(id);
        else throw new IllegalArgumentException("Delivery Details not found with id: " + id + " or user is unauthorized.");
    }
    @Override
    public DeliveryDetailsDTO updateDeliveryDetail(Long userId, Long deliveryDetailId, DeliveryDetailsDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        DeliveryDetails deliveryDetail = deliveryDetailsRepository.findById(deliveryDetailId)
                .filter(details -> details.getUser().getId().equals(userId))
                .orElseThrow(() -> new IllegalArgumentException("Delivery detail not found or does not belong to the user"));

        deliveryDetail.setAddressLine1(dto.getAddressLine1());
        deliveryDetail.setAddressLine2(dto.getAddressLine2());
        deliveryDetail.setCity(dto.getCity());
        deliveryDetail.setCounty(dto.getCounty());
        deliveryDetail.setCountry(dto.getCountry());
        deliveryDetail.setPhoneNumber(dto.getPhoneNumber());
        deliveryDetail.setPostalCode(dto.getPostalCode());

        DeliveryDetails updatedDetail = deliveryDetailsRepository.save(deliveryDetail);

        return DeliveryDetailsDTO.fromEntity(updatedDetail);
    }

    @Override
    public DeliveryDetails getDeliveryDetailsById(Long userId, Long id){
        return deliveryDetailsRepository.findById(id)
                .filter(details -> details.getUser().getId().equals(userId))
                .orElseThrow(() -> new IllegalArgumentException("Delivery Details not found with id: " + id + " or user is unauthorized."));
    }
}
