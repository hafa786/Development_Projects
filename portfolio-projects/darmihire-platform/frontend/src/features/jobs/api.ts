import { apiRequest } from "@/api/client";

import type {
    CreateJobRequest,
    Job,
    UpdateJobRequest,
    UpdateJobStatusRequest,
    PublishJobRequest,
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
        tenantScoped: true,
    });
}

export function createJob(request: CreateJobRequest): Promise<Job> {
    return apiRequest<Job>("/jobs", {
        method: "POST",
        tenantScoped: true,
        body: request,
    });
}

export function updateJob(id: string, request: UpdateJobRequest): Promise<Job> {
    return apiRequest<Job>(`/jobs/${id}`, {
        method: "PATCH",
        tenantScoped: true,
        body: request,
    });
}

export function updateJobStatus(id: string, request: UpdateJobStatusRequest): Promise<Job> {
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

export function publishJob(jobId: string, request: PublishJobRequest) {
    return apiRequest<Job>(`/jobs/${jobId}/publish`, {
        method: "PATCH",
        body: request,
        authenticated: true,
        tenantScoped: true,
    });
}

export function unpublishJob(jobId: string) {
    return apiRequest<Job>(`/jobs/${jobId}/unpublish`, {
        method: "PATCH",
        authenticated: true,
        tenantScoped: true,
    });
}
