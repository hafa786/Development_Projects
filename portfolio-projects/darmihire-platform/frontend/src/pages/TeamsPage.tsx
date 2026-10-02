import {
  Plus,
  UsersRound,
} from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";

export default function TeamsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Teams"
        description="Create teams and organize workspace members."
        actions={
          <Button disabled>
            <Plus />
            Add team
          </Button>
        }
      />

      <EmptyState
        icon={UsersRound}
        title="No teams yet"
        description="Create your first team to organize recruiters and hiring managers."
      />
    </div>
  );
}