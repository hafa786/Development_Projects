import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  publicApplicationSchema,
  type PublicApplicationFormValues,
} from "../applicationSchema";
import { FileText, Upload, X } from "lucide-react";
import { RESUME_ACCEPT, validateResume } from "@/features/careers/resume";

import type { PublicJobApplicationResponse } from "../types";
import { useState } from "react";

type PublicApplicationFormProps = {
  jobTitle: string;

  isSubmitting: boolean;

  error: string | null;

  result: PublicJobApplicationResponse | null;

  onSubmit: (values: PublicApplicationFormValues) => void;
};

export function PublicApplicationForm({
  jobTitle,
  isSubmitting,
  error,
  result,
  onSubmit,
}: PublicApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PublicApplicationFormValues>({
    resolver: zodResolver(publicApplicationSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      linkedinUrl: "",
      portfolioUrl: "",
    },
  });

  const [resume, setResume] = useState<File | null>(null);

  const [resumeError, setResumeError] = useState<string | null>(null);

  if (result) {
    return (
      <div className="rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="size-6 text-emerald-700" />
        </div>

        <h2 className="mt-5 text-2xl font-semibold">Application submitted</h2>

        <p className="mt-3 leading-7 text-muted-foreground">
          Thank you, {result.candidateName}. Your application for{" "}
          <span className="font-medium text-foreground">{result.jobTitle}</span>{" "}
          has been received.
        </p>

        <p className="mt-4 text-sm text-muted-foreground">
          The hiring team will review your application and contact you if your
          profile matches the next stage of the process.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-sm font-semibold text-emerald-700">Apply now</p>

        <h2 className="mt-2 text-2xl font-semibold">Apply for {jobTitle}</h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Fill in your details below to submit your application.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="First name"
            required
            error={errors.firstName?.message}
          >
            <Input
              {...register("firstName")}
              placeholder="John"
              autoComplete="given-name"
            />
          </FormField>

          <FormField
            label="Last name"
            required
            error={errors.lastName?.message}
          >
            <Input
              {...register("lastName")}
              placeholder="Doe"
              autoComplete="family-name"
            />
          </FormField>
        </div>

        <FormField label="Email" required error={errors.email?.message}>
          <Input
            {...register("email")}
            type="email"
            placeholder="john.doe@example.com"
            autoComplete="email"
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Phone" error={errors.phone?.message}>
            <Input
              {...register("phone")}
              type="tel"
              placeholder="+358 40 123 4567"
              autoComplete="tel"
            />
          </FormField>

          <FormField label="Location" error={errors.location?.message}>
            <Input
              {...register("location")}
              placeholder="Helsinki, Finland"
              autoComplete="address-level2"
            />
          </FormField>
        </div>

        <FormField label="LinkedIn profile" error={errors.linkedinUrl?.message}>
          <Input
            {...register("linkedinUrl")}
            placeholder="https://linkedin.com/in/..."
          />
        </FormField>

        <FormField
          label="Portfolio / website"
          error={errors.portfolioUrl?.message}
        >
          <Input {...register("portfolioUrl")} placeholder="https://..." />
        </FormField>

        <div className="space-y-2">
          <label className="text-sm font-medium">Resume</label>

          {!resume ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors hover:bg-muted/50">
              <Upload className="mb-3 h-6 w-6 text-muted-foreground" />

              <span className="text-sm font-medium">Upload your resume</span>

              <span className="mt-1 text-xs text-muted-foreground">
                PDF, DOC or DOCX • Max 5 MB
              </span>

              <input
                type="file"
                className="hidden"
                accept={RESUME_ACCEPT}
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  const error = validateResume(file);

                  if (error) {
                    setResume(null);
                    setResumeError(error);

                    event.target.value = "";

                    return;
                  }

                  setResume(file);
                  setResumeError(null);
                }}
              />
            </label>
          ) : (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{resume.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {(resume.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="rounded-md p-2 hover:bg-muted"
                onClick={() => {
                  setResume(null);
                  setResumeError(null);
                }}
                aria-label="Remove resume"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {resumeError && (
            <p className="text-sm text-destructive">{resumeError}</p>
          )}
        </div>
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Submit application
            </>
          )}
        </Button>

        <p className="text-center text-xs leading-5 text-muted-foreground">
          By submitting this form, your information will be shared with the
          hiring team for recruitment purposes.
        </p>
      </form>
    </div>
  );
}

function FormField({
  label,
  required = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}

        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>

      {children}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
