import { apiRequest } from "@/api/client";

import type { ApplicationEvaluationSummary } from "./types";

export function getApplicationEvaluationSummary(applicationId: string) {
    return apiRequest<ApplicationEvaluationSummary>(`/application-evaluations/${applicationId}`, {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}
