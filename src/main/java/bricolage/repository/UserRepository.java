package bricolage.repository;

import bricolage.entity.User;
import bricolage.utils.JpaRepositoryExtensions;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepositoryExtensions<User, Long> {
}

