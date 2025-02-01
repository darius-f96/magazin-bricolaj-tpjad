package bricolage.service.interfaces;

import bricolage.controller.dto.UserProfileDTO;
import bricolage.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    User createUser(User user);
    User getUserById(Long id);
    List<User> getAllUsers();
    User updateUser(Long id, User user);
    void deleteUser(Long id);
    User getUserByUsername(String username);
    UserProfileDTO getUserProfile(Long userId);
}

