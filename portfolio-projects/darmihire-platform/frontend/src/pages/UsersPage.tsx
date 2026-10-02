import { Users } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";

export default function UsersPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <PageHeader
        title="Users"
        description="Manage people who have access to your DarmiHire workspace."
      />

      <EmptyState
        icon={Users}
        title="User management"
        description="Workspace users and invitations will be configured in a later UI step."
      />
    </div>
  );
}