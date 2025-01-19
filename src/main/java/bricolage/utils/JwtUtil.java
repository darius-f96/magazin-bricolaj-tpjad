package bricolage.utils;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${spring.jwt.secret-key}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long ACCESS_TOKEN_EXPIRATION_TIME;

    private final long REFRESH_TOKEN_EXPIRATION_TIME = 3600000; // 1h in ms

    public String generateAccessToken(String username, String role) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    public String generateRefreshToken(String username) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token, key.getEncoded()).getPayload().getSubject();
    }

    public boolean validateToken(String token, String username) {
        try{
            return extractUsername(token).equals(username) && !isTokenExpired(token);
        } catch(SecurityException | MalformedJwtException e) {
            throw new AuthenticationCredentialsNotFoundException("JWT was expired or incorrect");
        } catch (ExpiredJwtException e) {
            throw new AuthenticationCredentialsNotFoundException("Expired JWT token.");
        } catch (UnsupportedJwtException e) {
            throw new AuthenticationCredentialsNotFoundException("Unsupported JWT token.");
        } catch (IllegalArgumentException e) {
            throw new AuthenticationCredentialsNotFoundException("JWT token compact of handler are invalid.");
        }
    }

    public boolean isTokenExpired(String token) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token, key.getEncoded()).getPayload().getExpiration().before(new Date());
    }
}
