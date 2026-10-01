import { BriefcaseBusiness } from "lucide-react";

type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <BriefcaseBusiness className="size-5" />
      </div>

      {!compact && (
        <div>
          <div className="text-lg font-semibold leading-none">
            DarmiHire
          </div>

          <div className="mt-1 text-[11px] text-muted-foreground">
            Modern hiring, powered by AI.
          </div>
        </div>
      )}
    </div>
  );
}