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

export type PublicCareer = {
  name: string;
  slug: string;
};

export type PublicJob = {
  title: string;
  slug: string;

  department: string | null;
  team: string | null;
  location: string | null;

  employmentType: EmploymentType;
  workplaceType: WorkplaceType;

  openings: number;

  applicationDeadline: string | null;
};