import Image from "next/image";
import { communitySpotlight, testimonials } from "@/constants/home.constants";
import { cn } from "@/lib/utils";
import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";

export function CommunitySection() {
  return (
    <section className="page-shell py-20" id="community">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="organic-shape relative aspect-square overflow-hidden bg-primary/10 p-5">
          <Image
            alt={communitySpotlight.image.alt}
            className="rounded-[inherit] object-cover"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            src={communitySpotlight.image.src}
          />
          <div className="absolute left-1/2 top-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card/75 p-6 text-center shadow-[var(--shadow-soft)] backdrop-blur">
            <p className="heading-font mb-2 text-4xl font-bold text-secondary">99</p>
            <p className="mb-4 text-sm italic leading-6 text-muted-foreground">&quot;{communitySpotlight.quote}&quot;</p>
            <p className="text-xs font-bold text-primary">- {communitySpotlight.author}</p>
          </div>
        </div>

        <div>
          <h2 className="heading-font mb-8 text-3xl font-semibold">What our community is saying</h2>
          <div className="space-y-5">
            {testimonials.map((testimonial) => (
              <Card
                className={cn(
                  "border-l-4 p-6 transition-transform hover:translate-x-2",
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
