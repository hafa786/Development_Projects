import { apiRequest } from "@/api/client";

import type { CreateOfferRequest, Offer, OfferStatus, UpdateOfferRequest } from "./types";

export function getOffers(status?: OfferStatus): Promise<Offer[]> {
    const query = status ? `?status=${status}` : "";

    return apiRequest<Offer[]>(`/offers${query}`, {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export function getOffer(offerId: string): Promise<Offer> {
    return apiRequest<Offer>(`/offers/${offerId}`, {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export function getApplicationOffers(applicationId: string): Promise<Offer[]> {
    return apiRequest<Offer[]>(`/offers/application/${applicationId}`, {
        method: "GET",
        authenticated: true,
        tenantScoped: true,
    });
}

export function createOffer(request: CreateOfferRequest): Promise<Offer> {
    return apiRequest<Offer>("/offers", {
        method: "POST",
        authenticated: true,
        tenantScoped: true,
        body: request,
    });
}

export function updateOffer(offerId: string, request: UpdateOfferRequest): Promise<Offer> {
    return apiRequest<Offer>(`/offers/${offerId}`, {
        method: "PUT",
        authenticated: true,
        tenantScoped: true,
        body: request,
    });
}

export function deleteOffer(offerId: string): Promise<void> {
    return apiRequest<void>(`/offers/${offerId}`, {
        method: "DELETE",
        authenticated: true,
        tenantScoped: true,
    });
}

export function submitOffer(offerId: string): Promise<Offer> {
    return lifecycleRequest(offerId, "submit");
}

export function approveOffer(offerId: string): Promise<Offer> {
    return lifecycleRequest(offerId, "approve");
}

export function sendOffer(offerId: string): Promise<Offer> {
    return lifecycleRequest(offerId, "send");
}

export function acceptOffer(offerId: string): Promise<Offer> {
    return lifecycleRequest(offerId, "accept");
}

export function rejectOffer(offerId: string, reason: string): Promise<Offer> {
    return apiRequest<Offer>(`/offers/${offerId}/reject`, {
        method: "PATCH",
        authenticated: true,
        tenantScoped: true,
        body: {
            reason,
        },
    });
}

export function declineOffer(offerId: string, reason?: string): Promise<Offer> {
    return apiRequest<Offer>(`/offers/${offerId}/decline`, {
        method: "PATCH",
        authenticated: true,
        tenantScoped: true,
        body: {
            reason: reason?.trim() || null,
        },
    });
}

export function withdrawOffer(offerId: string, reason: string): Promise<Offer> {
    return apiRequest<Offer>(`/offers/${offerId}/withdraw`, {
        method: "PATCH",
        authenticated: true,
        tenantScoped: true,
        body: {
            reason,
        },
    });
}

function lifecycleRequest(
    offerId: string,
    action: "submit" | "approve" | "send" | "accept",
): Promise<Offer> {
    return apiRequest<Offer>(`/offers/${offerId}/${action}`, {
        method: "PATCH",
        authenticated: true,
        tenantScoped: true,
    });
}
