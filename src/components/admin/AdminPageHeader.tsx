import { Icon, type IconName } from "@/components/common/Icon";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: IconName;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionIcon = "plus",
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-secondary">{eyebrow}</p> : null}
        <h1 className="heading-font text-3xl font-bold tracking-tight text-foreground sm:text-4xl xl:text-5xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
      </div>
      {actionLabel ? (
        <button
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-container sm:w-auto"
          type="button"
        >
          <Icon className="h-5 w-5" name={actionIcon} />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
