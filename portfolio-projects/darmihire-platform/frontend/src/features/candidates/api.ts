import { apiRequest } from "@/api/client";

import type { Candidate, CreateCandidateRequest, UpdateCandidateRequest } from "./types";
import { getAccessToken, getTenantId } from "@/utils/session";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

export function getCandidates() {
    return apiRequest<Candidate[]>("/candidates", {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export function getCandidate(id: string) {
    return apiRequest<Candidate>(`/candidates/${id}`, {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export function createCandidate(request: CreateCandidateRequest) {
    return apiRequest<Candidate>("/candidates", {
        method: "POST",
        authenticated: true,
        tenantScoped: true,
        body: request,
    });
}

export function updateCandidate(id: string, request: UpdateCandidateRequest) {
    return apiRequest<Candidate>(`/candidates/${id}`, {
        method: "PUT",
        authenticated: true,
        tenantScoped: true,
        body: JSON.stringify(request),
    });
}

export function deleteCandidate(id: string) {
    return apiRequest<void>(`/candidates/${id}`, {
        method: "DELETE",
        authenticated: true,
        tenantScoped: true,
    });
}

export async function downloadCandidateResume(
    candidateId: string,
    fileName = "resume",
): Promise<void> {
    const accessToken = getAccessToken();

    const tenantId = getTenantId();

    const response = await fetch(`${API_URL}/candidates/${candidateId}/resume`, {
        headers: {
            Accept: "application/octet-stream",

            ...(accessToken
                ? {
                      Authorization: `Bearer ${accessToken}`,
                  }
                : {}),

            ...(tenantId
                ? {
                      "X-Tenant-ID": tenantId,
                  }
                : {}),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to download resume.");
    }

    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = fileName;

    document.body.appendChild(anchor);

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
}
