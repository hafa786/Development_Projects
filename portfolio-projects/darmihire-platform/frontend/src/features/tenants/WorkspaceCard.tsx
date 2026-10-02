import {
  ArrowRight,
  Building2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  UserTenant,
} from "@/features/tenants/types";

type WorkspaceCardProps = {
  tenant: UserTenant;
  onSelect: (
    tenant: UserTenant,
  ) => void;
};

function formatRole(
  role: string,
): string {
  return role
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

export function WorkspaceCard({
  tenant,
  onSelect,
}: WorkspaceCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="size-5 text-primary" />
          </div>

          <div className="min-w-0">
            <CardTitle className="truncate text-base">
              {tenant.name}
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              {formatRole(
                tenant.role,
              )}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Button
          className="w-full"
          variant="outline"
          onClick={() =>
            onSelect(tenant)
          }
        >
          Continue
          <ArrowRight />
        </Button>
      </CardContent>
    </Card>
  );
}