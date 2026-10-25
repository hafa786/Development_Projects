import { apiRequest } from "@/api/client";

import type {
    CreateScorecardCriterionRequest,
    CreateScorecardTemplateRequest,
    ScorecardTemplate,
    UpdateScorecardCriterionRequest,
    UpdateScorecardTemplateRequest,
} from "./types";

export function getScorecardTemplates() {
    return apiRequest<ScorecardTemplate[]>("/scorecard-templates", {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export function getActiveScorecardTemplates() {
    return apiRequest<ScorecardTemplate[]>("/scorecard-templates/active", {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export function getScorecardTemplate(templateId: string) {
    return apiRequest<ScorecardTemplate>(`/scorecard-templates/${templateId}`, {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export function createScorecardTemplate(request: CreateScorecardTemplateRequest) {
    return apiRequest<ScorecardTemplate>("/scorecard-templates", {
        method: "POST",
        authenticated: true,
        tenantScoped: true,
        body: request,
    });
}

export function updateScorecardTemplate(
    templateId: string,
    request: UpdateScorecardTemplateRequest,
) {
    return apiRequest<ScorecardTemplate>(`/scorecard-templates/${templateId}`, {
        method: "PUT",
        authenticated: true,
        tenantScoped: true,
        body: request,
    });
}

export function activateScorecardTemplate(templateId: string) {
    return apiRequest<ScorecardTemplate>(`/scorecard-templates/${templateId}/activate`, {
        method: "PATCH",
        authenticated: true,
        tenantScoped: true,
    });
}

export function deactivateScorecardTemplate(templateId: string) {
    return apiRequest<ScorecardTemplate>(`/scorecard-templates/${templateId}/deactivate`, {
        method: "PATCH",
        authenticated: true,
        tenantScoped: true,
    });
}

export function addScorecardCriterion(
    templateId: string,
    request: CreateScorecardCriterionRequest,
) {
    return apiRequest<ScorecardTemplate>(`/scorecard-templates/${templateId}/criteria`, {
        method: "POST",
        authenticated: true,
        tenantScoped: true,
        body: request,
    });
}

export function updateScorecardCriterion(
    templateId: string,
    criterionId: string,
    request: UpdateScorecardCriterionRequest,
) {
    return apiRequest<ScorecardTemplate>(
        `/scorecard-templates/${templateId}/criteria/${criterionId}`,
        {
            method: "PUT",
            authenticated: true,
            tenantScoped: true,
            body: request,
        },
    );
}

export function deleteScorecardCriterion(templateId: string, criterionId: string) {
    return apiRequest<ScorecardTemplate>(
        `/scorecard-templates/${templateId}/criteria/${criterionId}`,
        {
            method: "DELETE",
            authenticated: true,
            tenantScoped: true,
        },
    );
}
