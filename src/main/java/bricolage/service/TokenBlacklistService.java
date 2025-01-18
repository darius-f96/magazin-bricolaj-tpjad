package bricolage.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TokenBlacklistService {

    private final Map<String, Long> blacklistedTokens = new HashMap<>();

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public void blacklistToken(String token) {
        blacklistedTokens.put(token, System.currentTimeMillis() + jwtExpiration);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.containsKey(token);
    }

    @Scheduled(fixedRateString = "${blacklist.cleanup.interval}")
    public void cleanUpBlacklistedTokens() {
        long now = System.currentTimeMillis();
        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue() < now);
    }
}
