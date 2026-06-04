import Image from "next/image";
import { Icon } from "@/components/common/Icon";

const servicePoints = [
  "Thoughtfully prepared seasonal menus",
  "Reliable ordering and delivery updates",
  "Secure checkout and account management",
] as const;

export function AuthSidebar() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-inverse text-inverse-foreground lg:flex lg:flex-col lg:justify-between">
      <Image
        alt="A thoughtfully prepared meal shared around a warm, formal dining table."
        className="object-cover"
        fill
        priority
        sizes="45vw"
        src="/images/home-page/hero-section-img-3.png"
      />
      <div className="absolute inset-0 bg-linear-to-b from-inverse/45 via-inverse/65 to-inverse/95" />
      <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/15" />
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/15" />

      <div className="relative z-10 p-10 xl:p-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
          <Icon className="h-4 w-4 text-secondary-container" name="shield" />
          Trusted food service
        </div>
      </div>

      <div className="relative z-10 max-w-2xl p-10 xl:p-14">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-secondary-container">Welcome to Copmet</p>
        <h2 className="heading-font text-3xl font-semibold leading-tight xl:text-5xl">
          Thoughtful meals and dependable service, all in one place.
        </h2>
        <p className="mt-6 max-w-xl text-sm leading-7 text-white/75 xl:text-base">
          Manage your orders, save your favorites, and make every shared meal easier with a secure Copmet account.
        </p>

        <div className="mt-9 grid gap-3">
          {servicePoints.map((point) => (
            <div className="flex items-center gap-3 text-sm text-white/90" key={point}>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary-container text-secondary-container-foreground">
                <Icon className="h-4 w-4" name="check" />
              </span>
              {point}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
          <p className="text-sm italic leading-7 text-white/85">
            &quot;Copmet makes planning meals feel considered, reliable, and refreshingly simple.&quot;
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-container">
            A service built around your table
          </p>
        </div>
      </div>
    </aside>
  );
}
