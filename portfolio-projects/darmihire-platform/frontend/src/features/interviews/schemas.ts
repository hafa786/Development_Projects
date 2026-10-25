import { z } from "zod";

export const interviewTypes = [
    "PHONE_SCREEN",
    "VIDEO_INTERVIEW",
    "TECHNICAL_INTERVIEW",
    "BEHAVIORAL_INTERVIEW",
    "HR_INTERVIEW",
    "HIRING_MANAGER_INTERVIEW",
    "PANEL_INTERVIEW",
    "FINAL_INTERVIEW",
    "OTHER",
] as const;

export const interviewFormSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "Title is required")
            .max(200, "Title must be 200 characters or fewer"),

        interviewType: z.enum(interviewTypes),

        date: z.string().min(1, "Date is required"),

        startTime: z.string().min(1, "Start time is required"),

        endTime: z.string().min(1, "End time is required"),

        timezone: z.string().trim().min(1, "Timezone is required"),

        location: z.string().max(500, "Location must be 500 characters or fewer").optional(),

        meetingUrl: z.string().max(1000, "Meeting URL must be 1000 characters or fewer").optional(),

        notes: z.string().optional(),
    })
    .superRefine((value, ctx) => {
        if (!value.date || !value.startTime || !value.endTime) {
            return;
        }

        const start = new Date(`${value.date}T${value.startTime}:00`);

        const end = new Date(`${value.date}T${value.endTime}:00`);

        if (end <= start) {
            ctx.addIssue({
                code: "custom",
                path: ["endTime"],
                message: "End time must be after start time",
            });
        }
    });

export type InterviewFormValues = z.infer<typeof interviewFormSchema>;
