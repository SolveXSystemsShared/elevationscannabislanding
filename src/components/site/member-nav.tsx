"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./logo";
import { useCart, useSession } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, ChevronDown, Menu, X, LogOut, User, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

export function MemberNav() {
  const pathname = usePathname();
  const router = useRouter();
  const items = useCart((s) => s.items);
  const open = useCart((s) => s.open);
  const session = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const links = [
    { href: "/store", label: "Store" },
    { href: "/orders", label: "My Orders" },
    { href: "/account", label: "Account" },
  ];

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    session.clear();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-line">
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Link href="/store" className="ring-focus rounded-btn">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active =
              pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-btn transition-colors",
                  active
                    ? "text-purple bg-purple/8"
                    : "text-ink/70 hover:text-purple hover:bg-purple/5",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={open}
            className="relative rounded-btn p-2.5 text-ink hover:bg-purple/8 hover:text-purple transition-colors ring-focus"
            aria-label={`Open cart (${count} items)`}
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-purple text-white text-[10px] font-bold">
                {count}
              </span>
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden md:inline-flex items-center gap-2 rounded-btn px-3 py-2 hover:bg-purple/5 ring-focus">
                <Badge variant="subtle" className="font-mono">
                  {session.memberId ?? "------"}
                </Badge>
                <ChevronDown className="h-4 w-4 text-muted" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {session.fullName ?? "Member"}
                <p className="text-xs text-muted normal-case tracking-normal font-normal mt-0.5">
                  {session.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push("/account")}>
                <User className="h-4 w-4" /> My account
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/orders")}>
                <ListOrdered className="h-4 w-4" /> Order history
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={logout} className="text-danger focus:text-danger">
                <LogOut className="h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            className="md:hidden rounded-btn p-2 text-ink hover:bg-purple/8"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-line bg-surface animate-fade-in">
          <nav className="container-wide py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium rounded-btn text-ink hover:bg-purple/5 hover:text-purple"
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-line my-2" />
            <div className="px-3 py-2 flex items-center gap-2">
              <Badge variant="subtle" className="font-mono">
                {session.memberId ?? "------"}
              </Badge>
              <span className="text-sm text-muted">{session.fullName}</span>
            </div>
            <Button variant="ghost" className="mx-3 mb-2" onClick={logout}>
              <LogOut className="h-4 w-4" /> Log out
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
