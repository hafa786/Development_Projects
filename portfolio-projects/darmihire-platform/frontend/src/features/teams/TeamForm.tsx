import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  teamSchema,
  type TeamFormData,
} from "@/features/teams/schemas";

type TeamFormProps = {
  defaultValues?: TeamFormData;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (data: TeamFormData) => void;
};

const emptyValues: TeamFormData = {
  name: "",
  description: "",
};

export function TeamForm({
  defaultValues = emptyValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
}: TeamFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="team-name">
          Name
        </Label>

        <Input
          id="team-name"
          placeholder="Platform Engineering"
          autoComplete="off"
          disabled={isSubmitting}
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="team-description">
          Description
        </Label>

        <Textarea
          id="team-description"
          placeholder="Responsible for the core platform and infrastructure."
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
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : submitLabel}
        </Button>
      </div>
    </form>
  );
}