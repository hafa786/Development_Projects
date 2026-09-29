package com.darmisolutions.darmihire.location;

import com.darmisolutions.darmihire.location.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService service;

    @GetMapping
    public List<LocationResponse> findAll() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LocationResponse create(
            @Valid @RequestBody CreateLocationRequest request
    ) {
        return service.create(request);
    }

    @PatchMapping("/{id}")
    public LocationResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateLocationRequest request
    ) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}