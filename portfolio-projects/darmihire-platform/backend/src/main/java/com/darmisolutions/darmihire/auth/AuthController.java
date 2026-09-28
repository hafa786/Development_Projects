package com.darmisolutions.darmihire.auth;

import com.darmisolutions.darmihire.auth.dto.AuthResponse;
import com.darmisolutions.darmihire.auth.dto.LoginRequest;
import com.darmisolutions.darmihire.auth.dto.RegisterRequest;
import com.darmisolutions.darmihire.auth.dto.UserRegistrationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserRegistrationResponse register(
            @Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}