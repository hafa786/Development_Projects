import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  departmentSchema,
  type DepartmentFormData,
} from "@/features/departments/schemas";

type DepartmentFormProps = {
  defaultValues?: DepartmentFormData;

  submitLabel: string;

  isSubmitting?: boolean;

  onSubmit: (data: DepartmentFormData) => void;
};

const emptyValues: DepartmentFormData = {
  name: "",
  description: "",
};

export function DepartmentForm({
  defaultValues = emptyValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
}: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),

    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="department-name">Name</Label>

        <Input
          id="department-name"
          placeholder="Engineering"
          autoComplete="off"
          disabled={isSubmitting}
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="department-description">Description</Label>

        <Textarea
          id="department-description"
          placeholder="Product engineering and software development."
          rows={4}
          disabled={isSubmitting}
          {...register("description")}
        />

        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
