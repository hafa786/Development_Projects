import {
  MapPin,
  Plus,
} from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";

export default function LocationsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Locations"
        description="Manage office, remote, and hiring locations."
        actions={
          <Button disabled>
            <Plus />
            Add location
          </Button>
        }
      />

      <EmptyState
        icon={MapPin}
        title="No locations yet"
        description="Add locations that can later be associated with job openings."
      />
    </div>
  );
}