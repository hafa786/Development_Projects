export type ApplicationStage =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED";

export type ApplicationStatus =
  | "ACTIVE"
  | "HIRED"
  | "REJECTED"
  | "WITHDRAWN";

export type JobApplication = {
  id: string;

  jobId: string;
  jobTitle: string;
  jobCode: string;

  candidateId: string;
  candidateFirstName: string;
  candidateLastName: string;
  candidateFullName: string;
  candidateEmail: string;

  candidatePhone: string | null;
  candidateLocation: string | null;

  stage: ApplicationStage;
  status: ApplicationStatus;

  appliedAt: string;

  rejectedAt: string | null;
  rejectionReason: string | null;

  withdrawnAt: string | null;
  hiredAt: string | null;

  createdAt: string;
  updatedAt: string;
};

export type CreateJobApplicationRequest = {
  jobId: string;
  candidateId: string;
};

export type UpdateApplicationStageRequest = {
  stage: ApplicationStage;
};

export type RejectApplicationRequest = {
  reason?: string | null;
};