import { z } from "zod";

export const offerSchema = z
    .object({
        salary: z.coerce
            .number()
            .positive(
                "Salary must be greater than zero",
            ),

        currency: z
            .string()
            .trim()
            .length(
                3,
                "Currency must contain 3 letters",
            )
            .regex(
                /^[A-Za-z]{3}$/,
                "Use a valid 3-letter currency code",
            ),

        salaryPeriod: z.enum([
            "HOURLY",
            "MONTHLY",
            "ANNUAL",
        ]),

        employmentType: z.enum([
            "FULL_TIME",
            "PART_TIME",
            "CONTRACT",
            "TEMPORARY",
            "INTERNSHIP",
        ]),

        startDate: z
            .string()
            .optional(),

        expirationDate: z
            .string()
            .optional(),

        probationPeriod: z
            .string()
            .max(
                200,
                "Maximum 200 characters",
            )
            .optional(),

        benefits: z
            .string()
            .optional(),

        additionalTerms: z
            .string()
            .optional(),
    })
    .superRefine(
        (values, ctx) => {
            if (
                values.startDate &&
                values.expirationDate &&
                values.expirationDate >
                    values.startDate
            ) {
                ctx.addIssue({
                    code:
                        z.ZodIssueCode.custom,
                    path: [
                        "expirationDate",
                    ],
                    message:
                        "Expiration date must be on or before the employment start date",
                });
            }
        },
    );

export type OfferFormValues =
    z.infer<typeof offerSchema>;