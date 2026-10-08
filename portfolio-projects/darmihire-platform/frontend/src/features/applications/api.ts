import { apiRequest } from "@/api/client";

import type {
  CreateJobApplicationRequest,
  JobApplication,
  RejectApplicationRequest,
  UpdateApplicationStageRequest,
} from "./types";

export function getApplications() {
  return apiRequest<JobApplication[]>("/applications", {
    method: "GET",
    authenticated: true,
    tenantScoped: true,
  });
}

export function getApplication(id: string) {
  return apiRequest<JobApplication>(
    `/applications/${id}`,
    {
      method: "GET",
      authenticated: true,
      tenantScoped: true,
    },
  );
}

export function getApplicationsByJob(
  jobId: string,
) {
  return apiRequest<JobApplication[]>(
    `/applications/job/${jobId}`,
    {
      method: "GET",
      authenticated: true,
      tenantScoped: true,
    },
  );
}

export function getApplicationsByCandidate(
  candidateId: string,
) {
  return apiRequest<JobApplication[]>(
    `/applications/candidate/${candidateId}`,
    {
      method: "GET",
      authenticated: true,
      tenantScoped: true,
    },
  );
}

export function createApplication(
  request: CreateJobApplicationRequest,
) {
  return apiRequest<JobApplication>("/applications", {
    method: "POST",
    authenticated: true,
    tenantScoped: true,
    body: request,
  });
}

export function updateApplicationStage(
  id: string,
  request: UpdateApplicationStageRequest,
) {
  return apiRequest<JobApplication>(
    `/applications/${id}/stage`,
    {
      method: "PATCH",
      authenticated: true,
      tenantScoped: true,
      body: request,
    },
  );
}

export function rejectApplication(
  id: string,
  request: RejectApplicationRequest,
) {
  return apiRequest<JobApplication>(
    `/applications/${id}/reject`,
    {
      method: "PATCH",
      authenticated: true,
      tenantScoped: true,
      body: request,
    },
  );
}

export function withdrawApplication(
  id: string,
) {
  return apiRequest<JobApplication>(
    `/applications/${id}/withdraw`,
    {
      method: "PATCH",
      authenticated: true,
      tenantScoped: true,
    },
  );
}