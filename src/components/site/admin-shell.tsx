"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Receipt,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside
        className={cn(
          "surface-dark fixed inset-y-0 left-0 z-30 w-64 bg-fume text-ink border-r border-line transition-transform lg:translate-x-0 lg:static lg:flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-line">
          <Link href="/admin">
            <Logo />
          </Link>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-purple font-semibold">
            Admin Console
          </p>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {NAV.map((n) => {
            const active = n.exact
              ? pathname === n.href
              : pathname === n.href || pathname.startsWith(n.href + "/");
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors",
                  active
                    ? "bg-purple/15 text-purple border border-purple/25"
                    : "text-muted hover:bg-glass hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-line flex items-center gap-2">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium text-muted hover:bg-glass hover:text-ink flex-1"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <ThemeToggle />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-20 bg-surface border-b border-line px-4 py-3 flex items-center justify-between">
          <Link href="/admin">
            <Logo />
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2 rounded-btn hover:bg-line/40"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </header>
        <main className="flex-1 px-5 sm:px-8 py-8">{children}</main>
        <footer className="px-5 sm:px-8 py-4 text-xs text-muted border-t border-line">
          <Badge variant="muted" className="font-mono">
            ADMIN
          </Badge>
          <span className="ml-3 font-mono">© Breaking Bud · POPIA-compliant</span>
        </footer>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display uppercase text-h2 font-bold leading-tight tracking-tight">
          {title}
        </h1>
        {description && <p className="mt-1 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
