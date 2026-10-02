import {
  CircleHelp,
} from "lucide-react";

import {
  EmptyState,
} from "@/components/common/EmptyState";
import {
  PageHeader,
} from "@/components/common/PageHeader";

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Help & Support"
        description="Find help and support for your DarmiHire workspace."
      />

      <EmptyState
        icon={CircleHelp}
        title="Need help?"
        description="DarmiHire support resources and documentation will be available here."
      />
    </div>
  );
}