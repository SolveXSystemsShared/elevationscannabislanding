import Link from "next/link";
import { Logo } from "./logo";
import { Mail } from "lucide-react";
import { JOIN_URL } from "@/lib/constants";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-wide py-14 grid gap-10 md:grid-cols-3">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-muted leading-relaxed max-w-xs">
            Stellenbosch&apos;s exclusive private cannabis members club. Premium,
            curated, delivered. Members only.
          </p>
          <p className="text-[11px] uppercase tracking-wider text-muted/80 font-medium">
            Above the Rest.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-wider text-muted font-semibold">
              Club
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#how-it-works" className="text-ink hover:text-purple transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-ink hover:text-purple transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-ink hover:text-purple transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-wider text-muted font-semibold">
              Members
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={JOIN_URL} className="text-ink hover:text-purple transition-colors">
                  Join
                </a>
              </li>
              <li>
                <Link href="/login" className="text-ink hover:text-purple transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-ink hover:text-purple transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/agreement" className="text-ink hover:text-purple transition-colors">
                  Membership Agreement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-wider text-muted font-semibold">
            Contact
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="mailto:info@elevations247.com"
                className="inline-flex items-center gap-2 text-ink hover:text-purple transition-colors"
              >
                <Mail className="h-4 w-4" /> info@elevations247.com
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/elevations247"
                className="inline-flex items-center gap-2 text-ink hover:text-purple transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon className="h-4 w-4" /> @elevations247
              </a>
            </li>
          </ul>
          <p className="pt-2 text-xs text-muted leading-relaxed">
            Stellenbosch, Western Cape · 24/7 delivery
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-wide py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-muted">
          <p>
            © {new Date().getFullYear()} Elevations247. All rights reserved. Private
            Members Club. Stellenbosch, Western Cape.
          </p>
          <p>For adults 18 and older only. Cannabis for personal use. Private club members only.</p>
        </div>
        <div className="container-wide pb-5 text-[11px] text-muted/70">
          POPIA compliant · Built by SolveX Systems
        </div>
      </div>
    </footer>
  );
}
