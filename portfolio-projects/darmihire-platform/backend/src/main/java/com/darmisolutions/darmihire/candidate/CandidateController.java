package com.darmisolutions.darmihire.candidate;

import com.darmisolutions.darmihire.candidate.dto.CandidateResponse;
import com.darmisolutions.darmihire.candidate.dto.CreateCandidateRequest;
import com.darmisolutions.darmihire.candidate.dto.UpdateCandidateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @GetMapping
    public List<CandidateResponse> findAll() {
        return candidateService.findAll();
    }

    @GetMapping("/{id}")
    public CandidateResponse findById(
        @PathVariable UUID id
    ) {
        return candidateService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CandidateResponse create(
        @Valid @RequestBody CreateCandidateRequest request
    ) {
        return candidateService.create(request);
    }

    @PutMapping("/{id}")
    public CandidateResponse update(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateCandidateRequest request
    ) {
        return candidateService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
        @PathVariable UUID id
    ) {
        candidateService.delete(id);
    }
}