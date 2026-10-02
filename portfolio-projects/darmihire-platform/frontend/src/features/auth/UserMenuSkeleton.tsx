import {
  Skeleton,
} from "@/components/ui/skeleton";

export function UserMenuSkeleton() {
  return (
    <div className="flex h-10 items-center gap-2 px-2">
      <Skeleton className="size-8 rounded-full" />

      <div className="hidden space-y-1.5 sm:block">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2.5 w-32" />
      </div>
    </div>
  );
}