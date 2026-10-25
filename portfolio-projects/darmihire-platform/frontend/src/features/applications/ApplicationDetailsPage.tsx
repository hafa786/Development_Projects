import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, Mail, MapPin, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTenantId } from "@/utils/session";

import { ApplicationInterviews } from "@/features/interviews/ApplicationInterviews";
import { ApplicationEvaluationSummary } from "@/features/evaluations/ApplicationEvaluationSummary";
import { ApplicationOffers } from "@/features/offers/ApplicationOffers";

import { getApplication, getApplicationActivities } from "./api";

import { applicationQueryKeys } from "./queryKeys";

/*
 * If your existing Application type already lives in
 * ./types.ts, remove this local type and import it:
 *
 * import type { Application } from "./types";
 */
type Application = {
    id: string;

    status: "ACTIVE" | "HIRED" | "REJECTED" | "WITHDRAWN";

    stage: "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED";

    appliedAt: string | null;
    hiredAt?: string | null;

    candidate: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string | null;
        location?: string | null;
    };

    job: {
        id: string;
        title: string;
        jobCode?: string | null;
    };
};

export function ApplicationDetailsPage() {
    const { applicationId } = useParams<{
        applicationId: string;
    }>();

    const tenantId = getTenantId();

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const applicationQuery = useQuery({
        queryKey: applicationQueryKeys.detail(tenantId, applicationId ?? ""),

        queryFn: () => getApplication(applicationId!),

        enabled: Boolean(tenantId) && Boolean(applicationId),
    });

    /*
     * Activity query is optional for this page.
     *
     * If your existing activity component already fetches
     * activities internally, you can remove this query.
     */
    const activitiesQuery = useQuery({
        queryKey: applicationQueryKeys.activities(tenantId, applicationId ?? ""),

        queryFn: () => getApplicationActivities(applicationId!),

        enabled: Boolean(tenantId) && Boolean(applicationId),
    });

    if (!applicationId) {
        return (
            <PageMessage
                title="Application not found"
                description="No application ID was provided."
                onBack={() => navigate("/applications")}
            />
        );
    }

    if (!tenantId) {
        return (
            <PageMessage
                title="No tenant selected"
                description="Select a company before opening an application."
                onBack={() => navigate("/applications")}
            />
        );
    }

    if (applicationQuery.isLoading) {
        return (
            <div className="space-y-6 p-6">
                <ApplicationHeaderSkeleton />

                <div className="h-40 animate-pulse rounded-xl bg-muted" />

                <div className="h-72 animate-pulse rounded-xl bg-muted" />

                <div className="h-72 animate-pulse rounded-xl bg-muted" />
            </div>
        );
    }

    if (applicationQuery.isError || !applicationQuery.data) {
        return (
            <PageMessage
                title="Unable to load application"
                description={
                    applicationQuery.error instanceof Error
                        ? applicationQuery.error.message
                        : "The application could not be loaded."
                }
                onBack={() => navigate("/applications")}
            />
        );
    }

    const application = applicationQuery.data as Application;

    const candidateName = [application.candidate?.firstName, application.candidate?.lastName]
        .filter(Boolean)
        .join(" ");

    /*
     * Replace this with your existing authenticated
     * role/permission helper if you have one.
     *
     * Keeping the backend permission checks is mandatory.
     */
    const canManageOffers = true;
    const canApproveOffers = true;

    const refreshApplication = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: applicationQueryKeys.detail(tenantId, applicationId),
            }),

            queryClient.invalidateQueries({
                queryKey: applicationQueryKeys.activities(tenantId, applicationId),
            }),
        ]);
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
            {/* ============================= */}
            {/* Back navigation               */}
            {/* ============================= */}

            <Button variant="ghost" className="-ml-3" onClick={() => navigate("/applications")}>
                <ArrowLeft className="mr-2 size-4" />
                Applications
            </Button>

            {/* ============================= */}
            {/* Application header            */}
            {/* ============================= */}

            <section className="flex flex-col gap-5 border-b pb-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {candidateName || "Candidate"}
                        </h1>

                        <ApplicationStatusBadge status={application.status} />

                        <ApplicationStageBadge stage={application.stage} />
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <BriefcaseBusiness className="size-4" />

                            {application.job?.title}
                        </span>

                        {application.job?.jobCode && <span>Job #{application.job.jobCode}</span>}

                        {application.appliedAt && (
                            <span className="flex items-center gap-2">
                                <CalendarDays className="size-4" />
                                Applied {formatDateTime(application.appliedAt)}
                            </span>
                        )}
                    </div>
                </div>

                {application.status === "HIRED" && (
                    <div className="rounded-lg border bg-muted/40 px-5 py-3">
                        <p className="text-sm font-semibold">Candidate hired</p>

                        {application.hiredAt && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                {formatDateTime(application.hiredAt)}
                            </p>
                        )}
                    </div>
                )}
            </section>

            {/* ============================= */}
            {/* Candidate / job overview      */}
            {/* ============================= */}

            <div className="grid gap-6 lg:grid-cols-2">
                <CandidateCard application={application} />

                <JobCard application={application} />
            </div>

            {/* ============================= */}
            {/* Interviews                    */}
            {/* ============================= */}

            <PageSection
                title="Interviews"
                description="Scheduled and completed interviews for this application."
            >
                <ApplicationInterviews tenantId={tenantId} applicationId={applicationId} />
            </PageSection>

            {/* ============================= */}
            {/* Evaluations                   */}
            {/* ============================= */}

            <PageSection
                title="Evaluation"
                description="Structured interviewer feedback and hiring evaluation."
            >
                <ApplicationEvaluationSummary tenantId={tenantId} applicationId={applicationId} />
            </PageSection>

            {/* ============================= */}
            {/* OFFERS — Step 20.7            */}
            {/* ============================= */}

            <PageSection
                title="Offers"
                description="Manage compensation, approval and hiring decisions."
            >
                <ApplicationOffers
                    tenantId={tenantId}
                    applicationId={applicationId}
                    applicationStatus={application.status}
                    canManage={canManageOffers}
                    canApprove={canApproveOffers}
                    onApplicationChanged={refreshApplication}
                />
            </PageSection>

            {/* ============================= */}
            {/* Application activity          */}
            {/* ============================= */}

            <PageSection
                title="Activity"
                description="Application history and recruitment activity."
            >
                {activitiesQuery.isLoading && (
                    <p className="text-sm text-muted-foreground">Loading activity...</p>
                )}

                {activitiesQuery.isError && (
                    <p className="text-sm text-destructive">Unable to load application activity.</p>
                )}

                {activitiesQuery.data && <ActivityTimeline activities={activitiesQuery.data} />}
            </PageSection>
        </div>
    );
}

