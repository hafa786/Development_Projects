import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

import { BriefcaseBusiness, ClipboardList, Search, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { getTenantId } from "@/utils/session";

import { getApplications } from "@/features/applications/api";

import { applicationQueryKeys } from "@/features/applications/queryKeys";

type ApplicationStatus = "ACTIVE" | "HIRED" | "REJECTED" | "WITHDRAWN";

type ApplicationStage = "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED";

type ApplicationListItem = {
    id: string;

    status: ApplicationStatus;
    stage: ApplicationStage;

    appliedAt: string | null;

    candidate: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };

    job: {
        id: string;
        title: string;
        jobCode?: string | null;
    };
};

type Filter = "ALL" | ApplicationStatus;

const filters: Array<{
    value: Filter;
    label: string;
}> = [
    {
        value: "ALL",
        label: "All",
    },
    {
        value: "ACTIVE",
        label: "Active",
    },
    {
        value: "HIRED",
        label: "Hired",
    },
    {
        value: "REJECTED",
        label: "Rejected",
    },
    {
        value: "WITHDRAWN",
        label: "Withdrawn",
    },
];

export function ApplicationsPage() {
    const navigate = useNavigate();

    const tenantId = getTenantId();

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState<Filter>("ALL");

    const query = useQuery({
        queryKey: applicationQueryKeys.lists(),

        queryFn: () => getApplications(),

        enabled: Boolean(tenantId),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const applications = (query.data ?? []) as unknown as ApplicationListItem[];

    const filtered = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return applications.filter((application) => {
            if (filter !== "ALL" && application.status !== filter) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const candidateName = [
                application.candidate?.firstName,
                application.candidate?.lastName,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const email = application.candidate?.email?.toLowerCase() ?? "";

            const jobTitle = application.job?.title?.toLowerCase() ?? "";

            return (
                candidateName.includes(normalizedSearch) ||
                email.includes(normalizedSearch) ||
                jobTitle.includes(normalizedSearch)
            );
        });
    }, [applications, filter, search]);

    if (!tenantId) {
        return (
            <div className="p-6">
                <div className="rounded-lg border p-8 text-center">
                    <h1 className="font-semibold">No company selected</h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Select a company to view applications.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}

            <div>
                <h1 className="text-3xl font-bold tracking-tight">Applications</h1>

                <p className="mt-1 text-muted-foreground">
                    View and manage all candidate applications.
                </p>
            </div>

            {/* Search + filters */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search candidate, email or job..."
                        className="pl-9"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {filters.map((item) => (
                        <Button
                            key={item.value}
                            size="sm"
                            variant={filter === item.value ? "default" : "outline"}
                            onClick={() => setFilter(item.value)}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Loading */}

            {query.isLoading && (
                <div className="grid gap-4">
                    {Array.from({
                        length: 4,
                    }).map((_, index) => (
                        <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
                    ))}
                </div>
            )}

            {/* Error */}

            {query.isError && (
                <div className="rounded-lg border p-8">
                    <h2 className="font-semibold">Unable to load applications</h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {query.error instanceof Error
                            ? query.error.message
                            : "An unexpected error occurred."}
                    </p>
                </div>
            )}

            {/* Empty */}

            {!query.isLoading && !query.isError && filtered.length === 0 && (
                <div className="rounded-lg border border-dashed p-12 text-center">
                    <ClipboardList className="mx-auto size-10 text-muted-foreground" />

                    <h2 className="mt-4 font-semibold">No applications found</h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {search || filter !== "ALL"
                            ? "Try changing your search or filters."
                            : "Candidate applications will appear here."}
                    </p>
                </div>
            )}

            {/* Applications */}

            {!query.isLoading && !query.isError && (
                <div className="space-y-3">
                    {filtered.map((application) => (
                        <ApplicationCard
                            key={application.id}
                            application={application}
                            onOpen={() => navigate(`/applications/${application.id}`)}
                        />
                    ))}
                </div>
            )}

            {/* Count */}

            {!query.isLoading && !query.isError && (
                <p className="text-sm text-muted-foreground">
                    Showing {filtered.length} of {applications.length} applications
                </p>
            )}
        </div>
    );
}

function ApplicationCard({
    application,
    onOpen,
}: {
    application: ApplicationListItem;
    onOpen: () => void;
}) {
    const candidateName = [application.candidate?.firstName, application.candidate?.lastName]
        .filter(Boolean)
        .join(" ");
    const navigate = useNavigate();

    return (
        <Card className="cursor-pointer transition-colors hover:bg-muted/40" onClick={onOpen}>
            <CardContent className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <UserRound className="size-4 text-muted-foreground" />

                                <h2 className="font-semibold">{candidateName || "Candidate"}</h2>
                            </div>

                            <StatusBadge status={application.status} />

                            <Badge variant="outline">{formatEnum(application.stage)}</Badge>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <BriefcaseBusiness className="size-4" />

                                {application.job?.title ?? "Unknown job"}
                            </span>

                            {application.candidate?.email && (
                                <span>{application.candidate.email}</span>
                            )}

                            {application.appliedAt && (
                                <span>Applied {formatDate(application.appliedAt)}</span>
                            )}
                        </div>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/applications/${application.id}`)}
                    >
                        View details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
    const variant =
        status === "HIRED"
            ? "default"
            : status === "REJECTED" || status === "WITHDRAWN"
              ? "destructive"
              : "secondary";

    return <Badge variant={variant}>{formatEnum(status)}</Badge>;
}

function formatEnum(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}
