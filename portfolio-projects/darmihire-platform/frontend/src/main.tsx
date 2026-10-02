import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/QueryProvider";

createRoot(
  document.getElementById("root")!,
).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <App />

        <Toaster
          richColors
          position="top-right"
        />
      </BrowserRouter>
    </QueryProvider>
  </StrictMode>,
);