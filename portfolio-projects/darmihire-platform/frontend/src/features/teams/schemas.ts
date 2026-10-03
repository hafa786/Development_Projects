import { z } from "zod";

export const teamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Team name must be at least 2 characters.")
    .max(150, "Team name must be 150 characters or less."),

  description: z
    .string()
    .trim()
    .max(
      500,
      "Description must be 500 characters or less.",
    ),
});

export type TeamFormData =
  z.infer<typeof teamSchema>;