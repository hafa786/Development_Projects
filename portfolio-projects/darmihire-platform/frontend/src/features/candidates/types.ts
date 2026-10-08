export type CandidateSource =
  | "CAREERS_PAGE"
  | "LINKEDIN"
  | "REFERRAL"
  | "RECRUITER"
  | "AGENCY"
  | "JOB_BOARD"
  | "MANUAL"
  | "OTHER";

export type Candidate = {
  id: string;

  firstName: string;
  lastName: string;
  fullName: string;

  email: string;
  phone: string | null;

  location: string | null;

  linkedinUrl: string | null;
  portfolioUrl: string | null;

  source: CandidateSource;

  resumeFileName: string | null;
  resumeUrl: string | null;

  notes: string | null;

  createdAt: string;
  updatedAt: string;
};

export type CreateCandidateRequest = {
  firstName: string;
  lastName: string;
  email: string;

  phone?: string | null;
  location?: string | null;

  linkedinUrl?: string | null;
  portfolioUrl?: string | null;

  source?: CandidateSource;

  resumeFileName?: string | null;
  resumeUrl?: string | null;

  notes?: string | null;
};

export type UpdateCandidateRequest = CreateCandidateRequest;