import {
  BriefcaseBusiness,
  CalendarDays,
  UserCheck,
  Users,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
          <Logo />
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <PageHeader
          title="Dashboard"
          description="Welcome to your DarmiHire workspace."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Open Jobs"
            value={0}
            description="Active job openings"
            icon={BriefcaseBusiness}
          />

          <StatCard
            title="Candidates"
            value={0}
            description="Candidates in your pipeline"
            icon={Users}
          />

          <StatCard
            title="Interviews"
            value={0}
            description="Upcoming interviews"
            icon={CalendarDays}
          />

          <StatCard
            title="Hires"
            value={0}
            description="Successful hires"
            icon={UserCheck}
          />
        </div>
      </main>
    </div>
  );
}