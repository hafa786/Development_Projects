import {
  ArrowRight,
  BriefcaseBusiness,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Toaster,
} from "@/components/ui/sonner";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900">
      <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BriefcaseBusiness
                size={24}
              />
            </div>

            <CardTitle className="text-3xl">
              DarmiHire
            </CardTitle>

            <CardDescription className="text-base">
              Modern hiring, powered by AI.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your recruitment workspace
              is being prepared.
            </p>
          </CardContent>

          <CardFooter>
            <Button
              onClick={() =>
                toast.success(
                  "DarmiHire frontend is ready.",
                )
              }
              size={"lg"}
            >
              Get started

              <ArrowRight />
            </Button>
          </CardFooter>
        </Card>
      </main>

      <Toaster richColors />
    </div>
  );
}