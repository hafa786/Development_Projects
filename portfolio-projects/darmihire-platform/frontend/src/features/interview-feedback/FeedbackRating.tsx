import { Textarea } from "@/components/ui/textarea";

import { RATING_OPTIONS } from "./rating";

type Props = {
  name: string;
  description?: string | null;

  required: boolean;
  weight: number;

  rating: number | null;
  comments: string;

  disabled?: boolean;

  onRatingChange: (
    rating: number,
  ) => void;

  onCommentsChange: (
    comments: string,
  ) => void;
};

export function FeedbackRating({
  name,
  description,
  required,
  weight,
  rating,
  comments,
  disabled = false,
  onRatingChange,
  onCommentsChange,
}: Props) {
  return (
    <div className="space-y-4 rounded-lg border p-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">
            {name}
          </h3>

          {required && (
            <span className="text-xs font-medium text-destructive">
              Required
            </span>
          )}

          <span className="text-xs text-muted-foreground">
            Weight {weight}
          </span>
        </div>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {RATING_OPTIONS.map(
          (option) => {
            const selected =
              rating === option.value;

            return (
              <button
                key={option.value}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onRatingChange(
                    option.value,
                  )
                }
                className={[
                  "rounded-md border px-2 py-3 text-center transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                  disabled
                    ? "cursor-not-allowed opacity-60"
                    : "",
                ].join(" ")}
              >
                <div className="text-lg font-semibold">
                  {option.value}
                </div>

                <div className="mt-1 hidden text-[11px] sm:block">
                  {option.label}
                </div>
              </button>
            );
          },
        )}
      </div>

      <Textarea
        value={comments}
        disabled={disabled}
        onChange={(event) =>
          onCommentsChange(
            event.target.value,
          )
        }
        placeholder="Optional comments about this criterion..."
        rows={2}
      />
    </div>
  );
}