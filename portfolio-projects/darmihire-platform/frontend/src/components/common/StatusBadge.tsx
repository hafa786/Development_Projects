import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  const normalizedStatus = status
    .replaceAll("_", " ")
    .toLowerCase();

  return (
    <Badge variant="secondary" className="capitalize">
      {normalizedStatus}
    </Badge>
  );
}