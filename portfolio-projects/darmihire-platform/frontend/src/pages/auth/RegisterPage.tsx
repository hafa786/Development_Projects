import {
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import {
  type FormEvent,
  useState,
} from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Temporary only.
      // The Spring Boot registration API will be
      // connected in a later step.
      console.log({
        firstName,
        lastName,
        email,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        description="Get started with DarmiHire and build your hiring workspace."
      >
        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First name
              </Label>

              <Input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Hafiz"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last name
              </Label>

              <Input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Sikandar"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Work email
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              disabled={isSubmitting}
            />

            <p className="text-xs text-muted-foreground">
              You'll use this email to sign in to
              DarmiHire.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>

            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength={8}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm password
            </Label>

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Enter your password again"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              minLength={8}
              required
              disabled={isSubmitting}
            />

            {confirmPassword &&
              password !== confirmPassword && (
                <p className="text-xs text-destructive">
                  Passwords do not match.
                </p>
              )}

            {confirmPassword &&
              password === confirmPassword && (
                <p className="flex items-center gap-1 text-xs text-green-600">
                  <Check className="size-3" />
                  Passwords match.
                </p>
              )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting ||
              password !== confirmPassword
            }
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