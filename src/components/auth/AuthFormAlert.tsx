export function AuthFormAlert({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <p aria-live="polite" className="rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error" role="alert">
      {message}
    </p>
  );
}
