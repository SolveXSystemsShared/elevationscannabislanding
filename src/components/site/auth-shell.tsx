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
        <aside className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative overflow-hidden bg-fume text-ink p-12 flex-col">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 20%, rgba(180,240,0,0.14), transparent 50%), radial-gradient(circle at 80% 80%, rgba(116,195,52,0.14), transparent 50%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(155,232,74,0.05) 0px, rgba(155,232,74,0.05) 1px, transparent 1px, transparent 44px), repeating-linear-gradient(90deg, rgba(155,232,74,0.05) 0px, rgba(155,232,74,0.05) 1px, transparent 1px, transparent 44px)",
            }}
          />
          <div className="absolute inset-0 grain opacity-30" />
          <Link href="/" className="relative inline-flex">
            <Logo />
          </Link>
          <div className="relative mt-auto max-w-md">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
              The Science of a Better High
            </p>
            <h2 className="mt-4 font-display uppercase text-[40px] leading-[1.05] font-bold">
              Lab-graded flower,<br />delivered with care.
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              A chemistry-lab dispensary. Members only, open 24/7 in Midrand.
              Every strain, an element.
            </p>
            <div className="mt-8 flex items-center gap-2 font-mono text-xs text-muted">
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
            <h1 className="font-display uppercase text-[32px] leading-tight font-bold tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-muted leading-relaxed">{subtitle}</p>
            )}
            <div className="mt-8">{children}</div>
          </div>
        </main>
        <footer className="px-6 sm:px-10 py-6 font-mono text-xs text-muted">
          © {new Date().getFullYear()} Breaking Bud · POPIA-compliant
        </footer>
      </div>
    </div>
  );
}
