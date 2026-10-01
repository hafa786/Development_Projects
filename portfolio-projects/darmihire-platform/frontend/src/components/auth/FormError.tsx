type FormErrorProps = {
  message?: string;
};

export function FormError({
  message,
}: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className="text-xs text-destructive"
      role="alert"
    >
      {message}
    </p>
  );
}