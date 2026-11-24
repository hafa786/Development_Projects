import { apiRequest } from "@/api/client";

import type { Notification } from "./types";

export function getNotifications() {
    return apiRequest<Notification[]>("/notifications", {
        authenticated: true,
        tenantScoped: true,
    });
}

export function retryNotification(notificationId: string) {
    return apiRequest<Notification>(`/notifications/${notificationId}/retry`, {
        method: "POST",
        authenticated: true,
        tenantScoped: true,
    });
}
