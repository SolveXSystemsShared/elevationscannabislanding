import { cn } from "@/lib/utils";

/**
 * Wordmark + monogram for Elevations247.
 * Pure SVG so it inverts cleanly on light, dark, and video backgrounds.
 * The "EC" monogram is rendered glyph-style; the wordmark next to it is set
 * in the brand display font.
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
  const fill = variant === "light" ? "#FFFFFF" : "#1A1A2E";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 select-none",
        className,
      )}
      aria-label="Elevations247"
    >
      <svg
        viewBox="0 0 64 64"
        className="h-7 w-7"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* E */}
        <rect x="6" y="8" width="22" height="8" fill={fill} />
        <rect x="6" y="8" width="8" height="48" fill={fill} />
        <rect x="6" y="28" width="18" height="8" fill={fill} />
        <rect x="6" y="48" width="22" height="8" fill={fill} />
        {/* C */}
        <rect x="36" y="8" width="22" height="8" fill={fill} />
        <rect x="36" y="8" width="8" height="48" fill={fill} />
        <rect x="36" y="48" width="22" height="8" fill={fill} />
      </svg>
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
