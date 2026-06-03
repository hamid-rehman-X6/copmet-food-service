import { Button } from "@/components/common/Button";

export function NewsletterCta() {
  return (
    <section className="bg-primary px-[var(--spacing-page)] py-20 text-primary-foreground">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="heading-font mb-5 text-4xl font-bold md:text-5xl">Gather more, stress less.</h2>
        <p className="mx-auto mb-10 max-w-2xl text-sm leading-6 opacity-90 md:text-base">
          Join our community for weekly seasonal menu updates and chef tips for the perfect dinner party.
        </p>
        <form className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
          <input
            className="min-w-0 flex-1 rounded-xl border border-transparent bg-card px-5 py-4 text-foreground outline-none focus:border-secondary-container"
            placeholder="your@email.com"
            type="email"
          />
          <Button className="rounded-xl" type="submit" variant="amber">
            Join Us
          </Button>
        </form>
      </div>
    </section>
  );
}
