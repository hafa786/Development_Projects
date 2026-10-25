import { z } from "zod";

export const publicApplicationSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required.").max(100),

    lastName: z.string().trim().min(1, "Last name is required.").max(100),

    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .email("Enter a valid email address.")
        .max(255),

    phone: z.string().trim().max(50).optional(),

    location: z.string().trim().max(255).optional(),

    linkedinUrl: z.string().trim().max(500).optional(),

    portfolioUrl: z.string().trim().max(500).optional(),
});

export type PublicApplicationFormValues = z.infer<typeof publicApplicationSchema>;
