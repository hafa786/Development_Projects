export const RATING_OPTIONS = [
    {
        value: 1,
        label: "Poor",
    },
    {
        value: 2,
        label: "Below expectations",
    },
    {
        value: 3,
        label: "Meets expectations",
    },
    {
        value: 4,
        label: "Strong",
    },
    {
        value: 5,
        label: "Exceptional",
    },
] as const;

export function getRatingLabel(rating: number) {
    return RATING_OPTIONS.find((option) => option.value === rating)?.label ?? `${rating}`;
}
