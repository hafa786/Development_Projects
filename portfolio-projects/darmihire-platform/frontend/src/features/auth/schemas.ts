import { z } from "zod";

export const loginSchema = z.object({
  email: z
      .string()
      .toLowerCase()
      .trim()
      .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required."),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .max(100, "First name must be 100 characters or less."),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .max(100, "Last name must be 100 characters or less."),

    email: z
      .string()
      .toLowerCase()
      .trim()
      .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Enter a valid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must be 128 characters or less."),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

export type LoginFormData =
  z.infer<typeof loginSchema>;

export type RegisterFormData =
  z.infer<typeof registerSchema>;