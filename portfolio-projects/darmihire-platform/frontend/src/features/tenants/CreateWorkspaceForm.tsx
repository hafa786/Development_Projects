import {
  zodResolver,
} from "@hookform/resolvers/zod";
import {
  Building2,
  Loader2,
  Plus,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import {
  useForm,
} from "react-hook-form";

import { FormError } from "@/components/auth/FormError";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type CreateTenantFormData,
  createTenantSchema,
} from "@/features/tenants/schemas";
import {
  createSlug,
} from "@/features/tenants/utils";

type CreateWorkspaceFormProps = {
  isSubmitting: boolean;

  onSubmit: (
    data: CreateTenantFormData,
  ) => Promise<void>;
};

export function CreateWorkspaceForm({
  isSubmitting,
  onSubmit,
}: CreateWorkspaceFormProps) {
  const [
    slugEditedManually,
    setSlugEditedManually,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,

    formState: {
      errors,
    },
  } = useForm<CreateTenantFormData>({
    resolver:
      zodResolver(
        createTenantSchema,
      ),

    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const workspaceName =
    watch("name");

  useEffect(() => {
    if (slugEditedManually) {
      return;
    }

    setValue(
      "slug",
      createSlug(
        workspaceName,
      ),
      {
        shouldValidate: false,
      },
    );
  }, [
    workspaceName,
    slugEditedManually,
    setValue,
  ]);

  const slugRegistration =
    register("slug");

  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="size-5 text-primary" />
        </div>

        <CardTitle>
          Create a workspace
        </CardTitle>

        <CardDescription>
          Create a workspace for your
          organization and hiring team.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-5"
          onSubmit={
            handleSubmit(onSubmit)
          }
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="workspace-name">
              Workspace name
            </Label>

            <Input
              id="workspace-name"
              placeholder="Darmi Solutions"
              disabled={isSubmitting}
              aria-invalid={
                errors.name
                  ? "true"
                  : "false"
              }
              {...register("name")}
            />

            <FormError
              message={
                errors.name?.message
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspace-slug">
              Workspace URL
            </Label>

            <div className="flex items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring">
              <span className="shrink-0 border-r px-3 text-sm text-muted-foreground">
                darmihire.app/
              </span>

              <input
                id="workspace-slug"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="darmi-solutions"
                disabled={
                  isSubmitting
                }
                aria-invalid={
                  errors.slug
                    ? "true"
                    : "false"
                }
                name={
                  slugRegistration.name
                }
                ref={
                  slugRegistration.ref
                }
                onBlur={
                  slugRegistration.onBlur
                }
                onChange={(
                  event,
                ) => {
                  setSlugEditedManually(
                    true,
                  );

                  slugRegistration
                    .onChange(
                      event,
                    );
                }}
              />
            </div>

            <FormError
              message={
                errors.slug?.message
              }
            />

            {!errors.slug && (
              <p className="text-xs text-muted-foreground">
                This identifies your
                workspace inside
                DarmiHire.
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Creating workspace...
              </>
            ) : (
              <>
                <Plus />
                Create workspace
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}