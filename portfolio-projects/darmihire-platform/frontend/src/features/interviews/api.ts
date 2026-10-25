import { apiRequest } from "@/api/client";

import type {
    AddInterviewerRequest,
    CancelInterviewRequest,
    CreateInterviewRequest,
    Interview,
    RescheduleInterviewRequest,
    UpdateInterviewRequest,
} from "./types";

export function getInterviews() {
    return apiRequest<Interview[]>("/interviews", {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export function getInterview(interviewId: string) {
    return apiRequest<Interview>(`/interviews/${interviewId}`, {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export function getApplicationInterviews(applicationId: string) {
    return apiRequest<Interview[]>(`/interviews/application/${applicationId}`, {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export function getUpcomingInterviews(from?: string, to?: string) {
    const params = new URLSearchParams();

    if (from) {
        params.set("from", from);
    }

    if (to) {
        params.set("to", to);
    }

    const query = params.toString();

    return apiRequest<Interview[]>(`/interviews/upcoming${query ? `?${query}` : ""}`, {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export function createInterview(request: CreateInterviewRequest) {
    return apiRequest<Interview>("/interviews", {
        method: "POST",
        authenticated: true,
        tenantScoped: true,
        body: request,
    });
}

export function updateInterview(interviewId: string, request: UpdateInterviewRequest) {
    return apiRequest<Interview>(`/interviews/${interviewId}`, {
        method: "PUT",
        authenticated: true,
        tenantScoped: true,
        body: request,
    });
}

export function rescheduleInterview(interviewId: string, request: RescheduleInterviewRequest) {
    return apiRequest<Interview>(`/interviews/${interviewId}/reschedule`, {
        method: "PATCH",
        authenticated: true,
        tenantScoped: true,
        body: request,
    });
}

export function cancelInterview(interviewId: string, request: CancelInterviewRequest) {
    return apiRequest<Interview>(`/interviews/${interviewId}/cancel`, {
        method: "PATCH",
        authenticated: true,
        tenantScoped: true,
        body: request,
    });
}

export function completeInterview(interviewId: string) {
    return apiRequest<Interview>(`/interviews/${interviewId}/complete`, {
        method: "PATCH",
        authenticated: true,
        tenantScoped: true,
    });
}

export function addInterviewer(interviewId: string, request: AddInterviewerRequest) {
    return apiRequest<Interview>(`/interviews/${interviewId}/interviewers`, {
        method: "POST",
        authenticated: true,
        tenantScoped: true,
        body: request,
    });
}

export function removeInterviewer(interviewId: string, interviewerId: string) {
    return apiRequest<Interview>(`/interviews/${interviewId}/interviewers/${interviewerId}`, {
        method: "DELETE",
        authenticated: true,
        tenantScoped: true,
    });
}
