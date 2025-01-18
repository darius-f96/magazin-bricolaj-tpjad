package bricolage.repository;

import bricolage.entity.User;
import bricolage.utils.JpaRepositoryExtensions;

public interface UserRepository extends JpaRepositoryExtensions<User, Long> {
}

