import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
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
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from "@/features/departments/api";
import { DeleteDepartmentDialog } from "@/features/departments/DeleteDepartmentDialog";
import { DepartmentDialog } from "@/features/departments/DepartmentDialog";
import { departmentQueryKeys } from "@/features/departments/queryKeys";
import type { DepartmentFormData } from "@/features/departments/schemas";
import type { Department } from "@/features/departments/types";
import { getTenantId } from "@/utils/session";

export default function DepartmentsPage() {
  const queryClient = useQueryClient();

  const tenantId = getTenantId();

  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const departmentsQuery = useQuery({
    queryKey: departmentQueryKeys.list(tenantId!),

    queryFn: getDepartments,

    enabled: Boolean(tenantId),
  });

  const createMutation = useMutation({
    mutationFn: createDepartment,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: departmentQueryKeys.list(tenantId!),
      });

      setDepartmentDialogOpen(false);

      toast.success("Department created.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Unable to create department.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DepartmentFormData }) =>
      updateDepartment(id, {
        name: data.name,

        description: data.description || null,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: departmentQueryKeys.list(tenantId!),
      });

      setDepartmentDialogOpen(false);

      setSelectedDepartment(null);

      toast.success("Department updated.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Unable to update department.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: departmentQueryKeys.list(tenantId!),
      });

      setDeleteDialogOpen(false);

      setSelectedDepartment(null);

      toast.success("Department deleted.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Unable to delete department.");
    },
  });

  function openCreateDialog() {
    setSelectedDepartment(null);

    setDepartmentDialogOpen(true);
  }

  function openEditDialog(department: Department) {
    setSelectedDepartment(department);

    setDepartmentDialogOpen(true);
  }

  function openDeleteDialog(department: Department) {
    setSelectedDepartment(department);

    setDeleteDialogOpen(true);
  }

  function handleDepartmentSubmit(data: DepartmentFormData) {
    if (selectedDepartment) {
      updateMutation.mutate({
        id: selectedDepartment.id,

        data,
      });

      return;
    }

    createMutation.mutate({
      name: data.name,

      description: data.description || null,
    });
  }

  function handleDelete() {
    if (!selectedDepartment) {
      return;
    }

    deleteMutation.mutate(selectedDepartment.id);
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <PageHeader
          title="Departments"
          description="Organize your company structure for hiring."
          actions={
            <Button type="button" onClick={openCreateDialog}>
              <Plus />
              Add department
            </Button>
          }
        />

        {departmentsQuery.isLoading && <DepartmentTableSkeleton />}

        {departmentsQuery.isError && (
          <div className="rounded-xl border bg-background p-8 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <Building2 className="size-5 text-destructive" />
            </div>

            <h2 className="mt-4 font-semibold">Unable to load departments</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Something went wrong while loading your departments.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => departmentsQuery.refetch()}
            >
              <RefreshCw />
              Try again
            </Button>
          </div>
        )}

        {departmentsQuery.isSuccess && departmentsQuery.data.length === 0 && (
          <EmptyState
            icon={Building2}
            title="No departments yet"
            description="Create departments such as Engineering, Sales, Marketing, or Operations."
          />
        )}

        {departmentsQuery.isSuccess && departmentsQuery.data.length > 0 && (
          <div className="overflow-hidden rounded-xl border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>

                  <TableHead>Description</TableHead>

                  <TableHead className="w-16">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {departmentsQuery.data.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Building2 className="size-4" />
                        </div>

                        <span className="font-medium">{department.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="max-w-md text-muted-foreground">
                      {department.description || "—"}
                    </TableCell>

                    <TableCell className="text-right">
                      <DepartmentActions
                        department={department}
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

      <DepartmentDialog
        open={departmentDialogOpen}
        department={selectedDepartment}
        isSubmitting={isSaving}
        onOpenChange={(open) => {
          setDepartmentDialogOpen(open);

          if (!open) {
            setSelectedDepartment(null);
          }
        }}
        onSubmit={handleDepartmentSubmit}
      />

      <DeleteDepartmentDialog
        open={deleteDialogOpen}
        department={selectedDepartment}
        isDeleting={deleteMutation.isPending}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);

          if (!open) {
            setSelectedDepartment(null);
          }
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}

type DepartmentActionsProps = {
  department: Department;

  onEdit: (department: Department) => void;

  onDelete: (department: Department) => void;
};

function DepartmentActions({
  department,
  onEdit,
  onDelete,
}: DepartmentActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Actions for ${department.name}`}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onSelect={() => onEdit(department)} onClick={() => onEdit(department)}>
          <Pencil />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          variant="destructive"
          onSelect={() => onDelete(department)}
          onClick={() => onDelete(department)}
        >
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DepartmentTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="space-y-1 p-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
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
