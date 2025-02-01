package bricolage;

import bricolage.controller.dto.DeliveryDetailsDTO;
import bricolage.entity.DeliveryDetails;
import bricolage.entity.User;
import bricolage.repository.DeliveryDetailsRepository;
import bricolage.repository.UserRepository;
import bricolage.service.DeliveryDetailsServiceImpl;
import bricolage.service.interfaces.DeliveryDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class DeliveryDetailsServiceTest {

    @Mock
    private DeliveryDetailsRepository deliveryDetailsRepository;

    @Mock
    private UserRepository userRepository;

    private DeliveryDetailsService deliveryDetailsService;

    private User user;
    private DeliveryDetails deliveryDetails;
    private DeliveryDetailsDTO deliveryDetailsDTO;

    @BeforeEach
    void setUp() {
        deliveryDetailsService = new DeliveryDetailsServiceImpl(deliveryDetailsRepository, userRepository);

        user = new User();
        user.setId(1L);

        deliveryDetails = new DeliveryDetails();
        deliveryDetails.setId(1L);
        deliveryDetails.setUser(user);
        deliveryDetails.setCity("New York");

        deliveryDetailsDTO = new DeliveryDetailsDTO();
        deliveryDetailsDTO.setCity("New York");
    }

    @Test
    void createDeliveryDetails_ShouldCreateAndReturnDTO() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(deliveryDetailsRepository.save(any(DeliveryDetails.class))).thenReturn(deliveryDetails);

        DeliveryDetailsDTO result = deliveryDetailsService.createDeliveryDetails(1L, deliveryDetailsDTO);

        assertNotNull(result);
        assertEquals("New York", result.getCity());
        verify(deliveryDetailsRepository).save(any(DeliveryDetails.class));
    }

    @Test
    void getDeliveryDetailsByUser_ShouldReturnListOfDTOs() {
        when(deliveryDetailsRepository.findByUserId(1L)).thenReturn(List.of(deliveryDetails));

        List<DeliveryDetailsDTO> result = deliveryDetailsService.getDeliveryDetailsByUser(1L);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("New York", result.get(0).getCity());
    }

    @Test
    void getDeliveryDetailsById_ShouldReturnDTO() {
        when(deliveryDetailsRepository.findById(1L)).thenReturn(Optional.of(deliveryDetails));

        DeliveryDetailsDTO result = deliveryDetailsService.getDeliveryDetailsById(1L);

        assertNotNull(result);
        assertEquals("New York", result.getCity());
    }

    @Test
    void deleteDeliveryDetailsById_ShouldDeleteWhenExists() {
        when(deliveryDetailsRepository.findByIdOrNull(1L)).thenReturn(deliveryDetails);

        deliveryDetailsService.deleteDeliveryDetailsById(1L, 1L);

        verify(deliveryDetailsRepository).deleteById(1L);
    }

    @Test
    void updateDeliveryDetail_ShouldUpdateAndReturnDTO() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(deliveryDetailsRepository.findById(1L)).thenReturn(Optional.of(deliveryDetails));
        when(deliveryDetailsRepository.save(any(DeliveryDetails.class))).thenReturn(deliveryDetails);

        deliveryDetailsDTO.setCity("Los Angeles");
        DeliveryDetailsDTO result = deliveryDetailsService.updateDeliveryDetail(1L, 1L, deliveryDetailsDTO);

        assertNotNull(result);
        assertEquals("Los Angeles", result.getCity());
    }
}