/*
 * ==================================================
 * CANDIDATE CARD
 * ==================================================
 */

function CandidateCard({ application }: { application: Application }) {
    const candidate = application.candidate;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <UserRound className="size-5" />
                    Candidate
                </CardTitle>
            </CardHeader>

            {JSON.stringify(candidate)}
            <CardContent className="space-y-4">
                <InfoRow
                    label="Name"
                    value={
                        [candidate?.firstName, candidate?.lastName].filter(Boolean).join(" ") || "—"
                    }
                />

                <InfoRow
                    label="Email"
                    value={candidate?.email || "—"}
                    icon={<Mail className="size-4" />}
                />

                <InfoRow label="Phone" value={candidate?.phone || "—"} />

                <InfoRow
                    label="Location"
                    value={candidate?.location || "—"}
                    icon={<MapPin className="size-4" />}
                />
            </CardContent>
        </Card>
    );
}

/*
 * ==================================================
 * JOB CARD
 * ==================================================
 */

function JobCard({ application }: { application: Application }) {
    const job = application.job;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <BriefcaseBusiness className="size-5" />
                    Job
                </CardTitle>
            </CardHeader>
            {JSON.stringify(job)}
            <CardContent className="space-y-4">
                <InfoRow label="Position" value={job?.title || "—"} />

                <InfoRow label="Job code" value={job?.jobCode || "—"} />

                <InfoRow label="Application stage" value={formatEnum(application?.stage)} />

                <InfoRow label="Application status" value={formatEnum(application?.status)} />
            </CardContent>
        </Card>
    );
}

/*
 * ==================================================
 * ACTIVITY TIMELINE
 * ==================================================
 *
 * Kept deliberately tolerant because your existing
 * activity DTO may use slightly different property
 * names.
 */

type Activity = {
    id: string;

    type?: string;

    activityType?: string;

    description?: string | null;

    createdAt?: string;

    occurredAt?: string;
};

function ActivityTimeline({ activities }: { activities: Activity[] }) {
    if (!activities || activities.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">No application activity yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-0">
            {activities.map((activity, index) => {
                const type = activity.type ?? activity.activityType ?? "ACTIVITY";

                const date = activity.occurredAt ?? activity.createdAt ?? null;

                return (
                    <div key={activity.id} className="relative flex gap-4 pb-6">
                        {index !== activities.length - 1 && (
                            <div className="absolute left-[7px] top-5 h-full w-px bg-border" />
                        )}

                        <div className="relative mt-1.5 size-4 shrink-0 rounded-full border-2 border-primary bg-background" />

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{formatEnum(type)}</p>

                            {activity.description && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {activity.description}
                                </p>
                            )}

                            {date && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {formatDateTime(date)}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/*
 * ==================================================
 * STATUS
 * ==================================================
 */

function ApplicationStatusBadge({ status }: { status: Application["status"] }) {
    const variant =
        status === "HIRED"
            ? "default"
            : status === "REJECTED" || status === "WITHDRAWN"
              ? "destructive"
              : "secondary";

    return <Badge variant={variant}>{formatEnum(status)}</Badge>;
}

function ApplicationStageBadge({ stage }: { stage: Application["stage"] }) {
    return <Badge variant="outline">{formatEnum(stage)}</Badge>;
}

/*
 * ==================================================
 * GENERIC UI
 * ==================================================
 */

function PageSection({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-4 border-t pt-8">
            <div>
                <h2 className="text-xl font-semibold tracking-tight">{title}</h2>

                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>

            {children}
        </section>
    );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-6">
            <span className="text-sm text-muted-foreground">{label}</span>

            <span className="flex items-center gap-2 text-right text-sm font-medium">
                {icon}

                {value}
            </span>
        </div>
    );
}

function PageMessage({
    title,
    description,
    onBack,
}: {
    title: string;
    description: string;
    onBack: () => void;
}) {
    return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
            <div className="max-w-md text-center">
                <h1 className="text-xl font-semibold">{title}</h1>

                <p className="mt-2 text-sm text-muted-foreground">{description}</p>

                <Button className="mt-6" variant="outline" onClick={onBack}>
                    <ArrowLeft className="mr-2 size-4" />
                    Back to applications
                </Button>
            </div>
        </div>
    );
}

function ApplicationHeaderSkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-9 w-64 animate-pulse rounded bg-muted" />

            <div className="h-5 w-96 max-w-full animate-pulse rounded bg-muted" />
        </div>
    );
}

function formatDateTime(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function formatEnum(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}
