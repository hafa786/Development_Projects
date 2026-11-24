import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
    pending: boolean;
    onRetry: () => void;
};

export function RetryNotificationButton({ pending, onRetry }: Props) {
    return (
        <Button variant="outline" size="sm" disabled={pending} onClick={onRetry}>
            <RotateCcw className={`mr-2 h-4 w-4 ${pending ? "animate-spin" : ""}`} />
            Retry
        </Button>
    );
}
