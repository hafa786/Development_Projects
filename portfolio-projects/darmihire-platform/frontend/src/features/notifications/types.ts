export type NotificationStatus = "PENDING" | "PROCESSING" | "SENT" | "FAILED";

export type NotificationChannel = "EMAIL";

export type NotificationType =
    | "APPLICATION_RECEIVED"
    | "INTERVIEW_INVITATION"
    | "INTERVIEW_UPDATED"
    | "INTERVIEW_CANCELLED"
    | "OFFER_SENT"
    | "OFFER_ACCEPTED"
    | "OFFER_DECLINED"
    | "OFFER_WITHDRAWN"
    | "APPLICATION_REJECTED"
    | "NEW_APPLICATION";

export type Notification = {
    id: string;

    type: NotificationType;
    channel: NotificationChannel;
    status: NotificationStatus;

    recipient: string;
    subject: string;

    relatedEntityType?: string | null;
    relatedEntityId?: string | null;

    attemptCount: number;

    failureReason?: string | null;

    sentAt?: string | null;
    failedAt?: string | null;

    createdAt: string;
};
