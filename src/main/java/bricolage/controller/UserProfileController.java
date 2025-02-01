package bricolage.controller;

import bricolage.controller.dto.DeliveryDetailsDTO;
import bricolage.controller.dto.UserProfileDTO;
import bricolage.service.interfaces.DeliveryDetailsService;
import bricolage.service.interfaces.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@AllArgsConstructor
public class UserProfileController {

    private final DeliveryDetailsService deliveryDetailsService;
    private final UserService userService;

    /**
     * Get all delivery details for a user.
     */

    @GetMapping
    public ResponseEntity<UserProfileDTO> getUserProfile(Authentication authentication){
        Long userId = getUserIdFromAuthentication(authentication);
        if (userId == null)
            return ResponseEntity.status(401).build();
        var userProfile = userService.getUserProfile(userId);
        return ResponseEntity.ok(userProfile);
    }

    @GetMapping("/deliveryDetails")
    public ResponseEntity<List<DeliveryDetailsDTO>> getDeliveryDetailsByUser(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        if (userId == null)
            return ResponseEntity.status(401).build();
        List<DeliveryDetailsDTO> details = deliveryDetailsService.getDeliveryDetailsByUser(userId);
        return ResponseEntity.ok(details);
    }

    /**
     * Create delivery details for current user.
     */
    @PostMapping("/deliveryDetails/create")
    public ResponseEntity<DeliveryDetailsDTO> updateDeliveryDetail(
            Authentication authentication,
            @RequestBody DeliveryDetailsDTO deliveryDetailsDTO) {
        Long userId = getUserIdFromAuthentication(authentication);
        if (userId == null)
            return ResponseEntity.status(401).build();
        DeliveryDetailsDTO updatedDetail = deliveryDetailsService.createDeliveryDetails(userId, deliveryDetailsDTO);
        return ResponseEntity.ok(updatedDetail);
    }

    /**
     * Update existing delivery details.
     */
    @PutMapping("/deliveryDetails/{deliveryDetailId}")
    public ResponseEntity<DeliveryDetailsDTO> updateDeliveryDetail(
            Authentication authentication,
            @PathVariable Long deliveryDetailId,
            @RequestBody DeliveryDetailsDTO deliveryDetailsDTO) {
        Long userId = getUserIdFromAuthentication(authentication);
        if (userId == null)
            return ResponseEntity.status(401).build();
        DeliveryDetailsDTO updatedDetail = deliveryDetailsService.updateDeliveryDetail(userId, deliveryDetailId, deliveryDetailsDTO);
        return ResponseEntity.ok(updatedDetail);
    }

    /**
     * Delete delivery details by their ID.
     */
    @DeleteMapping("/deliveryDetails/{deliveryDetailId}")
    public ResponseEntity<Void> deleteDeliveryDetail(
            Authentication authentication,
            @PathVariable Long deliveryDetailId) {
        Long userId = getUserIdFromAuthentication(authentication);
        if (userId == null)
            return ResponseEntity.status(401).build();
        deliveryDetailsService.deleteDeliveryDetailsById(userId, deliveryDetailId);
        return ResponseEntity.noContent().build();
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User userDetails) {
            return userService.getUserByUsername(userDetails.getUsername()).getId();
        }
        throw new IllegalStateException("Unable to extract user ID from authentication.");
    }
}
