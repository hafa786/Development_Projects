package com.darmisolutions.darmihire.team;

import com.darmisolutions.darmihire.team.dto.AddTeamMemberRequest;
import com.darmisolutions.darmihire.team.dto.CreateTeamRequest;
import com.darmisolutions.darmihire.team.dto.TeamResponse;
import com.darmisolutions.darmihire.team.dto.UpdateTeamRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    /*
     * ---------------------------------------------------------
     * GET ALL TEAMS
     * ---------------------------------------------------------
     *
     * GET /api/v1/teams
     */

    @GetMapping
    public List<TeamResponse> findAll() {

        return teamService.findAll();
    }

    /*
     * ---------------------------------------------------------
     * GET TEAM
     * ---------------------------------------------------------
     *
     * GET /api/v1/teams/{id}
     */

    @GetMapping("/{id}")
    public TeamResponse findById(
            @PathVariable UUID id
    ) {

        return teamService.findById(id);
    }

    /*
     * ---------------------------------------------------------
     * CREATE TEAM
     * ---------------------------------------------------------
     *
     * POST /api/v1/teams
     */

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeamResponse create(
            @Valid
            @RequestBody
            CreateTeamRequest request
    ) {

        return teamService.create(request);
    }

    /*
     * ---------------------------------------------------------
     * UPDATE TEAM
     * ---------------------------------------------------------
     *
     * PATCH /api/v1/teams/{id}
     */

    @PatchMapping("/{id}")
    public TeamResponse update(
            @PathVariable UUID id,

            @Valid
            @RequestBody
            UpdateTeamRequest request
    ) {

        return teamService.update(
                id,
                request
        );
    }

    /*
     * ---------------------------------------------------------
     * DELETE TEAM
     * ---------------------------------------------------------
     *
     * DELETE /api/v1/teams/{id}
     */

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable UUID id
    ) {

        teamService.delete(id);
    }

    /*
     * ---------------------------------------------------------
     * ADD MEMBER
     * ---------------------------------------------------------
     *
     * POST /api/v1/teams/{teamId}/members
     */

    @PostMapping("/{teamId}/members")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addMember(
            @PathVariable UUID teamId,

            @Valid
            @RequestBody
            AddTeamMemberRequest request
    ) {

        teamService.addMember(
                teamId,
                request
        );
    }

    /*
     * ---------------------------------------------------------
     * REMOVE MEMBER
     * ---------------------------------------------------------
     *
     * DELETE
     * /api/v1/teams/{teamId}/members/{tenantUserId}
     */

    @DeleteMapping(
            "/{teamId}/members/{tenantUserId}"
    )
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(
            @PathVariable UUID teamId,
            @PathVariable UUID tenantUserId
    ) {

        teamService.removeMember(
                teamId,
                tenantUserId
        );
    }
}