import { cn } from "@/lib/utils";

/**
 * Wordmark for Elevations247. Set in the brand display font;
 * the "247" accent is rendered in purple.
 */
export function Logo({
  className,
  variant = "dark",
  showWordmark = true,
}: {
  className?: string;
  variant?: "dark" | "light";
  showWordmark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center select-none",
        className,
      )}
      aria-label="Elevations247"
    >
      {showWordmark && (
        <span
          className={cn(
            "font-display text-[15px] font-bold tracking-[0.18em] leading-none",
            variant === "light" ? "text-white" : "text-ink",
          )}
        >
          ELEVATIONS<span className="text-purple">247</span>
        </span>
      )}
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
