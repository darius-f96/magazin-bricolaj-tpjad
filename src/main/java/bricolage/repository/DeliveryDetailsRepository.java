package bricolage.repository;

import bricolage.entity.DeliveryDetails;
import bricolage.utils.JpaRepositoryExtensions;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryDetailsRepository extends JpaRepositoryExtensions<DeliveryDetails, Long> {
    List<DeliveryDetails> findByUserId(Long userId);
}

