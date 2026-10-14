package com.darmisolutions.darmihire.scorecard;

import com.darmisolutions.darmihire.scorecard.dto.*;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(
        "/api/v1/scorecard-templates"
)
@RequiredArgsConstructor
public class ScorecardTemplateController {

    private final ScorecardTemplateService
            scorecardTemplateService;

    @GetMapping
    public List<ScorecardTemplateResponse>
    findAll() {

        return scorecardTemplateService
                .findAll();
    }

    @GetMapping("/active")
    public List<ScorecardTemplateResponse>
    findActive() {

        return scorecardTemplateService
                .findActive();
    }

    @GetMapping("/{templateId}")
    public ScorecardTemplateResponse
    findById(
            @PathVariable
            UUID templateId
    ) {

        return scorecardTemplateService
                .findById(
                        templateId
                );
    }

    @PostMapping
    @ResponseStatus(
            HttpStatus.CREATED
    )
    public ScorecardTemplateResponse
    create(
            @Valid
            @RequestBody
            CreateScorecardTemplateRequest request
    ) {

        return scorecardTemplateService
                .create(request);
    }

    @PutMapping("/{templateId}")
    public ScorecardTemplateResponse
    update(
            @PathVariable
            UUID templateId,

            @Valid
            @RequestBody
            UpdateScorecardTemplateRequest request
    ) {

        return scorecardTemplateService
                .update(
                        templateId,
                        request
                );
    }

    @PatchMapping(
            "/{templateId}/activate"
    )
    public ScorecardTemplateResponse
    activate(
            @PathVariable
            UUID templateId
    ) {

        return scorecardTemplateService
                .activate(
                        templateId
                );
    }

    @PatchMapping(
            "/{templateId}/deactivate"
    )
    public ScorecardTemplateResponse
    deactivate(
            @PathVariable
            UUID templateId
    ) {

        return scorecardTemplateService
                .deactivate(
                        templateId
                );
    }

    @PostMapping(
            "/{templateId}/criteria"
    )
    @ResponseStatus(
            HttpStatus.CREATED
    )
    public ScorecardTemplateResponse
    addCriterion(
            @PathVariable
            UUID templateId,

            @Valid
            @RequestBody
            CreateScorecardCriterionRequest request
    ) {

        return scorecardTemplateService
                .addCriterion(
                        templateId,
                        request
                );
    }

    @PutMapping(
            "/{templateId}/criteria/{criterionId}"
    )
    public ScorecardTemplateResponse
    updateCriterion(
            @PathVariable
            UUID templateId,

            @PathVariable
            UUID criterionId,

            @Valid
            @RequestBody
            UpdateScorecardCriterionRequest request
    ) {

        return scorecardTemplateService
                .updateCriterion(
                        templateId,
                        criterionId,
                        request
                );
    }

    @DeleteMapping(
            "/{templateId}/criteria/{criterionId}"
    )
    public ScorecardTemplateResponse
    deleteCriterion(
            @PathVariable
            UUID templateId,

            @PathVariable
            UUID criterionId
    ) {

        return scorecardTemplateService
                .deleteCriterion(
                        templateId,
                        criterionId
                );
    }
}