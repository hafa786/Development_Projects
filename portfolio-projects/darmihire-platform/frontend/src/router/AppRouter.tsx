import { Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";

import { ProtectedRoute } from "@/router/ProtectedRoute";
import { PublicRoute } from "@/router/PublicRoute";
import { WorkspaceRoute } from "@/router/WorkspaceRoute";
import RootRoute from "@/router/RootRoute";
import NotFoundRedirect from "@/router/NotFoundRedirect";

import DashboardPage from "@/pages/DashboardPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import LocationsPage from "@/pages/LocationsPage";
import MembersPage from "@/pages/MembersPage";
import TeamsPage from "@/pages/TeamsPage";
import LoginPage from "@/pages/auth/LoginPage";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import JobsPage from "@/pages/JobsPage";
import JobDetailsPage from "@/pages/JobDetailsPage";
import CandidatesPage from "@/pages/CandidatesPage";
import CandidateDetailsPage from "@/pages/CandidateDetailsPage";
import UsersPage from "@/pages/UsersPage";
import { ScorecardsPage } from "@/pages/ScorecardsPage";
import { OffersPage } from "@/pages/OffersPage";
import { ApplicationDetailsPage } from "@/features/applications/ApplicationDetailsPage";
import { ApplicationsPage } from "@/pages/ApplicationsPage";
import CareersPage from "@/pages/CareersPage";

export function AppRouter() {
  return (
    <Routes>
      {/* =========================
          ROOT
          ========================= */}

      <Route path="/" element={<RootRoute />} />

      {/* =========================
          PUBLIC AUTH
          ========================= */}

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
      <Route path="/careers/:companySlug" element={<CareersPage />} />

      {/* =========================
          AUTHENTICATED
          ========================= */}

      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <WorkspaceRoute>
              <AppLayout />
            </WorkspaceRoute>
          }
        >
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="scorecards" element={<ScorecardsPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/:jobId" element={<JobDetailsPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />

          <Route
            path="/applications/:applicationId"
            element={<ApplicationDetailsPage />}
          />
          <Route
            path="/candidates/:candidateId"
            element={<CandidateDetailsPage />}
          />
        </Route>
      </Route>

      {/* =========================
          NOT FOUND
          ========================= */}

      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

export default AppRouter;
