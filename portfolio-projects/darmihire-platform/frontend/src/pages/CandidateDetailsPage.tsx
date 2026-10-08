import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import { getCandidate } from "@/features/candidates/api";
import { candidateQueryKeys } from "@/features/candidates/queryKeys";
import { getTenantId } from "@/utils/session";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CandidateDetailsPage() {
  const navigate = useNavigate();

  const { candidateId } =
    useParams<{ candidateId: string }>();

  const tenantId = getTenantId();

  const candidateQuery = useQuery({
    queryKey: candidateQueryKeys.detail(
      tenantId,
      candidateId ?? "",
    ),

    queryFn: () =>
      getCandidate(candidateId!),

    enabled:
      Boolean(tenantId) &&
      Boolean(candidateId),
  });

  const candidate = candidateQuery.data;

  if (candidateQuery.isLoading) {
    return (
      <div className="p-8 text-sm text-muted-foreground">
        Loading candidate...
      </div>
    );
  }

  if (
    candidateQuery.isError ||
    !candidate
  ) {
    return (
      <div className="space-y-5 p-8">
        <Button
          variant="ghost"
          onClick={() =>
            navigate("/candidates")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to candidates
        </Button>

        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-lg font-semibold">
              Candidate not found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              The candidate could not be
              loaded.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials =
    `${candidate.firstName.charAt(0)}${candidate.lastName.charAt(0)}`
      .toUpperCase();

  return (
    <div className="space-y-7 p-8">
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() =>
          navigate("/candidates")
        }
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to candidates
      </Button>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
            {initials}
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {candidate.fullName}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {candidate.email}
              </span>

              {candidate.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {candidate.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <Badge variant="outline">
          {candidate.source
            .replaceAll("_", " ")
            .toLowerCase()}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Candidate overview
              </CardTitle>
            </CardHeader>

            <CardContent>
              {candidate.notes ? (
                <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                  {candidate.notes}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No candidate notes have
                  been added.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Applications
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <FileText className="mb-3 h-8 w-8 text-muted-foreground" />

                <p className="font-medium">
                  No applications yet
                </p>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Candidate applications will
                  appear here after the job
                  application pipeline is
                  implemented.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Contact information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <InfoRow
                icon={Mail}
                label="Email"
                value={candidate.email}
              />

              <InfoRow
                icon={Phone}
                label="Phone"
                value={candidate.phone}
              />

              <InfoRow
                icon={MapPin}
                label="Location"
                value={candidate.location}
              />

              <InfoRow
                icon={UserRound}
                label="Source"
                value={candidate.source.replaceAll(
                  "_",
                  " ",
                )}
              />
            </CardContent>
          </Card>

          {(candidate.linkedinUrl ||
            candidate.portfolioUrl) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Online profiles
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {candidate.linkedinUrl && (
                  <a
                    href={
                      candidate.linkedinUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted"
                  >
                    LinkedIn

                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {candidate.portfolioUrl && (
                  <a
                    href={
                      candidate.portfolioUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted"
                  >
                    Portfolio

                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
            </CardHeader>

            <CardContent>
              {candidate.resumeUrl ? (
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted"
                >
                  <FileText className="h-5 w-5" />

                  <span className="min-w-0 flex-1 truncate text-sm">
                    {candidate.resumeFileName ??
                      "View resume"}
                  </span>

                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No resume uploaded yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 break-words text-sm font-medium">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}