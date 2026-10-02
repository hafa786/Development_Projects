import {
  Outlet,
} from "react-router-dom";

import {
  Sidebar,
} from "@/components/layout/Sidebar";
import {
  Topbar,
} from "@/components/layout/Topbar";

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}