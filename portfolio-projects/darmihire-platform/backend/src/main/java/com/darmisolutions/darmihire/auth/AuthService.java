package com.darmisolutions.darmihire.auth;

import com.darmisolutions.darmihire.auth.dto.RegisterRequest;
import com.darmisolutions.darmihire.auth.dto.UserRegistrationResponse;
import com.darmisolutions.darmihire.user.User;
import com.darmisolutions.darmihire.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserRegistrationResponse register(RegisterRequest request) {

        String email = request.email()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException(
                    "Email is already registered"
            );
        }

        User user = new User();

        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setEmail(email);

        user.setPasswordHash(
                passwordEncoder.encode(request.password())
        );

        user.setActive(true);

        User saved = userRepository.save(user);

        return new UserRegistrationResponse(
                saved.getId(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getEmail()
        );
    }
}