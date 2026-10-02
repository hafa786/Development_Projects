import { MapPin } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";

export default function LocationsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <PageHeader
        title="Locations"
        description="Manage office, remote, and hiring locations."
      />

      <EmptyState
        icon={MapPin}
        title="No locations yet"
        description="Add locations that can later be associated with job openings."
      />
    </div>
  );
}