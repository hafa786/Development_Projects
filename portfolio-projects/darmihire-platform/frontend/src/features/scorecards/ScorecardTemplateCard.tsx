import {
  CheckCircle2,
  ChevronRight,
  CircleOff,
  ListChecks,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ScorecardTemplate } from "./types";

type Props = {
  template: ScorecardTemplate;
  selected: boolean;
  onSelect: () => void;
};

export function ScorecardTemplateCard({
  template,
  selected,
  onSelect,
}: Props) {
  return (
    <Card
      className={
        selected
          ? "border-primary"
          : undefined
      }
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-base">
              {template.name}
            </CardTitle>

            <div className="mt-2">
              {template.active ? (
                <Badge variant="secondary">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline">
                  <CircleOff className="mr-1 h-3 w-3" />
                  Inactive
                </Badge>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onSelect}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {template.description ||
            "No description provided."}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <ListChecks className="h-4 w-4" />

          {template.criteria.length}{" "}
          {template.criteria.length === 1
            ? "criterion"
            : "criteria"}
        </div>
      </CardContent>
    </Card>
  );
}