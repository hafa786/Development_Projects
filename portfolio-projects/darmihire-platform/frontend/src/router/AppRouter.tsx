import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import LocationsPage from "@/pages/LocationsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SupportPage from "@/pages/SupportPage";
import TeamsPage from "@/pages/TeamsPage";
import UsersPage from "@/pages/UsersPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { PublicRoute } from "@/router/PublicRoute";
import { WorkspaceRoute } from "@/router/WorkspaceRoute";
import { getTenantId, isAuthenticated } from "@/utils/session";

function RootRedirect() {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (!getTenantId()) {
        return <Navigate to="/onboarding" replace />;
    }

    return <Navigate to="/dashboard" replace />;
}

function WorkspaceProtectedRoute({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute>
            <WorkspaceRoute>{children}</WorkspaceRoute>
        </ProtectedRoute>
    );
}

export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<RootRedirect />} />

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
                element={
                    <WorkspaceProtectedRoute>
                        <AppLayout />
                    </WorkspaceProtectedRoute>
                }
            >
                <Route path="/dashboard" element={<DashboardPage />} />

                <Route path="/users" element={<UsersPage />} />

                <Route path="/departments" element={<DepartmentsPage />} />

                <Route path="/teams" element={<TeamsPage />} />

                <Route path="/locations" element={<LocationsPage />} />

                <Route path="/support" element={<SupportPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
