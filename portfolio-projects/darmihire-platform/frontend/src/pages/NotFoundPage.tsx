import {
  ArrowLeft,
  SearchX,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted">
          <SearchX className="size-7 text-muted-foreground" />
        </div>

        <p className="text-sm font-medium text-primary">
          404
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Page not found
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or
          may have been moved.
        </p>

        <Button className="mt-6" size={'lg'}>
          <Link to="/">
            <ArrowLeft />
            Back to DarmiHire
          </Link>
        </Button>
      </div>
    </div>
  );
}