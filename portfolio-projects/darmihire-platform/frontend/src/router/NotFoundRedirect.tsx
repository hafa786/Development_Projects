import { Navigate } from "react-router-dom";

import {
    getTenantId,
    isAuthenticated,
} from "@/utils/session";

export function NotFoundRedirect() {
    if (!isAuthenticated()) {
        return (
            <Navigate
                to="/"
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

export default NotFoundRedirect;