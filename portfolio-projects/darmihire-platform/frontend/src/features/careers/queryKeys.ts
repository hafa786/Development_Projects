export const careersQueryKeys = {
  all: ["public-careers"] as const,

  career: (companySlug: string) =>
    [
      ...careersQueryKeys.all,
      "career",
      companySlug,
    ] as const,

  jobs: (companySlug: string) =>
    [
      ...careersQueryKeys.all,
      "jobs",
      companySlug,
    ] as const,

  job: (
    companySlug: string,
    jobSlug: string,
  ) =>
    [
      ...careersQueryKeys.all,
      "job",
      companySlug,
      jobSlug,
    ] as const,
};