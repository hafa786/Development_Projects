import { z } from "zod";

export const locationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Location name must be at least 2 characters.")
    .max(150, "Location name must be 150 characters or less."),

  city: z
    .string()
    .trim()
    .max(100, "City must be 100 characters or less."),

  country: z
    .string()
    .trim()
    .max(100, "Country must be 100 characters or less."),

  timezone: z
    .string()
    .trim()
    .max(100, "Timezone must be 100 characters or less."),

  remote: z.boolean(),
});

export type LocationFormData =
  z.infer<typeof locationSchema>;