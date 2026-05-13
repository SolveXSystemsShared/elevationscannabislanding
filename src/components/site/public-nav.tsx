"use client";

import * as React from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JOIN_URL } from "@/lib/constants";
import { Menu, X } from "lucide-react";

export function PublicNav({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onDark = overlay && !scrolled;

  const links = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#products", label: "Products" },
    { href: "#about", label: "About" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-surface/95 backdrop-blur-md border-b border-line shadow-sm"
          : overlay
            ? "bg-transparent"
            : "bg-surface border-b border-line",
      )}
    >
      <div className="container-wide flex h-16 sm:h-[72px] items-center justify-between">
        <Link href="/" className="ring-focus rounded-btn">
          <Logo variant={onDark ? "light" : "dark"} />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors",
                onDark
                  ? "text-white/80 hover:text-white"
                  : "text-ink/80 hover:text-purple",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button
            asChild
            variant={onDark ? "ghost" : "plain"}
            className={cn(
              onDark && "text-white border-white/30 hover:bg-white/10 hover:text-white hover:border-white/50",
            )}
          >
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <a href={JOIN_URL}>Join Now</a>
          </Button>
        </div>

        <button
          className={cn(
            "md:hidden rounded-btn p-2 ring-focus",
            onDark ? "text-white" : "text-ink",
          )}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-line bg-surface animate-fade-in">
          <nav className="container-wide py-5 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-ink/80 hover:text-purple py-1"
              >
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-line">
              <Button asChild variant="ghost" className="w-full">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="w-full">
                <a href={JOIN_URL}>Join Now</a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
