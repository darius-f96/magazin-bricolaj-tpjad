package bricolage.utils;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface JpaRepositoryExtensions<T, ID> extends JpaRepository<T, ID> {
    default T findByIdOrNull(ID id) {
        return findById(id).orElse(null);
    }
}
