import Image from "next/image";
import Link from "next/link";
import { brandAssets, brandName } from "@/constants/navigation";
import { AuthSidebar } from "@/components/auth/AuthSidebar";
import { Icon } from "@/components/common/Icon";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(30rem,0.85fr)]">
      <section className="flex min-h-screen flex-col bg-background">
        <header className="flex items-center justify-between gap-4 px-5 py-6 sm:px-8 lg:px-12">
          <Link className="flex items-center" href="/">
            <Image
              alt={brandAssets.logo.alt}
              className="h-11 w-auto"
              height={724}
              priority
              src={brandAssets.logo.src}
              width={2172}
            />
            <span className="sr-only">{brandName}</span>
          </Link>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            href="/"
          >
            <Icon className="h-4 w-4" name="arrowLeft" />
            Back to home
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-lg">{children}</div>
        </div>

        <footer className="px-5 py-6 text-center text-xs text-muted-foreground sm:px-8 lg:px-12">
          Secure access to your Copmet Food Service account.
        </footer>
      </section>

      <AuthSidebar />
    </main>
  );
}
