package com.darmisolutions.darmihire.offer;

import com.darmisolutions.darmihire.offer.dto.CreateOfferRequest;
import com.darmisolutions.darmihire.offer.dto.DeclineOfferRequest;
import com.darmisolutions.darmihire.offer.dto.OfferResponse;
import com.darmisolutions.darmihire.offer.dto.RejectOfferRequest;
import com.darmisolutions.darmihire.offer.dto.UpdateOfferRequest;
import com.darmisolutions.darmihire.offer.dto.WithdrawOfferRequest;

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
    public List<OfferResponse> findAll(
            @RequestParam(required = false)
            OfferStatus status
    ) {
        if (status != null) {
            return offerService.findAllByStatus(status);
        }

        return offerService.findAll();
    }

    @GetMapping("/{offerId}")
    public OfferResponse findById(
            @PathVariable UUID offerId
    ) {
        return offerService.findById(offerId);
    }

    @GetMapping("/application/{applicationId}")
    public List<OfferResponse> findByApplication(
            @PathVariable UUID applicationId
    ) {
        return offerService.findByApplication(
                applicationId
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OfferResponse create(
            @Valid
            @RequestBody
            CreateOfferRequest request
    ) {
        return offerService.create(request);
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
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable UUID offerId
    ) {
        offerService.delete(offerId);
    }

    @PatchMapping("/{offerId}/submit")
    public OfferResponse submit(
            @PathVariable UUID offerId
    ) {
        return offerService
                .submitForApproval(offerId);
    }

    @PatchMapping("/{offerId}/approve")
    public OfferResponse approve(
            @PathVariable UUID offerId
    ) {
        return offerService.approve(offerId);
    }

    @PatchMapping("/{offerId}/reject")
    public OfferResponse reject(
            @PathVariable UUID offerId,
            @Valid
            @RequestBody
            RejectOfferRequest request
    ) {
        return offerService.reject(
                offerId,
                request
        );
    }

    @PatchMapping("/{offerId}/send")
    public OfferResponse send(
            @PathVariable UUID offerId
    ) {
        return offerService.send(offerId);
    }

    @PatchMapping("/{offerId}/accept")
    public OfferResponse accept(
            @PathVariable UUID offerId
    ) {
        return offerService.accept(offerId);
    }

    @PatchMapping("/{offerId}/decline")
    public OfferResponse decline(
            @PathVariable UUID offerId,
            @Valid
            @RequestBody
            DeclineOfferRequest request
    ) {
        return offerService.decline(
                offerId,
                request
        );
    }

    @PatchMapping("/{offerId}/withdraw")
    public OfferResponse withdraw(
            @PathVariable UUID offerId,
            @Valid
            @RequestBody
            WithdrawOfferRequest request
    ) {
        return offerService.withdraw(
                offerId,
                request
        );
    }
}