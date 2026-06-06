import { howItWorksSteps } from "@/constants/home.constants";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";

const iconMap = {
  book: "book",
  chef: "chef",
  truck: "truck",
} as const;

export function HowItWorks() {
  return (
    <section className="bg-muted py-14 sm:py-20" id="how-it-works">
      <div className="page-shell">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
          <h2 className="heading-font mb-4 text-2xl font-semibold text-foreground sm:text-3xl">From our kitchen to your freezer</h2>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            We handle the shopping, prep, cooking, and freezing, so you can keep real homemade meals ready for busy
            days.
          </p>
        </div>
        <div className="relative grid gap-10 sm:grid-cols-3">
          <div className="absolute left-0 right-0 top-10 hidden border-t-2 border-dashed border-border sm:block" />
          {howItWorksSteps.map((step) => (
            <article className="relative z-10 text-center" key={step.title}>
              <div
                className={cn(
                  "mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full border border-border bg-background text-primary shadow-sm transition-transform hover:scale-105",
                  step.highlighted && "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]",
                )}
              >
                <Icon className="h-9 w-9" name={iconMap[step.icon]} />
              </div>
              <h3 className="heading-font mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="mx-auto max-w-xs text-sm leading-6 text-muted-foreground">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
