import {
    useForm,
} from "react-hook-form";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import {
    Button,
} from "@/components/ui/button";

import {
    Input,
} from "@/components/ui/input";

import {
    Label,
} from "@/components/ui/label";

import {
    Textarea,
} from "@/components/ui/textarea";

import {
    offerSchema,
    type OfferFormValues,
} from "./schemas";

type Props = {
    defaultValues?: Partial<OfferFormValues>;

    submitting?: boolean;

    submitLabel?: string;

    onSubmit: (
        values: OfferFormValues,
    ) => Promise<void> | void;
};

export function OfferForm({
    defaultValues,
    submitting = false,
    submitLabel = "Save offer",
    onSubmit,
}: Props) {
    const form =
        useForm<OfferFormValues>({
            resolver:
                zodResolver(
                    offerSchema,
                ),

            defaultValues: {
                salary: 0,
                currency: "EUR",
                salaryPeriod:
                    "MONTHLY",

                employmentType:
                    "FULL_TIME",

                startDate: "",
                expirationDate: "",

                probationPeriod: "",
                benefits: "",
                additionalTerms: "",

                ...defaultValues,
            },
        });

    const errors =
        form.formState.errors;

    return (
        <form
            className="space-y-6"
            onSubmit={form.handleSubmit(
                onSubmit,
            )}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                    <Label>
                        Salary *
                    </Label>

                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...form.register(
                            "salary",
                        )}
                    />

                    <ErrorText
                        message={
                            errors.salary
                                ?.message
                        }
                    />
                </Field>

                <Field>
                    <Label>
                        Currency *
                    </Label>

                    <Input
                        maxLength={3}
                        placeholder="EUR"
                        className="uppercase"
                        {...form.register(
                            "currency",
                        )}
                    />

                    <ErrorText
                        message={
                            errors.currency
                                ?.message
                        }
                    />
                </Field>

                <Field>
                    <Label>
                        Salary period *
                    </Label>

                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        {...form.register(
                            "salaryPeriod",
                        )}
                    >
                        <option value="HOURLY">
                            Hourly
                        </option>

                        <option value="MONTHLY">
                            Monthly
                        </option>

                        <option value="ANNUAL">
                            Annual
                        </option>
                    </select>
                </Field>

                <Field>
                    <Label>
                        Employment type *
                    </Label>

                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        {...form.register(
                            "employmentType",
                        )}
                    >
                        <option value="FULL_TIME">
                            Full time
                        </option>

                        <option value="PART_TIME">
                            Part time
                        </option>

                        <option value="CONTRACT">
                            Contract
                        </option>

                        <option value="TEMPORARY">
                            Temporary
                        </option>

                        <option value="INTERNSHIP">
                            Internship
                        </option>
                    </select>
                </Field>

                <Field>
                    <Label>
                        Employment start
                    </Label>

                    <Input
                        type="date"
                        {...form.register(
                            "startDate",
                        )}
                    />

                    <ErrorText
                        message={
                            errors.startDate
                                ?.message
                        }
                    />
                </Field>

                <Field>
                    <Label>
                        Offer expiration
                    </Label>

                    <Input
                        type="date"
                        {...form.register(
                            "expirationDate",
                        )}
                    />

                    <ErrorText
                        message={
                            errors
                                .expirationDate
                                ?.message
                        }
                    />
                </Field>
            </div>

            <Field>
                <Label>
                    Probation period
                </Label>

                <Input
                    placeholder="e.g. 6 months"
                    {...form.register(
                        "probationPeriod",
                    )}
                />

                <ErrorText
                    message={
                        errors
                            .probationPeriod
                            ?.message
                    }
                />
            </Field>

            <Field>
                <Label>Benefits</Label>

                <Textarea
                    rows={4}
                    placeholder="Healthcare, lunch benefit, phone benefit..."
                    {...form.register(
                        "benefits",
                    )}
                />
            </Field>

            <Field>
                <Label>
                    Additional terms
                </Label>

                <Textarea
                    rows={5}
                    placeholder="Hybrid working arrangement, bonus terms..."
                    {...form.register(
                        "additionalTerms",
                    )}
                />
            </Field>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={
                        submitting
                    }
                >
                    {submitting
                        ? "Saving..."
                        : submitLabel}
                </Button>
            </div>
        </form>
    );
}

function Field({
    children,
}: {
    children:
        React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            {children}
        </div>
    );
}

function ErrorText({
    message,
}: {
    message?: string;
}) {
    if (!message) {
        return null;
    }

    return (
        <p className="text-sm text-destructive">
            {message}
        </p>
    );
}