import Link from "next/link";
import { Logo } from "./logo";
import { ShieldCheck } from "lucide-react";
import { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  variant = "split",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  variant?: "split" | "single";
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {variant === "split" && (
        <aside className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative overflow-hidden bg-purple-dark text-white p-12 flex-col">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 20%, rgba(155,114,232,0.4), transparent 50%), radial-gradient(circle at 80% 80%, rgba(108,63,197,0.5), transparent 50%)",
            }}
          />
          <div className="absolute inset-0 grain opacity-30" />
          <Link href="/" className="relative inline-flex">
            <Logo variant="light" />
          </Link>
          <div className="relative mt-auto max-w-md">
            <p className="text-[11px] uppercase tracking-[0.22em] text-purple-light font-semibold">
              Above the Rest
            </p>
            <h2 className="mt-4 font-display text-[40px] leading-[1.05] font-semibold">
              Premium cannabis,<br />delivered with care.
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              Stellenbosch&apos;s exclusive private members club. 24/7 delivery.
              Curated, never compromised.
            </p>
            <div className="mt-8 flex items-center gap-2 text-xs text-white/60">
              <ShieldCheck className="h-4 w-4" />
              <span>POPIA-compliant. Encrypted. Members only.</span>
            </div>
          </div>
        </aside>
      )}
      <div className="flex-1 flex flex-col">
        <header className="px-6 sm:px-10 py-6 lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-md">
            <h1 className="font-display text-[32px] leading-tight font-semibold tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-muted leading-relaxed">{subtitle}</p>
            )}
            <div className="mt-8">{children}</div>
          </div>
        </main>
        <footer className="px-6 sm:px-10 py-6 text-xs text-muted">
          © {new Date().getFullYear()} Elevations247 · POPIA-compliant
        </footer>
      </div>
    </div>
  );
}
