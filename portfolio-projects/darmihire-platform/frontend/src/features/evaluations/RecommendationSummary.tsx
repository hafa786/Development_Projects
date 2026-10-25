import type { RecommendationDistribution } from "./types";

type Props = {
    recommendations: RecommendationDistribution;
};

const items = [
    {
        key: "strongNo",
        label: "Strong No",
    },
    {
        key: "no",
        label: "No",
    },
    {
        key: "neutral",
        label: "Neutral",
    },
    {
        key: "yes",
        label: "Yes",
    },
    {
        key: "strongYes",
        label: "Strong Yes",
    },
] as const;

export function RecommendationSummary({ recommendations }: Props) {
    return (
        <div className="rounded-lg border p-5">
            <h3 className="font-semibold">Hiring recommendations</h3>

            <div className="mt-4 grid grid-cols-5 gap-2">
                {items.map((item) => (
                    <div key={item.key} className="rounded-md border p-3 text-center">
                        <div className="text-2xl font-semibold">{recommendations[item.key]}</div>

                        <div className="mt-1 text-xs text-muted-foreground">{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
