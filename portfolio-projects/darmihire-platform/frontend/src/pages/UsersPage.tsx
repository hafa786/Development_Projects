import {
  UserPlus,
  Users,
} from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Users"
        description="Manage people who have access to your DarmiHire workspace."
        actions={
          <Button disabled>
            <UserPlus />
            Invite user
          </Button>
        }
      />

      <EmptyState
        icon={Users}
        title="User management"
        description="Workspace users and invitations will be configured in a later UI step."
      />
    </div>
  );
}