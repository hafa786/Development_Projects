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

import { Button } from "@/components/ui/button";
import {
    useEffect,
    useState,
} from "react";

import type {
    Member,
    MemberRole,
} from "./types";

type ChangeMemberRoleDialogProps = {
    member: Member | null;
    open: boolean;
    loading?: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (role: MemberRole) => void;
};

const roles: {
    value: MemberRole;
    label: string;
}[] = [
        {
            value: "COMPANY_ADMIN",
            label: "Company Admin",
        },
        {
            value: "RECRUITER",
            label: "Recruiter",
        },
        {
            value: "HIRING_MANAGER",
            label: "Hiring Manager",
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
    member,
    open,
    loading = false,
    onOpenChange,
    onConfirm,
}: ChangeMemberRoleDialogProps) {
    if (!member) {
        return null;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedRole,setSelectedRole] = useState<MemberRole>(member?.role ?? "VIEWER");

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (member) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedRole(member.role);
        }
    }, [member]);
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
                        <strong>
                            {member.firstName} {member.lastName}
                        </strong>
                        .
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Select
                        value={selectedRole}
                        onValueChange={(value) =>
                            setSelectedRole(
                                value as MemberRole,
                            )
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>

                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem
                                    key={role.value}
                                    value={role.value}
                                >
                                    {role.label}
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
                        disabled={loading}
                        onClick={() =>
                            onConfirm(selectedRole)
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