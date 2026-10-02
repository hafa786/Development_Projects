import type {
  ReactNode,
} from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardPage from "@/pages/DashboardPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import LocationsPage from "@/pages/LocationsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import TeamsPage from "@/pages/TeamsPage";
import UsersPage from "@/pages/UsersPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import {
  ProtectedRoute,
} from "@/router/ProtectedRoute";
import {
  PublicRoute,
} from "@/router/PublicRoute";
import {
  WorkspaceRoute,
} from "@/router/WorkspaceRoute";
import {
  getTenantId,
  isAuthenticated,
} from "@/utils/session";

function RootRedirect() {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!getTenantId()) {
    return (
      <Navigate
        to="/onboarding"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/dashboard"
      replace
    />
  );
}

function WorkspaceProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <WorkspaceRoute>
        {children}
      </WorkspaceRoute>
    </ProtectedRoute>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RootRedirect />
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <WorkspaceProtectedRoute>
            <DashboardPage />
          </WorkspaceProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <WorkspaceProtectedRoute>
            <UsersPage />
          </WorkspaceProtectedRoute>
        }
      />

      <Route
        path="/departments"
        element={
          <WorkspaceProtectedRoute>
            <DepartmentsPage />
          </WorkspaceProtectedRoute>
        }
      />

      <Route
        path="/locations"
        element={
          <WorkspaceProtectedRoute>
            <LocationsPage />
          </WorkspaceProtectedRoute>
        }
      />

      <Route
        path="/teams"
        element={
          <WorkspaceProtectedRoute>
            <TeamsPage />
          </WorkspaceProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <NotFoundPage />
        }
      />
    </Routes>
  );
}