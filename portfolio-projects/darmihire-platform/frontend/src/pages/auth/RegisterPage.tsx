import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormError } from "@/components/auth/FormError";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type RegisterFormData,
  registerSchema,
} from "@/features/auth/schemas";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword =
    watch("confirmPassword");

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  async function onSubmit(
    data: RegisterFormData,
  ) {
    // Temporary only.
    // API integration will be added later.
    console.log({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        description="Get started with DarmiHire and build your hiring workspace."
      >
        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First name
              </Label>

              <Input
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Hafiz"
                disabled={isSubmitting}
                aria-invalid={
                  errors.firstName
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  errors.firstName
                    ? "firstName-error"
                    : undefined
                }
                {...register("firstName")}
              />

              <div id="firstName-error">
                <FormError
                  message={
                    errors.firstName?.message
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last name
              </Label>

              <Input
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Sikandar"
                disabled={isSubmitting}
                aria-invalid={
                  errors.lastName
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  errors.lastName
                    ? "lastName-error"
                    : undefined
                }
                {...register("lastName")}
              />

              <div id="lastName-error">
                <FormError
                  message={
                    errors.lastName?.message
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Work email
            </Label>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              disabled={isSubmitting}
              aria-invalid={
                errors.email ? "true" : "false"
              }
              aria-describedby={
                errors.email
                  ? "register-email-error"
                  : undefined
              }
              {...register("email")}
            />

            <div id="register-email-error">
              <FormError
                message={errors.email?.message}
              />
            </div>

            {!errors.email && (
              <p className="text-xs text-muted-foreground">
                You'll use this email to sign in
                to DarmiHire.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>

            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="Create a password"
              disabled={isSubmitting}
              aria-invalid={
                errors.password
                  ? "true"
                  : "false"
              }
              aria-describedby={
                errors.password
                  ? "register-password-error"
                  : undefined
              }
              {...register("password")}
            />

            <div id="register-password-error">
              <FormError
                message={errors.password?.message}
              />
            </div>

            {!errors.password && (
              <p className="text-xs text-muted-foreground">
                Use at least 8 characters.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm password
            </Label>

            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Enter your password again"
              disabled={isSubmitting}
              aria-invalid={
                errors.confirmPassword
                  ? "true"
                  : "false"
              }
              aria-describedby={
                errors.confirmPassword
                  ? "confirm-password-error"
                  : undefined
              }
              {...register("confirmPassword")}
            />

            <div id="confirm-password-error">
              <FormError
                message={
                  errors.confirmPassword?.message
                }
              />
            </div>

            {!errors.confirmPassword &&
              passwordsMatch && (
                <p className="flex items-center gap-1 text-xs text-green-600">
                  <Check className="size-3" />
                  Passwords match.
                </p>
              )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight />
              </>
            )}
          </Button>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            By creating an account, you agree to
            DarmiHire's terms of service and privacy
            policy.
          </p>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </button>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}