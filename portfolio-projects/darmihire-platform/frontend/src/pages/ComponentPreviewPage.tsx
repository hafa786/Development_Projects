import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  Users,
} from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Logo } from "@/components/common/Logo";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ComponentPreviewPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
          <Logo />
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 p-6">
        <PageHeader
          title="DarmiHire UI"
          description="Phase 1 component preview"
          actions={
            <Button>
              Primary action
            </Button>
          }
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Open Jobs"
            value={0}
            description="Active job openings"
            icon={BriefcaseBusiness}
          />

          <StatCard
            title="Candidates"
            value={0}
            description="Total candidates"
            icon={Users}
          />

          <StatCard
            title="Departments"
            value={2}
            description="Organization departments"
            icon={Building2}
          />

          <StatCard
            title="Locations"
            value={1}
            description="Hiring locations"
            icon={MapPin}
          />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Status badges</CardTitle>

            <CardDescription>
              Examples used throughout DarmiHire.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-2">
            <StatusBadge status="ACTIVE" />
            <StatusBadge status="INVITED" />
            <StatusBadge status="COMPANY_ADMIN" />
            <StatusBadge status="HIRING_MANAGER" />
          </CardContent>
        </Card>

        <EmptyState
          icon={Building2}
          title="No departments yet"
          description="Create your first department to organize your hiring teams."
          action={
            <Button>
              Add department
            </Button>
          }
        />
      </main>
    </div>
  );
}