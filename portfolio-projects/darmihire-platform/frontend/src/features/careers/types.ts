export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY" | "INTERNSHIP";

export type WorkplaceType = "ON_SITE" | "HYBRID" | "REMOTE";

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

export type PublicJobDetails = {
    title: string;
    slug: string;
    description: string;

    department: string | null;
    team: string | null;
    location: string | null;

    employmentType: EmploymentType;
    workplaceType: WorkplaceType;

    openings: number;

    applicationDeadline: string | null;
};

export type PublicJobApplicationRequest = {
    firstName: string;
    lastName: string;
    email: string;

    phone?: string;
    location?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    resume?: File | null;
};

export type PublicJobApplicationResponse = {
    applicationId: string;
    jobTitle: string;
    candidateName: string;
    appliedAt: string;
    message: string;
};
