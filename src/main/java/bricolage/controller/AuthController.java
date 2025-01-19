package bricolage.controller;

import bricolage.entity.User;
import bricolage.repository.UserRepository;
import bricolage.service.TokenBlacklistService;
import bricolage.utils.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenBlacklistService tokenBlacklistService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password)
        );

        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        String accessToken = jwtUtil.generateAccessToken(username, user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(username);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> refreshRequest) {
        String refreshToken = refreshRequest.get("refreshToken");

        String username = jwtUtil.extractUsername(refreshToken);
        if (username != null && jwtUtil.isTokenExpired(refreshToken)) {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(401).body("User not found");
            }
            String newAccessToken = jwtUtil.generateAccessToken(username, user.getRole().name());

            Map<String, String> response = new HashMap<>();
            response.put("accessToken", newAccessToken);

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid or expired refresh token");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(400).body("Username is already taken");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        return ResponseEntity.status(201).body("User created successfully");
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklistService.blacklistToken(token);
            return ResponseEntity.ok("Logged out successfully");
        }
        return ResponseEntity.badRequest().body("Invalid token");
    }
}

