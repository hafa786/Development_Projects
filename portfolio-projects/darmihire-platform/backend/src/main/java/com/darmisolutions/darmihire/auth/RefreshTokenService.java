package com.darmisolutions.darmihire.auth;

import com.darmisolutions.darmihire.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository repository;

    private final SecureRandom secureRandom =
            new SecureRandom();

    @Transactional
    public String create(User user) {

        byte[] bytes = new byte[64];
        secureRandom.nextBytes(bytes);

        String rawToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        RefreshToken token = new RefreshToken();

        token.setUser(user);
        token.setTokenHash(hash(rawToken));

        token.setExpiresAt(
                Instant.now().plus(30, ChronoUnit.DAYS)
        );

        token.setRevoked(false);

        repository.save(token);

        return rawToken;
    }

    @Transactional(readOnly = true)
    public RefreshToken validate(String rawToken) {

        RefreshToken token = repository
                .findByTokenHashAndRevokedFalse(
                        hash(rawToken)
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid refresh token"
                        )
                );

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException(
                    "Refresh token expired"
            );
        }

        return token;
    }

    @Transactional
    public void revoke(String rawToken) {

        repository
                .findByTokenHashAndRevokedFalse(hash(rawToken))
                .ifPresent(token -> {
                    token.setRevoked(true);
                    repository.save(token);
                });
    }

    private String hash(String token) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            return HexFormat.of().formatHex(
                    digest.digest(
                            token.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    )
            );

        } catch (Exception exception) {
            throw new IllegalStateException(exception);
        }
    }
}