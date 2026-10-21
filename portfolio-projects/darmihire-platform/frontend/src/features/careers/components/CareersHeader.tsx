import { BriefcaseBusiness } from "lucide-react";

type CareersHeaderProps = {
  companyName: string;
};

export function CareersHeader({
  companyName,
}: CareersHeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <BriefcaseBusiness className="size-5" />
          </div>

          <div>
            <p className="font-semibold leading-none">
              {companyName}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Careers
            </p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Powered by{" "}
          <span className="font-semibold text-foreground">
            Darmi
            <span className="text-emerald-600">
              Hire
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}