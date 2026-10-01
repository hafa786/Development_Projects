import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
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
  type LoginFormData,
  loginSchema,
} from "@/features/auth/schemas";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(
    data: LoginFormData,
  ) {
    // Temporary only.
    // Spring Boot authentication will be connected
    // in a later step.
    console.log({
      email: data.email,
    });
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        description="Sign in to your DarmiHire workspace."
      >
        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email">
              Email address
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
                  ? "email-error"
                  : undefined
              }
              {...register("email")}
            />

            <div id="email-error">
              <FormError
                message={errors.email?.message}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">
                Password
              </Label>

              <button
                type="button"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={isSubmitting}
              aria-invalid={
                errors.password ? "true" : "false"
              }
              aria-describedby={
                errors.password
                  ? "password-error"
                  : undefined
              }
              {...register("password")}
            />

            <div id="password-error">
              <FormError
                message={errors.password?.message}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight />
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
            >
              Create account
            </button>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}