import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createLocation,
  deleteLocation,
  getLocations,
  updateLocation,
} from "@/features/locations/api";
import { DeleteLocationDialog } from "@/features/locations/DeleteLocationDialog";
import { LocationDialog } from "@/features/locations/LocationDialog";
import { locationQueryKeys } from "@/features/locations/queryKeys";
import type { LocationFormData } from "@/features/locations/schemas";
import type { Location } from "@/features/locations/types";
import { getTenantId } from "@/utils/session";

export default function LocationsPage() {
  const queryClient = useQueryClient();

  const tenantId = getTenantId();

  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const locationsQuery = useQuery({
    queryKey: locationQueryKeys.list(tenantId!),
    queryFn: getLocations,
    enabled: Boolean(tenantId),
  });

  const createMutation = useMutation({
    mutationFn: createLocation,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: locationQueryKeys.list(tenantId!),
      });

      setLocationDialogOpen(false);

      toast.success("Location created.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Unable to create location.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LocationFormData }) =>
      updateLocation(id, {
        name: data.name,
        timezone: data.timezone || null,
        city: data.city,
        country: data.country,
        remote: false,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: locationQueryKeys.list(tenantId!),
      });

      setLocationDialogOpen(false);
      setSelectedLocation(null);

      toast.success("Location updated.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Unable to update location.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLocation,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: locationQueryKeys.list(tenantId!),
      });

      setDeleteDialogOpen(false);
      setSelectedLocation(null);

      toast.success("Location deleted.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Unable to delete location.");
    },
  });

  function openCreateDialog() {
    setSelectedLocation(null);
    setLocationDialogOpen(true);
  }

  function openEditDialog(location: Location) {
    setSelectedLocation(location);
    setLocationDialogOpen(true);
  }

  function openDeleteDialog(location: Location) {
    setSelectedLocation(location);
    setDeleteDialogOpen(true);
  }

  function handleLocationSubmit(data: LocationFormData) {
    if (selectedLocation) {
      updateMutation.mutate({
        id: selectedLocation.id,
        data,
      });

      return;
    }

    createMutation.mutate({
      name: data.name,
      city: data.city || null,
      country: data.country || null,
      timezone: data.timezone || null,
      remote: data.remote,
    });
  }

  function handleDelete() {
    if (!selectedLocation) {
      return;
    }
    deleteMutation.mutate(selectedLocation.id);
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <PageHeader
          title="Locations"
          description="Manage the locations used across your hiring workspace."
          actions={
            <Button type="button" onClick={openCreateDialog}>
              <Plus />
              Add location
            </Button>
          }
        />

        {locationsQuery.isLoading && <LocationTableSkeleton />}

        {locationsQuery.isError && (
          <div className="rounded-xl border bg-background p-8 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <MapPin className="size-5 text-destructive" />
            </div>

            <h2 className="mt-4 font-semibold">Unable to load locations</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Something went wrong while loading your locations.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => locationsQuery.refetch()}
            >
              <RefreshCw />
              Try again
            </Button>
          </div>
        )}

        {locationsQuery.isSuccess && locationsQuery.data.length === 0 && (
          <EmptyState
            icon={MapPin}
            title="No locations yet"
            description="Create locations such as Helsinki Office, Tampere Office, or Remote."
          />
        )}

        {locationsQuery.isSuccess && locationsQuery.data.length > 0 && (
          <div className="overflow-hidden rounded-xl border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Country</TableHead>

                  <TableHead className="w-16">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {locationsQuery.data.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <MapPin className="size-4" />
                        </div>

                        <span className="font-medium">{location.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {location.address || "—"}
                    </TableCell>

                    <TableCell>{location.city}</TableCell>

                    <TableCell>{location.country}</TableCell>

                    <TableCell className="text-right">
                      <LocationActions
                        location={location}
                        onEdit={openEditDialog}
                        onDelete={openDeleteDialog}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <LocationDialog
        open={locationDialogOpen}
        location={selectedLocation}
        isSubmitting={isSaving}
        onOpenChange={(open) => {
          setLocationDialogOpen(open);

          if (!open) {
            setSelectedLocation(null);
          }
        }}
        onSubmit={handleLocationSubmit}
      />

      <DeleteLocationDialog
        open={deleteDialogOpen}
        location={selectedLocation}
        isDeleting={deleteMutation.isPending}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);

          if (!open) {
            setSelectedLocation(null);
          }
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}

type LocationActionsProps = {
  location: Location;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
};

function LocationActions({ location, onEdit, onDelete }: LocationActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Actions for ${location.name}`}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onSelect={() => onEdit(location)}  onClick={() =>onEdit(location)}>
          <Pencil />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          variant="destructive"
          onSelect={() => onDelete(location)}
          onClick={() => onDelete(location)}
        >
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LocationTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="space-y-1 p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b py-4 last:border-b-0"
          >
            <Skeleton className="size-9 rounded-lg" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-72 max-w-full" />
            </div>

            <Skeleton className="size-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
