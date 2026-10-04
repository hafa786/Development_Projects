import { Navigate } from "react-router-dom";

import LandingPage from "@/pages/LandingPage";
import {
  getTenantId,
  isAuthenticated,
} from "@/utils/session";

export function RootRoute() {
  // Public visitor
  if (!isAuthenticated()) {
    return <LandingPage />;
  }

  // Logged in but hasn't selected/created workspace
  if (!getTenantId()) {
    return (
      <Navigate
        to="/onboarding"
        replace
      />
    );
  }

  // Logged-in workspace user
  return (
    <Navigate
      to="/dashboard"
      replace
    />
  );
}

export default RootRoute;