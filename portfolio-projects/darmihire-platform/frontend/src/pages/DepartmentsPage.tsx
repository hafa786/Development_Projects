import {
  Building2,
  Plus,
} from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";

export default function DepartmentsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Departments"
        description="Organize your company structure for hiring."
        actions={
          <Button disabled>
            <Plus />
            Add department
          </Button>
        }
      />

      <EmptyState
        icon={Building2}
        title="No departments yet"
        description="Create departments such as Engineering, Sales, Marketing, or Operations."
      />
    </div>
  );
}