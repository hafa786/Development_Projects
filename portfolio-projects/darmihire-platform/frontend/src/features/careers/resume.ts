export const MAX_RESUME_SIZE = 5 * 1024 * 1024;

export const ACCEPTED_RESUME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const RESUME_ACCEPT = ".pdf,.doc,.docx";

export function validateResume(file: File): string | null {
    if (file.size > MAX_RESUME_SIZE) {
        return "Resume must not exceed 5 MB.";
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !["pdf", "doc", "docx"].includes(extension)) {
        return "Resume must be a PDF, DOC or DOCX file.";
    }

    /*
     * Some browsers/platforms can report an empty MIME type,
     * so the server remains the authoritative validator.
     */
    if (file.type && !ACCEPTED_RESUME_TYPES.includes(file.type)) {
        return "Unsupported resume file type.";
    }

    return null;
}
