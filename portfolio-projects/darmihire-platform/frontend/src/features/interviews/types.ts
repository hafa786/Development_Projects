export type InterviewType =
    | "PHONE_SCREEN"
    | "VIDEO_INTERVIEW"
    | "TECHNICAL_INTERVIEW"
    | "BEHAVIORAL_INTERVIEW"
    | "HR_INTERVIEW"
    | "HIRING_MANAGER_INTERVIEW"
    | "PANEL_INTERVIEW"
    | "FINAL_INTERVIEW"
    | "OTHER";

export type InterviewStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type InterviewInterviewer = {
    id: string;
    tenantUserId: string;
    name: string;
    email: string;
};

export type Interview = {
    id: string;

    applicationId: string;

    jobId: string;
    jobTitle: string;

    candidateId: string;
    candidateName: string;
    candidateEmail: string;

    title: string;
    interviewType: InterviewType;
    status: InterviewStatus;

    startTime: string;
    endTime: string;
    timezone: string;

    location: string | null;
    meetingUrl: string | null;
    notes: string | null;

    cancellationReason: string | null;
    cancelledAt: string | null;
    completedAt: string | null;

    interviewers: InterviewInterviewer[];

    createdAt: string;
    updatedAt: string;
};

export type CreateInterviewRequest = {
    applicationId: string;
    title: string;
    interviewType: InterviewType;
    startTime: string;
    endTime: string;
    timezone: string;
    location?: string | null;
    meetingUrl?: string | null;
    notes?: string | null;
    interviewerIds?: string[];
};

export type UpdateInterviewRequest = {
    title: string;
    interviewType: InterviewType;
    timezone: string;
    location?: string | null;
    meetingUrl?: string | null;
    notes?: string | null;
};

export type RescheduleInterviewRequest = {
    startTime: string;
    endTime: string;
    timezone: string;
};

export type CancelInterviewRequest = {
    reason?: string | null;
};

export type AddInterviewerRequest = {
    interviewerId: string;
};
