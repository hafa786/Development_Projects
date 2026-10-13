export function localDateTimeToIso(
  date: string,
  time: string,
): string {
  const value = new Date(`${date}T${time}:00`);

  if (Number.isNaN(value.getTime())) {
    throw new Error("Invalid interview date or time");
  }

  return value.toISOString();
}

export function formatInterviewDateTime(
  value: string,
  timezone?: string,
) {
  const date = new Date(value);

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone || undefined,
  }).format(date);
}