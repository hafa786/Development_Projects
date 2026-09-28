package com.darmisolutions.darmihire.user;

import com.darmisolutions.darmihire.user.dto.UpdateUserRequest;
import com.darmisolutions.darmihire.user.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public UserResponse getUser(
            @PathVariable UUID id
    ) {
        return userService.getById(id);
    }

    @PatchMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return userService.update(id, request);
    }
}