import {
  ArrowDown,
  BriefcaseBusiness,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type CareersHeroProps = {
  companyName: string;
  jobCount: number;
};

export function CareersHero({
  companyName,
  jobCount,
}: CareersHeroProps) {
  function scrollToJobs() {
    document
      .getElementById("open-positions")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-emerald-50/80 via-background to-background">
      <div className="absolute left-1/2 top-0 -z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <BriefcaseBusiness className="size-7" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Careers at {companyName}
        </p>

        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Find your next opportunity
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Explore our open positions and find a
          role where you can make an impact.
        </p>

        <div className="mt-8">
          <Button
            size="lg"
            onClick={scrollToJobs}
            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            View open positions

            <ArrowDown className="size-4" />
          </Button>
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          {jobCount === 1
            ? "1 open position"
            : `${jobCount} open positions`}
        </p>
      </div>
    </section>
  );
}