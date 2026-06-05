import Image from "next/image";
import Link from "next/link";
import { brandAssets, brandName } from "@/constants/navigation";
import { Icon } from "@/components/common/Icon";

const adminHighlights = ["Menu operations", "Order oversight", "Customer records"] as const;

export default function AdminAuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,0.9fr)_minmax(32rem,0.75fr)]">
      <section className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between gap-3 px-4 py-5 sm:px-8 sm:py-6 lg:px-12">
          <Link className="flex min-w-0 items-center" href="/">
            <Image alt={brandAssets.logo.alt} className="h-9 w-auto sm:h-11" height={724} priority src={brandAssets.logo.src} width={2172} />
            <span className="sr-only">{brandName}</span>
          </Link>
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary" href="/">
            <Icon className="h-4 w-4" name="arrowLeft" />
            <span className="hidden min-[400px]:inline">Back to home</span>
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">{children}</div>
        </div>

        <footer className="px-4 py-5 text-center text-xs text-muted-foreground sm:px-8 sm:py-6 lg:px-12">
          Secure access for Copmet Food Service operations.
        </footer>
      </section>

      <aside className="relative hidden min-h-screen overflow-hidden bg-inverse text-inverse-foreground lg:flex lg:flex-col lg:justify-between">
        <Image
          alt="Freshly plated food on a warm table setting."
          className="object-cover"
          fill
          priority
          sizes="42vw"
          src="/images/home-page/hero-section-img-3.png"
        />
        <div className="absolute inset-0 bg-linear-to-b from-inverse/35 via-inverse/65 to-inverse/95" />

        <div className="relative z-10 p-10 xl:p-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
            <Icon className="h-4 w-4 text-secondary-container" name="shield" />
            Admin only
          </div>
        </div>

        <div className="relative z-10 max-w-xl p-10 xl:p-14">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-secondary-container">Copmet operations</p>
          <h2 className="heading-font text-3xl font-semibold leading-tight xl:text-5xl">Keep the service moving with focused admin access.</h2>

          <div className="mt-8 grid gap-3">
            {adminHighlights.map((item) => (
              <div className="flex items-center gap-3 text-sm text-white/90" key={item}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary-container text-secondary-container-foreground">
                  <Icon className="h-4 w-4" name="check" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}
