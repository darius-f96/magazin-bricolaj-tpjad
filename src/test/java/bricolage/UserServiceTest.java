package bricolage;

import bricolage.entity.User;
import bricolage.enums.UserRoles;
import bricolage.repository.UserRepository;
import bricolage.service.UserServiceImpl;
import bricolage.service.interfaces.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    UserRepository userRepository;

    UserService userService;

    List<User> users;

    @BeforeEach
    void setUp() {
        userService = new UserServiceImpl(userRepository);

        User u1 = new User();
        u1.setName("test1");
        u1.setUsername("test1");
        u1.setEmail("test1@example.com");
        u1.setPassword("password123");
        u1.setRole(UserRoles.ROLE_ADMIN);

        User u2 = new User();
        u2.setName("test2");
        u2.setUsername("test2");
        u2.setEmail("test2@example.com");
        u2.setPassword("password123");
        u2.setRole(UserRoles.ROLE_ADMIN);

        User u3 = new User();
        u3.setName("test3");
        u3.setUsername("test3");
        u3.setEmail("test3@example.com");
        u3.setPassword("password123");
        u3.setRole(UserRoles.ROLE_ADMIN);

        this.users = new ArrayList<>();
        this.users.add(u1);
        this.users.add(u2);
        this.users.add(u3);
    }

    @AfterEach
    void tearDown() {}

    @Test
    void testGetUserByUsername() {
        User u = new User();
        u.setName("test1");
        u.setUsername("test1");
        u.setEmail("test1@example.com");
        u.setPassword("password123");
        u.setRole(UserRoles.ROLE_ADMIN);

        given(this.userRepository.findByUsername("test1")).willReturn(u);

        User result = this.userService.getUserByUsername("test1");

        assertThat(result.getId()).isEqualTo(u.getId());
        assertThat(result.getName()).isEqualTo(u.getName());
        assertThat(result.getUsername()).isEqualTo(u.getUsername());
        assertThat(result.getEmail()).isEqualTo(u.getEmail());
        assertThat(result.getPassword()).isEqualTo(u.getPassword());
        verify(this.userRepository, times(1)).findByUsername("test1");
    }

    @Test
    void testGetAllUsers() {
        given(this.userRepository.findAll()).willReturn(this.users);

        List<User> actualUsers = this.userService.getAllUsers();

        assertThat(actualUsers.size()).isEqualTo(this.users.size());

        verify(this.userRepository, times(1)).findAll();
    }
}
