import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "sonner";

import { ApiError } from "@/api/errors";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormError } from "@/components/auth/FormError";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/features/auth/api";
import {
  type LoginFormData,
  loginSchema,
} from "@/features/auth/schemas";
import {
  getTenantId,
  setTokens,
} from "@/utils/session";

type LocationState = {
  from?: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setError,

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
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });

      setTokens({
        accessToken:
          response.accessToken,

        refreshToken:
          response.refreshToken,
      });

      toast.success(
        "Welcome back to DarmiHire.",
      );

      const state =
        location.state as
          | LocationState
          | null;

      const previousRoute =
        state?.from;

      if (previousRoute) {
        navigate(
          previousRoute,
          {
            replace: true,
          },
        );

        return;
      }

      if (getTenantId()) {
        navigate(
          "/dashboard",
          {
            replace: true,
          },
        );

        return;
      }

      navigate(
        "/onboarding",
        {
          replace: true,
        },
      );
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        setError("root", {
          type: "server",
          message:
            "Invalid email or password.",
        });

        return;
      }

      if (error instanceof ApiError) {
        setError("root", {
          type: "server",
          message:
            error.message,
        });

        return;
      }

      setError("root", {
        type: "server",
        message:
          "Unable to connect to DarmiHire. Please try again.",
      });
    }
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
          {errors.root?.message && (
            <div
              className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {errors.root.message}
            </div>
          )}

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
                errors.email
                  ? "true"
                  : "false"
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
                message={
                  errors.email?.message
                }
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
                errors.password
                  ? "true"
                  : "false"
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
                message={
                  errors.password?.message
                }
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
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Create account
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}