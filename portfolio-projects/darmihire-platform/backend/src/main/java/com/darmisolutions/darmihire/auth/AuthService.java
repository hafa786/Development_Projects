package com.darmisolutions.darmihire.auth;

import com.darmisolutions.darmihire.auth.dto.RegisterRequest;
import com.darmisolutions.darmihire.auth.dto.UserRegistrationResponse;
import com.darmisolutions.darmihire.security.JwtService;
import com.darmisolutions.darmihire.user.User;
import com.darmisolutions.darmihire.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.darmisolutions.darmihire.auth.dto.AuthResponse;
import com.darmisolutions.darmihire.auth.dto.LoginRequest;
import com.darmisolutions.darmihire.auth.dto.RefreshTokenRequest;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final RefreshTokenService refreshTokenService;

        @Transactional
        public UserRegistrationResponse register(RegisterRequest request) {

                String email = request.email()
                                .trim()
                                .toLowerCase();

                if (userRepository.existsByEmailIgnoreCase(email)) {
                        throw new IllegalArgumentException(
                                        "Email is already registered");
                }

                User user = new User();

                user.setFirstName(request.firstName().trim());
                user.setLastName(request.lastName().trim());
                user.setEmail(email);

                user.setPasswordHash(
                                passwordEncoder.encode(request.password()));

                user.setActive(true);

                User saved = userRepository.save(user);

                return new UserRegistrationResponse(
                                saved.getId(),
                                saved.getFirstName(),
                                saved.getLastName(),
                                saved.getEmail());
        }

        @Transactional(readOnly = true)
        public AuthResponse login(LoginRequest request) {

                User user = userRepository
                                .findByEmailIgnoreCase(
                                                request.email().trim().toLowerCase())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Invalid email or password"));

                if (!user.isActive()) {
                        throw new IllegalArgumentException(
                                        "User account is disabled");
                }

                if (!passwordEncoder.matches(
                                request.password(),
                                user.getPasswordHash())) {
                        throw new IllegalArgumentException(
                                        "Invalid email or password");
                }

                String accessToken =
                        jwtService.generateAccessToken(user);

                String refreshToken =
                        refreshTokenService.create(user);

                return new AuthResponse(
                        accessToken,
                        refreshToken,
                        "Bearer",
                        900
                );
        }

        @Transactional
        public AuthResponse refresh(
                RefreshTokenRequest request
        ) {

        RefreshToken refreshToken =
                refreshTokenService.validate(
                        request.refreshToken()
                );

        User user = refreshToken.getUser();

        String accessToken =
                jwtService.generateAccessToken(user);

        return new AuthResponse(
                accessToken,
                request.refreshToken(),
                "Bearer",
                900
        );
        }

        @Transactional
        public void logout(
                RefreshTokenRequest request
        ) {
        refreshTokenService.revoke(
                request.refreshToken()
        );
        }
}