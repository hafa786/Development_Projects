import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { PublicRoute } from "@/router/PublicRoute";
import { WorkspaceRoute } from "@/router/WorkspaceRoute";

import DashboardPage from "@/pages/DashboardPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import LandingPage from "@/pages/LandingPage";
import LocationsPage from "@/pages/LocationsPage";
import TeamsPage from "@/pages/TeamsPage";
import LoginPage from "@/pages/auth/LoginPage";

// Uncomment when available:
// import OnboardingPage from "@/pages/onboarding/OnboardingPage";

export function AppRouter() {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC WEBSITE
          ===================================================== */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* =====================================================
          AUTH PAGES
          ===================================================== */}

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* =====================================================
          AUTHENTICATED ROUTES
          ===================================================== */}

      <Route element={<ProtectedRoute />}>
        {/*
        <Route
          path="/onboarding"
          element={<OnboardingPage />}
        />
        */}

        {/* ===============================================
            WORKSPACE
            =============================================== */}

        <Route
          element={
            <WorkspaceRoute>
              <AppLayout />
            </WorkspaceRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/settings/departments"
            element={<DepartmentsPage />}
          />

          <Route
            path="/settings/locations"
            element={<LocationsPage />}
          />

          <Route
            path="/settings/teams"
            element={<TeamsPage />}
          />
        </Route>
      </Route>

      {/* =====================================================
          NOT FOUND
          ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default AppRouter;