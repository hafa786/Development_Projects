import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  candidateSchema,
  type CandidateFormValues,
} from "./schemas";

import type { Candidate } from "./types";

type CandidateFormProps = {
  candidate?: Candidate | null;
  submitting?: boolean;
  onSubmit: (values: CandidateFormValues) => void;
  onCancel: () => void;
};

export function CandidateForm({
  candidate,
  submitting = false,
  onSubmit,
  onCancel,
}: CandidateFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      linkedinUrl: "",
      portfolioUrl: "",
      source: "MANUAL",
      notes: "",
    },
  });

  useEffect(() => {
    reset({
      firstName: candidate?.firstName ?? "",
      lastName: candidate?.lastName ?? "",
      email: candidate?.email ?? "",
      phone: candidate?.phone ?? "",
      location: candidate?.location ?? "",
      linkedinUrl: candidate?.linkedinUrl ?? "",
      portfolioUrl: candidate?.portfolioUrl ?? "",
      source: candidate?.source ?? "MANUAL",
      notes: candidate?.notes ?? "",
    });
  }, [candidate, reset]);

  const source = watch("source");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="First name"
          error={errors.firstName?.message}
        >
          <Input
            placeholder="Emma"
            {...register("firstName")}
          />
        </Field>

        <Field
          label="Last name"
          error={errors.lastName?.message}
        >
          <Input
            placeholder="Anderson"
            {...register("lastName")}
          />
        </Field>
      </div>

      <Field
        label="Email"
        error={errors.email?.message}
      >
        <Input
          type="email"
          placeholder="emma@example.com"
          {...register("email")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Phone"
          error={errors.phone?.message}
        >
          <Input
            placeholder="+358 40 123 4567"
            {...register("phone")}
          />
        </Field>

        <Field
          label="Location"
          error={errors.location?.message}
        >
          <Input
            placeholder="Helsinki, Finland"
            {...register("location")}
          />
        </Field>
      </div>

      <Field label="Source">
        <Select
          value={source}
          onValueChange={(value) =>
            setValue(
              "source",
              value as CandidateFormValues["source"],
              {
                shouldValidate: true,
              },
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select source" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="MANUAL">
              Manual
            </SelectItem>

            <SelectItem value="LINKEDIN">
              LinkedIn
            </SelectItem>

            <SelectItem value="CAREERS_PAGE">
              Careers page
            </SelectItem>

            <SelectItem value="REFERRAL">
              Referral
            </SelectItem>

            <SelectItem value="RECRUITER">
              Recruiter
            </SelectItem>

            <SelectItem value="AGENCY">
              Agency
            </SelectItem>

            <SelectItem value="JOB_BOARD">
              Job board
            </SelectItem>

            <SelectItem value="OTHER">
              Other
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="LinkedIn"
          error={errors.linkedinUrl?.message}
        >
          <Input
            placeholder="https://linkedin.com/in/..."
            {...register("linkedinUrl")}
          />
        </Field>

        <Field
          label="Portfolio"
          error={errors.portfolioUrl?.message}
        >
          <Input
            placeholder="https://..."
            {...register("portfolioUrl")}
          />
        </Field>
      </div>

      <Field
        label="Notes"
        error={errors.notes?.message}
      >
        <Textarea
          rows={5}
          placeholder="Add internal notes about this candidate..."
          {...register("notes")}
        />
      </Field>

      <div className="flex justify-end gap-3 border-t pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Saving..."
            : candidate
              ? "Save changes"
              : "Create candidate"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {children}

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}