import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { isAuthenticated } from "@/utils/session";

export function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname +
            location.search,
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;