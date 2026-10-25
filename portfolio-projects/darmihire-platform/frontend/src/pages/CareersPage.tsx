import { AlertCircle, BriefcaseBusiness, RefreshCw } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { getPublicCareer, getPublicJobs } from "../features/careers/api";

import { CareersHeader } from "../features/careers/components/CareersHeader";
import { CareersHero } from "../features/careers/components/CareersHero";
import { PublicJobCard } from "../features/careers/components/PublicJobCard";

import { careersQueryKeys } from "../features/careers/queryKeys";

export default function CareersPage() {
    const { companySlug } = useParams<{
        companySlug: string;
    }>();

    const slug = companySlug ?? "";

    const careerQuery = useQuery({
        queryKey: careersQueryKeys.career(slug),

        queryFn: () => getPublicCareer(slug),

        enabled: Boolean(slug),

        retry: false,
    });

    const jobsQuery = useQuery({
        queryKey: careersQueryKeys.jobs(slug),

        queryFn: () => getPublicJobs(slug),

        enabled: Boolean(slug) && careerQuery.isSuccess,

        retry: false,
    });

    /*
     * ---------------------------------------------------------
     * LOADING
     * ---------------------------------------------------------
     */

    if (careerQuery.isLoading || (careerQuery.isSuccess && jobsQuery.isLoading)) {
        return <CareersPageSkeleton />;
    }

    /*
     * ---------------------------------------------------------
     * ERROR / NOT FOUND
     * ---------------------------------------------------------
     */

    if (careerQuery.isError || !careerQuery.data) {
        return <CareersErrorState onRetry={() => void careerQuery.refetch()} />;
    }

    if (jobsQuery.isError) {
        return (
            <div className="min-h-screen bg-background">
                <CareersHeader companyName={careerQuery.data.name} />

                <main className="mx-auto flex max-w-7xl flex-1 items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
                    <div className="max-w-md text-center">
                        <AlertCircle className="mx-auto size-10 text-muted-foreground" />

                        <h1 className="mt-5 text-2xl font-semibold">Unable to load jobs</h1>

                        <p className="mt-2 text-muted-foreground">
                            We couldn't load the open positions right now.
                        </p>

                        <Button
                            className="mt-6 gap-2"
                            variant="outline"
                            onClick={() => void jobsQuery.refetch()}
                        >
                            <RefreshCw className="size-4" />
                            Try again
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    const career = careerQuery.data;

    const jobs = jobsQuery.data ?? [];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <CareersHeader companyName={career.name} />

            <main>
                <CareersHero companyName={career.name} jobCount={jobs.length} />

                <section id="open-positions" className="scroll-mt-20">
                    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                                Opportunities
                            </p>

                            <h2 className="mt-2 text-3xl font-bold tracking-tight">
                                Open positions
                            </h2>

                            <p className="mt-3 max-w-2xl text-muted-foreground">
                                Explore current opportunities at {career.name}.
                            </p>
                        </div>

                        {jobs.length === 0 ? (
                            <EmptyJobsState />
                        ) : (
                            <div className="mt-10 space-y-4">
                                {jobs.map((job) => (
                                    <PublicJobCard
                                        key={job.slug}
                                        companySlug={career.slug}
                                        job={job}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <footer className="border-t">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
                    <p>{career.name} careers</p>

                    <p>
                        Powered by{" "}
                        <span className="font-medium text-foreground">
                            Darmi
                            <span className="text-emerald-600">Hire</span>
                        </span>
                    </p>
                </div>
            </footer>
        </div>
    );
}

function EmptyJobsState() {
    return (
        <div className="mt-10 rounded-2xl border border-dashed px-6 py-16 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted">
                <BriefcaseBusiness className="size-6 text-muted-foreground" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">No open positions right now</h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                There aren't any published opportunities at the moment. Please check back later.
            </p>
        </div>
    );
}

function CareersErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="max-w-md text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted">
                    <AlertCircle className="size-6 text-muted-foreground" />
                </div>

                <h1 className="mt-5 text-2xl font-semibold">Careers page unavailable</h1>

                <p className="mt-2 leading-6 text-muted-foreground">
                    This careers page doesn't exist or is currently unavailable.
                </p>

                <Button variant="outline" className="mt-6 gap-2" onClick={onRetry}>
                    <RefreshCw className="size-4" />
                    Try again
                </Button>
            </div>
        </div>
    );
}

function CareersPageSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                    <Skeleton className="h-9 w-48" />
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center">
                    <Skeleton className="size-14 rounded-2xl" />
                    <Skeleton className="mt-6 h-4 w-40" />
                    <Skeleton className="mt-4 h-12 w-full max-w-xl" />
                    <Skeleton className="mt-5 h-6 w-full max-w-lg" />
                    <Skeleton className="mt-8 h-11 w-44" />
                </div>

                <div className="mt-24">
                    <Skeleton className="h-8 w-52" />

                    <div className="mt-8 space-y-4">
                        {[1, 2, 3].map((item) => (
                            <Skeleton key={item} className="h-40 w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
