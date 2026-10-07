import { apiRequest } from "@/api/client";

import type {
  CreateJobRequest,
  Job,
  UpdateJobRequest,
  UpdateJobStatusRequest,
} from "./types";

export function getJobs(): Promise<Job[]> {
  return apiRequest<Job[]>("/jobs", {
    method: "GET",
    authenticated: true,
    tenantScoped: true,
  });
}

export function getJob(id: string): Promise<Job> {
  return apiRequest<Job>(`/jobs/${id}`, {
    method: "GET",
    authenticated: true,
    tenantScoped: true,
  });
}

export function createJob(
  request: CreateJobRequest,
): Promise<Job> {
  return apiRequest<Job>("/jobs", {
    method: "POST",
    authenticated: true,
    tenantScoped: true,
    body: request,
  });
}

export function updateJob(
  id: string,
  request: UpdateJobRequest,
): Promise<Job> {
  return apiRequest<Job>(`/jobs/${id}`, {
    method: "PATCH",
    authenticated: true,
    tenantScoped: true,
    body: request,
  });
}

export function updateJobStatus(
  id: string,
  request: UpdateJobStatusRequest,
): Promise<Job> {
  return apiRequest<Job>(`/jobs/${id}/status`, {
    method: "PATCH",
    authenticated: true,
    tenantScoped: true,
    body: request,
  });
}

export function deleteJob(id: string): Promise<void> {
  return apiRequest<void>(`/jobs/${id}`, {
    method: "DELETE",
    authenticated: true,
    tenantScoped: true,
  });
}