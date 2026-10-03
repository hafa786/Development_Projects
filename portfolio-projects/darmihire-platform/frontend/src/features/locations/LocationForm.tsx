import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  locationSchema,
  type LocationFormData,
} from "@/features/locations/schemas";

type LocationFormProps = {
  defaultValues?: LocationFormData;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (data: LocationFormData) => void;
};

const emptyValues: LocationFormData = {
  name: "",
  city: "",
  country: "",
  timezone: "",
  remote: false,
};

export function LocationForm({
  defaultValues = emptyValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
}: LocationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const remote = watch("remote");

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="location-name">
          Location name
        </Label>

        <Input
          id="location-name"
          placeholder="Helsinki Office"
          disabled={isSubmitting}
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location-city">
            City
          </Label>

          <Input
            id="location-city"
            placeholder="Helsinki"
            disabled={isSubmitting}
            {...register("city")}
          />

          {errors.city && (
            <p className="text-sm text-destructive">
              {errors.city.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location-country">
            Country
          </Label>

          <Input
            id="location-country"
            placeholder="Finland"
            disabled={isSubmitting}
            {...register("country")}
          />

          {errors.country && (
            <p className="text-sm text-destructive">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location-timezone">
          Timezone
        </Label>

        <Input
          id="location-timezone"
          placeholder="Europe/Helsinki"
          disabled={isSubmitting}
          {...register("timezone")}
        />

        {errors.timezone && (
          <p className="text-sm text-destructive">
            {errors.timezone.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-lg border p-4">
        <Checkbox
          id="location-remote"
          checked={remote}
          disabled={isSubmitting}
          onCheckedChange={(checked) => {
            setValue(
              "remote",
              checked === true,
              {
                shouldDirty: true,
                shouldValidate: true,
              },
            );
          }}
        />

        <div className="space-y-1">
          <Label
            htmlFor="location-remote"
            className="cursor-pointer"
          >
            Remote location
          </Label>

          <p className="text-sm text-muted-foreground">
            Select this if employees can work remotely
            from this location.
          </p>
        </div>
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