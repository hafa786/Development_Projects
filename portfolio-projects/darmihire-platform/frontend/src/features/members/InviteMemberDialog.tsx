import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  CreateInvitationRequest,
  MemberRole,
} from "@/features/members/types";

type InviteMemberDialogProps = {
  open: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (
    request: CreateInvitationRequest,
  ) => void;
};

const roles: Array<{
  value: MemberRole;
  label: string;
}> = [
  {
    value: "COMPANY_ADMIN",
    label: "Company admin",
  },
  {
    value: "RECRUITER",
    label: "Recruiter",
  },
  {
    value: "HIRING_MANAGER",
    label: "Hiring manager",
  },
  {
    value: "INTERVIEWER",
    label: "Interviewer",
  },
  {
    value: "VIEWER",
    label: "Viewer",
  },
];

export function InviteMemberDialog({
  open,
  loading = false,
  onOpenChange,
  onConfirm,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] =
    useState<MemberRole>("VIEWER");

  const [emailError, setEmailError] =
    useState("");

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmail("");
      setRole("VIEWER");
      setEmailError("");
    }
  }, [open]);

  function handleSubmit() {
    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setEmailError(
        "Email is required.",
      );
      return;
    }

    const validEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail,
      );

    if (!validEmail) {
      setEmailError(
        "Enter a valid email address.",
      );
      return;
    }

    setEmailError("");

    onConfirm({
      email: normalizedEmail,
      role,
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Invite workspace member
          </DialogTitle>

          <DialogDescription>
            Invite someone to join your
            DarmiHire workspace and choose
            their initial role.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <label
              htmlFor="invitation-email"
              className="text-sm font-medium"
            >
              Email address
            </label>

            <Input
              id="invitation-email"
              type="email"
              value={email}
              disabled={loading}
              placeholder="name@example.com"
              onChange={(event) => {
                setEmail(
                  event.target.value,
                );

                if (emailError) {
                  setEmailError("");
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
            />

            {emailError && (
              <p className="text-sm text-destructive">
                {emailError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Workspace role
            </label>

            <Select
              value={role}
              disabled={loading}
              onValueChange={(value) =>
                setRole(
                  value as MemberRole,
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {roles.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              You can change the member's
              role later.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            disabled={
              loading ||
              !email.trim()
            }
            onClick={handleSubmit}
          >
            {loading
              ? "Sending..."
              : "Send invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}