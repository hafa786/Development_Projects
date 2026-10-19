package com.darmisolutions.darmihire.offer;

import com.darmisolutions.darmihire.offer.dto.CreateOfferRequest;
import com.darmisolutions.darmihire.offer.dto.OfferResponse;
import com.darmisolutions.darmihire.offer.dto.UpdateOfferRequest;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;

    @GetMapping
    public List<OfferResponse> findAll() {

        return offerService.findAll();
    }

    @GetMapping("/{offerId}")
    public OfferResponse findById(
            @PathVariable UUID offerId
    ) {

        return offerService.findById(
                offerId
        );
    }

    @GetMapping(
            "/application/{applicationId}"
    )
    public List<OfferResponse>
    findByApplication(
            @PathVariable
            UUID applicationId
    ) {

        return offerService
                .findByApplication(
                        applicationId
                );
    }

    @PostMapping
    @ResponseStatus(
            HttpStatus.CREATED
    )
    public OfferResponse create(
            @Valid
            @RequestBody
            CreateOfferRequest request
    ) {

        return offerService.create(
                request
        );
    }

    @PutMapping("/{offerId}")
    public OfferResponse update(
            @PathVariable UUID offerId,

            @Valid
            @RequestBody
            UpdateOfferRequest request
    ) {

        return offerService.update(
                offerId,
                request
        );
    }

    @DeleteMapping("/{offerId}")
    @ResponseStatus(
            HttpStatus.NO_CONTENT
    )
    public void delete(
            @PathVariable UUID offerId
    ) {

        offerService.delete(
                offerId
        );
    }
}