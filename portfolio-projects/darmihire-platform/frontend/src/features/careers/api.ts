import type {
  PublicCareer,
  PublicJob,
} from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:8080";

async function publicRequest<T>(
  path: string,
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      method: "GET",

      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "Careers page not found.",
      );
    }

    throw new Error(
      "Unable to load careers information.",
    );
  }

  return response.json() as Promise<T>;
}

export function getPublicCareer(
  companySlug: string,
) {
  return publicRequest<PublicCareer>(
    `/api/public/careers/${encodeURIComponent(
      companySlug,
    )}`,
  );
}

export function getPublicJobs(
  companySlug: string,
) {
  return publicRequest<PublicJob[]>(
    `/api/public/careers/${encodeURIComponent(
      companySlug,
    )}/jobs`,
  );
}