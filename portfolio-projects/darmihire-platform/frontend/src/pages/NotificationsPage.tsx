import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { getNotifications, retryNotification } from "@/features/notifications/api";
import { NotificationStatusBadge } from "@/features/notifications/NotificationStatusBadge";
import { RetryNotificationButton } from "@/features/notifications/RetryNotificationButton";
import { notificationQueryKeys } from "@/features/notifications/queryKeys";

import { getTenantId } from "@/utils/session";

export default function NotificationsPage() {
    const tenantId = getTenantId();

    const queryClient = useQueryClient();

    const notificationsQuery = useQuery({
        queryKey: notificationQueryKeys.list(tenantId),

        queryFn: getNotifications,

        enabled: Boolean(tenantId),

        refetchInterval: (query) => {
            const notifications = query.state.data ?? [];

            const active = notifications.some(
                (notification) =>
                    notification.status === "PENDING" || notification.status === "PROCESSING",
            );

            return active ? 5000 : false;
        },
    });

    const retryMutation = useMutation({
        mutationFn: retryNotification,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: notificationQueryKeys.list(tenantId),
            });

            toast.success("Notification queued for retry.");
        },

        onError: (error: Error) => {
            toast.error(error.message || "Unable to retry notification.");
        },
    });

    const notifications = notificationsQuery.data ?? [];

    if (notificationsQuery.isLoading) {
        return <div className="p-8">Loading notifications...</div>;
    }

    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-semibold">
                        <Bell className="h-6 w-6" />
                        Notifications
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Monitor transactional email delivery for your workspace.
                    </p>
                </div>

                <Button variant="outline" onClick={() => notificationsQuery.refetch()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Delivery history</CardTitle>
                </CardHeader>

                <CardContent>
                    {notifications.length === 0 ? (
                        <div className="py-16 text-center">
                            <Bell className="mx-auto h-10 w-10 text-muted-foreground" />

                            <p className="mt-4 font-medium">No notifications yet</p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Transactional email activity will appear here.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Subject</TableHead>

                                    <TableHead>Recipient</TableHead>

                                    <TableHead>Status</TableHead>

                                    <TableHead>Attempts</TableHead>

                                    <TableHead>Created</TableHead>

                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {notifications.map((notification) => (
                                    <TableRow key={notification.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {notification.subject}
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                {notification.type}
                                            </div>

                                            {notification.status === "FAILED" &&
                                                notification.failureReason && (
                                                    <div className="mt-1 max-w-md text-xs text-destructive">
                                                        {notification.failureReason}
                                                    </div>
                                                )}
                                        </TableCell>

                                        <TableCell>{notification.recipient}</TableCell>

                                        <TableCell>
                                            <NotificationStatusBadge status={notification.status} />
                                        </TableCell>

                                        <TableCell>{notification.attemptCount}</TableCell>

                                        <TableCell>
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {notification.status === "FAILED" && (
                                                <RetryNotificationButton
                                                    pending={retryMutation.isPending}
                                                    onRetry={() =>
                                                        retryMutation.mutate(notification.id)
                                                    }
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
