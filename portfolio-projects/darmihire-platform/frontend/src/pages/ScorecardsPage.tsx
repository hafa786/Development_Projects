import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import {
  ClipboardCheck,
  Search,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import { getScorecardTemplates } from "../features/scorecards/api";
import { CreateScorecardDialog } from "../features/scorecards/CreateScorecardDialog";
import { scorecardQueryKeys } from "../features/scorecards/queryKeys";
import { ScorecardTemplateCard } from "../features/scorecards/ScorecardTemplateCard";
import { ScorecardTemplateDetails } from "../features/scorecards/ScorecardTemplateDetails";

const TENANT_STORAGE_KEY =
  "darmihire_tenant_id";

export function ScorecardsPage() {
  const tenantId =
    sessionStorage.getItem(
      TENANT_STORAGE_KEY,
    );

  const [search, setSearch] =
    useState("");

  const [
    selectedTemplateId,
    setSelectedTemplateId,
  ] = useState<string | null>(
    null,
  );

  const query = useQuery({
    queryKey:
      scorecardQueryKeys.list(
        tenantId,
      ),

    queryFn:
      getScorecardTemplates,

    enabled: Boolean(tenantId),
  });

  const templates =
    query.data ?? [];

  const filteredTemplates =
    useMemo(() => {
      const normalized =
        search
          .trim()
          .toLowerCase();

      if (!normalized) {
        return templates;
      }

      return templates.filter(
        (template) =>
          template.name
            .toLowerCase()
            .includes(normalized) ||
          (
            template.description ??
            ""
          )
            .toLowerCase()
            .includes(normalized),
      );
    }, [templates, search]);

  const selectedTemplate =
    templates.find(
      (template) =>
        template.id ===
        selectedTemplateId,
    ) ?? null;

  if (!tenantId) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Select a workspace to manage
          scorecards.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6" />

            <h1 className="text-2xl font-semibold tracking-tight">
              Interview Scorecards
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Create reusable evaluation
            templates for structured
            interviews.
          </p>
        </div>

        <CreateScorecardDialog
          tenantId={tenantId}
        />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value,
            )
          }
          placeholder="Search scorecards..."
          className="pl-9"
        />
      </div>

      {query.isLoading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading scorecards...
        </div>
      ) : query.isError ? (
        <div className="rounded-lg border border-destructive/30 p-6">
          <p className="font-medium">
            Unable to load scorecards
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {query.error instanceof Error
              ? query.error.message
              : "An unexpected error occurred."}
          </p>
        </div>
      ) : templates.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <ClipboardCheck className="mx-auto h-10 w-10 text-muted-foreground" />

          <h2 className="mt-4 font-semibold">
            No scorecards yet
          </h2>

          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Create your first interview
            scorecard and add the criteria
            your interviewers should
            evaluate.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-3">
            {filteredTemplates.length ===
            0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No scorecards match your
                search.
              </div>
            ) : (
              filteredTemplates.map(
                (template) => (
                  <ScorecardTemplateCard
                    key={template.id}
                    template={template}
                    selected={
                      selectedTemplateId ===
                      template.id
                    }
                    onSelect={() =>
                      setSelectedTemplateId(
                        template.id,
                      )
                    }
                  />
                ),
              )
            )}
          </div>

          <div>
            {selectedTemplate ? (
              <ScorecardTemplateDetails
                tenantId={tenantId}
                template={
                  selectedTemplate
                }
              />
            ) : (
              <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <div>
                  <ClipboardCheck className="mx-auto h-9 w-9 text-muted-foreground" />

                  <p className="mt-3 font-medium">
                    Select a scorecard
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose a scorecard on
                    the left to manage its
                    evaluation criteria.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}