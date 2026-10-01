import type { ReactNode } from "react";

import { Logo } from "@/components/common/Logo";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex w-full max-w-7xl items-center px-6 py-4">
          <Logo />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Darmi Solutions. All rights reserved.
      </footer>
    </div>
  );
}