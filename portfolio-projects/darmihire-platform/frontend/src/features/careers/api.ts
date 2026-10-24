import type {
  PublicCareer,
  PublicJob,
  PublicJobApplicationRequest,
  PublicJobApplicationResponse,
  PublicJobDetails,
} from "./types";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";

type PublicRequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
};

async function publicRequest<T>(
  path: string,
  options: PublicRequestOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",

    headers: {
      Accept: "application/json",

      ...(options.body
        ? {
            "Content-Type": "application/json",
          }
        : {}),
    },

    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let message = "Unable to complete the request.";

    try {
      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      message = data.message ?? data.error ?? message;
    } catch {
      // Response did not contain JSON.
    }

    if (response.status === 404) {
      throw new Error(message || "Resource not found.");
    }

    if (response.status === 409) {
      throw new Error(message || "An application has already been submitted.");
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function getPublicCareer(companySlug: string) {
  return publicRequest<PublicCareer>(
    `/api/public/careers/${encodeURIComponent(companySlug)}`,
  );
}

export function getPublicJobs(companySlug: string) {
  return publicRequest<PublicJob[]>(
    `/api/public/careers/${encodeURIComponent(companySlug)}/jobs`,
  );
}

/*
 * ---------------------------------------------------------
 * PUBLIC JOB DETAILS
 * ---------------------------------------------------------
 */

export function getPublicJob(companySlug: string, jobSlug: string) {
  return publicRequest<PublicJobDetails>(
    `/api/public/careers/${encodeURIComponent(
      companySlug,
    )}/jobs/${encodeURIComponent(jobSlug)}`,
  );
}

/*
 * ---------------------------------------------------------
 * PUBLIC JOB APPLICATION
 * ---------------------------------------------------------
 */
export async function submitPublicApplication(
  companySlug: string,
  jobSlug: string,
  data: PublicJobApplicationRequest,
  resume?: File | null, // ← ADD THIS
): Promise<PublicJobApplicationResponse> {
  const formData = new FormData();

  formData.append(
    "application",
    new Blob([JSON.stringify(data)], {
      type: "application/json",
    }),
  );

  // Now TypeScript knows what "resume" is
  if (resume) {
    formData.append("resume", resume, resume.name);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/public/careers/${encodeURIComponent(companySlug)}/jobs/${encodeURIComponent(jobSlug)}/applications`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    let message = "Failed to submit application.";

    try {
      const error = (await response.json()) as {
        message?: string;
        detail?: string;
        error?: string;
      };

      message = error.message ?? error.detail ?? error.error ?? message;
    } catch {
      // Ignore non-JSON error responses.
    }

    if (response.status === 409) {
      throw new Error(message || "You have already applied for this position.");
    }

    throw new Error(message);
  }

  return response.json();
}
