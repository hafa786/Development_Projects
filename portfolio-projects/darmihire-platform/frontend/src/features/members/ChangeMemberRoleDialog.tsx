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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  Member,
  MemberRole,
} from "@/features/members/types";

type ChangeMemberRoleDialogProps = {
  open: boolean;
  member: Member | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (role: MemberRole) => void;
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

export function ChangeMemberRoleDialog({
  open,
  member,
  loading = false,
  onOpenChange,
  onConfirm,
}: ChangeMemberRoleDialogProps) {
  const [role, setRole] =
    useState<MemberRole>("VIEWER");

  useEffect(() => {
    if (member) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(member.role);
    }
  }, [member]);

  const memberName = member
    ? `${member.firstName} ${member.lastName}`.trim()
    : "";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Change member role
          </DialogTitle>

          <DialogDescription>
            Change the workspace role for{" "}
            <strong>{memberName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Select
            value={role}
            onValueChange={(value) =>
              setRole(value as MemberRole)
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
              !member ||
              role === member.role
            }
            onClick={() =>
              onConfirm(role)
            }
          >
            {loading
              ? "Saving..."
              : "Save role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}