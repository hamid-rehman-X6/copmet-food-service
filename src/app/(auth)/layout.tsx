import Image from "next/image";
import Link from "next/link";
import { brandAssets, brandName } from "@/constants/navigation";
import { AuthSidebar } from "@/components/auth/AuthSidebar";
import { Icon } from "@/components/common/Icon";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(30rem,0.85fr)]">
      <section className="flex min-h-screen flex-col bg-background">
        <header className="flex items-center justify-between gap-3 px-4 py-5 sm:px-8 sm:py-6 lg:px-12">
          <Link className="flex items-center" href="/">
            <Image
              alt={brandAssets.logo.alt}
              className="h-9 w-auto sm:h-11"
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
            <span className="hidden min-[400px]:inline">Back to home</span>
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="w-full max-w-lg">{children}</div>
        </div>

        <footer className="px-4 py-5 text-center text-xs text-muted-foreground sm:px-8 sm:py-6 lg:px-12">
          Secure access to your Copmet frozen meal account.
        </footer>
      </section>

      <AuthSidebar />
    </main>
  );
}
