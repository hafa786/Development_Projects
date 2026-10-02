import { Building2 } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";

export default function DepartmentsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <PageHeader
        title="Departments"
        description="Organize your company structure for hiring."
      />

      <EmptyState
        icon={Building2}
        title="No departments yet"
        description="Create departments such as Engineering, Sales, Marketing, or Operations."
      />
    </div>
  );
}