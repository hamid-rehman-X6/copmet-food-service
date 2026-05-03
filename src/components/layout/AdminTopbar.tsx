// Admin top bar with current section heading.
interface AdminTopbarProps {
  title: string;
}

export function AdminTopbar({ title }: AdminTopbarProps) {
  return (
    <header className="border-b border-[var(--color-hairline)] bg-white px-6 py-4">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
