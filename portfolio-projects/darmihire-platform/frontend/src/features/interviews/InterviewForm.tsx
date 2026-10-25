import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { interviewFormSchema, type InterviewFormValues } from "./schemas";

type InterviewFormProps = {
    defaultValues?: Partial<InterviewFormValues>;
    isPending?: boolean;
    submitLabel?: string;
    onSubmit: (values: InterviewFormValues) => void;
    onCancel?: () => void;
};

const interviewTypeOptions = [
    {
        value: "PHONE_SCREEN",
        label: "Phone screen",
    },
    {
        value: "VIDEO_INTERVIEW",
        label: "Video interview",
    },
    {
        value: "TECHNICAL_INTERVIEW",
        label: "Technical interview",
    },
    {
        value: "BEHAVIORAL_INTERVIEW",
        label: "Behavioral interview",
    },
    {
        value: "HR_INTERVIEW",
        label: "HR interview",
    },
    {
        value: "HIRING_MANAGER_INTERVIEW",
        label: "Hiring manager interview",
    },
    {
        value: "PANEL_INTERVIEW",
        label: "Panel interview",
    },
    {
        value: "FINAL_INTERVIEW",
        label: "Final interview",
    },
    {
        value: "OTHER",
        label: "Other",
    },
] as const;

function getBrowserTimezone(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
        return "UTC";
    }
}

export function InterviewForm({
    defaultValues,
    isPending = false,
    submitLabel = "Schedule interview",
    onSubmit,
    onCancel,
}: InterviewFormProps) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<InterviewFormValues>({
        resolver: zodResolver(interviewFormSchema),

        defaultValues: {
            title: "",
            interviewType: "VIDEO_INTERVIEW",
            date: "",
            startTime: "",
            endTime: "",
            timezone: getBrowserTimezone(),
            location: "",
            meetingUrl: "",
            notes: "",
            ...defaultValues,
        },
    });

    const submitForm = (values: InterviewFormValues) => {
        onSubmit({
            ...values,

            title: values.title.trim(),

            timezone: values.timezone.trim(),

            location: values.location?.trim() ?? "",

            meetingUrl: values.meetingUrl?.trim() ?? "",

            notes: values.notes?.trim() ?? "",
        });
    };

    return (
        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
            {/* Interview title */}
            <div className="space-y-2">
                <label htmlFor="interview-title" className="text-sm font-medium">
                    Interview title
                </label>

                <Input
                    id="interview-title"
                    placeholder="e.g. Technical Interview"
                    disabled={isPending}
                    {...register("title")}
                />

                {errors.title?.message ? (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                ) : null}
            </div>

            {/* Interview type */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Interview type</label>

                <Controller
                    control={control}
                    name="interviewType"
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isPending}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select interview type" />
                            </SelectTrigger>

                            <SelectContent>
                                {interviewTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                {errors.interviewType?.message ? (
                    <p className="text-sm text-destructive">{errors.interviewType.message}</p>
                ) : null}
            </div>

            {/* Date / Start / End */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Date */}
                <div className="space-y-2">
                    <label htmlFor="interview-date" className="text-sm font-medium">
                        Date
                    </label>

                    <Input
                        id="interview-date"
                        type="date"
                        disabled={isPending}
                        {...register("date")}
                    />

                    {errors.date?.message ? (
                        <p className="text-sm text-destructive">{errors.date.message}</p>
                    ) : null}
                </div>

                {/* Start time */}
                <div className="space-y-2">
                    <label htmlFor="interview-start-time" className="text-sm font-medium">
                        Start time
                    </label>

                    <Input
                        id="interview-start-time"
                        type="time"
                        disabled={isPending}
                        {...register("startTime")}
                    />

                    {errors.startTime?.message ? (
                        <p className="text-sm text-destructive">{errors.startTime.message}</p>
                    ) : null}
                </div>

                {/* End time */}
                <div className="space-y-2">
                    <label htmlFor="interview-end-time" className="text-sm font-medium">
                        End time
                    </label>

                    <Input
                        id="interview-end-time"
                        type="time"
                        disabled={isPending}
                        {...register("endTime")}
                    />

                    {errors.endTime?.message ? (
                        <p className="text-sm text-destructive">{errors.endTime.message}</p>
                    ) : null}
                </div>
            </div>

            {/* Timezone */}
            <div className="space-y-2">
                <label htmlFor="interview-timezone" className="text-sm font-medium">
                    Timezone
                </label>

                <Input
                    id="interview-timezone"
                    placeholder="Europe/Helsinki"
                    disabled={isPending}
                    {...register("timezone")}
                />

                <p className="text-xs text-muted-foreground">
                    Times are entered in your current browser timezone.
                </p>

                {errors.timezone?.message ? (
                    <p className="text-sm text-destructive">{errors.timezone.message}</p>
                ) : null}
            </div>

            {/* Location + meeting URL */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Location */}
                <div className="space-y-2">
                    <label htmlFor="interview-location" className="text-sm font-medium">
                        Location
                    </label>

                    <Input
                        id="interview-location"
                        placeholder="Office, meeting room, etc."
                        disabled={isPending}
                        {...register("location")}
                    />

                    {errors.location?.message ? (
                        <p className="text-sm text-destructive">{errors.location.message}</p>
                    ) : null}
                </div>

                {/* Meeting URL */}
                <div className="space-y-2">
                    <label htmlFor="interview-meeting-url" className="text-sm font-medium">
                        Meeting URL
                    </label>

                    <Input
                        id="interview-meeting-url"
                        type="url"
                        placeholder="https://meet.example.com/..."
                        disabled={isPending}
                        {...register("meetingUrl")}
                    />

                    {errors.meetingUrl?.message ? (
                        <p className="text-sm text-destructive">{errors.meetingUrl.message}</p>
                    ) : null}
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
                <label htmlFor="interview-notes" className="text-sm font-medium">
                    Notes
                </label>

                <Textarea
                    id="interview-notes"
                    placeholder="Interview instructions, preparation notes, topics to discuss..."
                    className="min-h-28 resize-y"
                    disabled={isPending}
                    {...register("notes")}
                />

                {errors.notes?.message ? (
                    <p className="text-sm text-destructive">{errors.notes.message}</p>
                ) : null}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t pt-5">
                {onCancel ? (
                    <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
                        Cancel
                    </Button>
                ) : null}

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Scheduling..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}
