import { Building2 } from "lucide-react";

import { Logo } from "@/components/common/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
          <Logo />
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl justify-center px-4 py-16 sm:px-6">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="size-6 text-primary" />
            </div>

            <CardTitle>
              Set up your workspace
            </CardTitle>

            <CardDescription>
              Create or select your DarmiHire workspace
              before continuing.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Workspace setup will be added in the next
              frontend step.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}