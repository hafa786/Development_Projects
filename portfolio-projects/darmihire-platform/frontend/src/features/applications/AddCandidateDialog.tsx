import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Mail,
  MapPin,
  Search,
  UserPlus,
} from "lucide-react";

import { getCandidates } from "@/features/candidates/api";
import { candidateQueryKeys } from "@/features/candidates/queryKeys";
import { getTenantId } from "@/utils/session";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { JobApplication } from "./types";

type AddCandidateDialogProps = {
  open: boolean;
  applications: JobApplication[];
  submitting?: boolean;

  onOpenChange: (open: boolean) => void;
  onAdd: (candidateId: string) => void;
};

export function AddCandidateDialog({
  open,
  applications,
  submitting = false,
  onOpenChange,
  onAdd,
}: AddCandidateDialogProps) {
  const tenantId = getTenantId();

  const [search, setSearch] = useState("");

  const candidatesQuery = useQuery({
    queryKey: candidateQueryKeys.list(tenantId),
    queryFn: getCandidates,
    enabled: open && Boolean(tenantId),
  });

  const candidates = candidatesQuery.data ?? [];

  const existingCandidateIds = useMemo(
    () =>
      new Set(
        applications.map(
          (application) =>
            application.candidateId,
        ),
      ),
    [applications],
  );

  const availableCandidates = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return candidates.filter((candidate) => {
      if (
        existingCandidateIds.has(candidate.id)
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        candidate.fullName
          .toLowerCase()
          .includes(query) ||
        candidate.email
          .toLowerCase()
          .includes(query) ||
        candidate.location
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [
    candidates,
    existingCandidateIds,
    search,
  ]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);

        if (!nextOpen) {
          setSearch("");
        }
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Add candidate to job
          </DialogTitle>

          <DialogDescription>
            Select a candidate from your talent
            database to add to this hiring
            pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search candidates..."
            className="pl-9"
          />
        </div>

        <div className="max-h-[420px] space-y-2 overflow-y-auto">
          {candidatesQuery.isLoading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading candidates...
            </div>
          ) : availableCandidates.length ===
            0 ? (
            <div className="py-10 text-center">
              <UserPlus className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 font-medium">
                No candidates available
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Candidates already in this
                pipeline are hidden.
              </p>
            </div>
          ) : (
            availableCandidates.map(
              (candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  disabled={submitting}
                  onClick={() =>
                    onAdd(candidate.id)
                  }
                  className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted disabled:opacity-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {candidate.firstName
                      .charAt(0)
                      .toUpperCase()}
                    {candidate.lastName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {candidate.fullName}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {candidate.email}
                      </span>

                      {candidate.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {
                            candidate.location
                          }
                        </span>
                      )}
                    </div>
                  </div>

                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </button>
              ),
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}