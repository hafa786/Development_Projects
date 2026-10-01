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

export default function App() {
  return (
    <>
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
            >
              Get started

              <ArrowRight />
            </Button>
          </CardFooter>
        </Card>
      </main>

      <Toaster richColors />
    </>
  );
}