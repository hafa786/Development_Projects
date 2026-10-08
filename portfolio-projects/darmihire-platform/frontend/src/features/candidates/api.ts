import { apiRequest } from "@/api/client";

import type {
  Candidate,
  CreateCandidateRequest,
  UpdateCandidateRequest,
} from "./types";

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

export function createCandidate(
  request: CreateCandidateRequest,
) {
  return apiRequest<Candidate>("/candidates", {
    method: "POST",
    authenticated: true,
    tenantScoped: true,
    body: request,
  });
}

export function updateCandidate(
  id: string,
  request: UpdateCandidateRequest,
) {
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