import { cn } from "@/lib/utils";

/**
 * Breaking Bud master mark — the periodic tile.
 * Atomic number (mono, top-left) · Symbol (Oswald, toxic green) ·
 * paired with the wordmark. The tile is the identity anchor.
 */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  /** Accepted for API compatibility; theming is handled via CSS tokens. */
  variant?: "dark" | "light";
  showWordmark?: boolean;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5 select-none", className)}
      aria-label="Breaking Bud"
    >
      <ElementTile />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-bold uppercase tracking-[0.16em] text-ink">
            BREAKING<span className="text-purple">BUD</span>
          </span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-muted">
            Lab-Graded Flower
          </span>
        </span>
      )}
    </span>
  );
}

/** The standalone atomic tile — "Br" element. */
function ElementTile() {
  return (
    <span
      className="relative flex h-9 w-9 flex-col justify-between rounded-md border border-purple/40 bg-glass px-1.5 py-1 leading-none"
      aria-hidden="true"
    >
      <span className="font-mono text-[7px] text-muted">35</span>
      <span className="font-display text-base font-bold text-purple text-glow">Br</span>
    </span>
  );
}

export function LogoMark({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return <Logo className={className} variant={variant} showWordmark={false} />;
}
