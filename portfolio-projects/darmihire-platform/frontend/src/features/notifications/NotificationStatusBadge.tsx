import { AlertTriangle, CheckCircle2, Clock3, LoaderCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { NotificationStatus } from "./types";

type Props = {
    status: NotificationStatus;
};

export function NotificationStatusBadge({ status }: Props) {
    switch (status) {
        case "SENT":
            return (
                <Badge variant="secondary">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Sent
                </Badge>
            );

        case "FAILED":
            return (
                <Badge variant="destructive">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Failed
                </Badge>
            );

        case "PROCESSING":
            return (
                <Badge variant="outline">
                    <LoaderCircle className="mr-1 h-3 w-3 animate-spin" />
                    Sending
                </Badge>
            );

        default:
            return (
                <Badge variant="outline">
                    <Clock3 className="mr-1 h-3 w-3" />
                    Pending
                </Badge>
            );
    }
}
