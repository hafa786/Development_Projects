export type JobStatus =
  | "DRAFT"
  | "OPEN"
  | "PAUSED"
  | "CLOSED";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "TEMPORARY"
  | "INTERNSHIP";

export type WorkplaceType =
  | "ON_SITE"
  | "HYBRID"
  | "REMOTE";

export type Job = {
  id: string;

  title: string;
  jobCode: string;
  description: string | null;

  departmentId: string | null;
  departmentName: string | null;

  teamId: string | null;
  teamName: string | null;

  locationId: string | null;
  locationName: string | null;

  recruiterId: string | null;
  recruiterName: string | null;

  hiringManagerId: string | null;
  hiringManagerName: string | null;

  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  status: JobStatus;

  openings: number;

  createdAt: string;
  updatedAt: string;
};

export type CreateJobRequest = {
  title: string;
  jobCode?: string | null;
  description?: string | null;

  departmentId?: string | null;
  teamId?: string | null;
  locationId?: string | null;

  recruiterId?: string | null;
  hiringManagerId?: string | null;

  employmentType: EmploymentType;
  workplaceType: WorkplaceType;

  openings: number;
};

export type UpdateJobRequest = {
  title: string;
  description?: string | null;

  departmentId?: string | null;
  teamId?: string | null;
  locationId?: string | null;

  recruiterId?: string | null;
  hiringManagerId?: string | null;

  employmentType: EmploymentType;
  workplaceType: WorkplaceType;

  openings: number;
};

export type UpdateJobStatusRequest = {
  status: JobStatus;
};