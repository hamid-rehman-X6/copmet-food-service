import Image from "next/image";
import { communitySpotlight, testimonials } from "@/constants/home.constants";
import { cn } from "@/lib/utils";
import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";

export function CommunitySection() {
  return (
    <section className="page-shell py-14 sm:py-20" id="community">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="organic-shape relative aspect-[4/5] overflow-hidden bg-primary/10 sm:aspect-square">
          <Image
            alt={communitySpotlight.image.alt}
            className="rounded-[inherit] object-cover"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            src={communitySpotlight.image.src}
          />
          <div className="absolute left-1/2 top-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card/80 p-4 text-center shadow-[var(--shadow-soft)] backdrop-blur sm:w-4/5 sm:p-6">
            <p className="heading-font mb-2 text-3xl font-bold text-secondary sm:text-4xl">99</p>
            <p className="mb-4 text-xs italic leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              &quot;{communitySpotlight.quote}&quot;
            </p>
            <p className="text-xs font-bold text-primary">- {communitySpotlight.author}</p>
          </div>
        </div>

        <div>
          <h2 className="heading-font mb-6 text-2xl font-semibold sm:mb-8 sm:text-3xl">What freezer-stocked homes are saying</h2>
          <div className="space-y-5">
            {testimonials.map((testimonial) => (
              <Card
                className={cn(
                  "border-l-4 p-5 transition-transform hover:translate-x-2 sm:p-6",
                  testimonial.accent === "primary" ? "border-primary" : "border-secondary-container",
                )}
                key={testimonial.name}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex text-secondary-container">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Icon className="h-4 w-4 fill-current" key={index} name="star" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{testimonial.time}</span>
                </div>
                <p className="mb-3 text-sm leading-6 text-foreground">{testimonial.quote}</p>
                <p className="text-sm font-semibold text-primary">- {testimonial.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
