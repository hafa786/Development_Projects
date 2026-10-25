import { apiRequest } from "@/api/client";

import type {
    CreateInterviewFeedbackRequest,
    InterviewFeedback,
    UpdateInterviewFeedbackRequest,
} from "./types";

export function getInterviewFeedback(interviewId: string) {
    return apiRequest<InterviewFeedback[]>(`/interview-feedback/interview/${interviewId}`, {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export async function getMyInterviewFeedback(
    interviewId: string,
): Promise<InterviewFeedback | null> {
    const feedback = await apiRequest<InterviewFeedback | null>(
        `/interview-feedback/interview/${interviewId}/mine`,
        {
            method: "GET",
            authenticated: true,
            tenantScoped: true,
        },
    );

    return feedback ?? null;
}

export function getFeedback(feedbackId: string) {
    return apiRequest<InterviewFeedback>(`/interview-feedback/${feedbackId}`, {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export function createInterviewFeedback(request: CreateInterviewFeedbackRequest) {
    return apiRequest<InterviewFeedback>("/interview-feedback", {
        method: "POST",
        authenticated: true,
        tenantScoped: true,
        body: request,
    });
}

export function updateInterviewFeedback(
    feedbackId: string,
    request: UpdateInterviewFeedbackRequest,
) {
    return apiRequest<InterviewFeedback>(`/interview-feedback/${feedbackId}`, {
        method: "PUT",
        authenticated: true,
        tenantScoped: true,
        body: request,
    });
}

export function submitInterviewFeedback(feedbackId: string) {
    return apiRequest<InterviewFeedback>(`/interview-feedback/${feedbackId}/submit`, {
        method: "PATCH",
        authenticated: true,
        tenantScoped: true,
    });
}
