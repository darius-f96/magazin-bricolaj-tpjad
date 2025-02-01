package bricolage.service.interfaces;

import bricolage.controller.dto.DeliveryDetailsDTO;

import java.util.List;

public interface DeliveryDetailsService {
    DeliveryDetailsDTO createDeliveryDetails(Long userId, DeliveryDetailsDTO dto);
    List<DeliveryDetailsDTO> getDeliveryDetailsByUser(Long userId);
    DeliveryDetailsDTO getDeliveryDetailsById(Long id);
    void deleteDeliveryDetailsById(Long userId, Long id);
    DeliveryDetailsDTO updateDeliveryDetail(Long userId, Long deliveryDetailId, DeliveryDetailsDTO dto);
}
