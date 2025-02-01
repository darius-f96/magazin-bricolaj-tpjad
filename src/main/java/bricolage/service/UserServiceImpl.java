package bricolage.service;


import bricolage.controller.dto.DeliveryDetailsDTO;
import bricolage.controller.dto.UserProfileDTO;
import bricolage.entity.User;
import bricolage.enums.UserRoles;
import bricolage.repository.UserRepository;
import bricolage.service.interfaces.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(Long id, User user) {
        User existingUser = getUserById(id);
        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        existingUser.setRole(user.getRole());
        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username);
        if (user == null) throw new UsernameNotFoundException("User not found with username: " + username);

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                AuthorityUtils.createAuthorityList(UserRoles.ROLE_ADMIN.name())
        );
    }

    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        return toUserProfileDTO(user);
    }
    /**
     * Converts a User entity into a UserProfileDTO.
     *
     * @param user The User entity containing personal and delivery details.
     * @return A UserProfileDTO object.
     */
    private UserProfileDTO toUserProfileDTO(User user) {
        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getDeliveryDetails().stream()
                        .map(delivery -> new DeliveryDetailsDTO(
                                delivery.getId(),
                                delivery.getAddressLine1(),
                                delivery.getAddressLine2(),
                                delivery.getCity(),
                                delivery.getCounty(),
                                delivery.getCountry(),
                                delivery.getPhoneNumber(),
                                delivery.getPostalCode()
                        ))
                        .collect(Collectors.toList())
        );
    }
}

