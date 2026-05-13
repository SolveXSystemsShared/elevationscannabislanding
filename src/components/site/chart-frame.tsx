"use client";

import * as React from "react";

/**
 * Recharts' ResponsiveContainer measures its parent on the first paint.
 * In Next dev, the first SSR render produces width(-1) warnings until the
 * client hydrates. Wrapping our charts in a mount-gate eliminates the noise
 * and matches what hydrated users actually see.
 */
export function ChartFrame({
  height = 288,
  children,
}: {
  height?: number;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <div style={{ height, width: "100%" }}>
      {mounted ? (
        children
      ) : (
        <div className="h-full w-full rounded-btn bg-line/40 animate-pulse-soft" />
      )}
    </div>
  );
}
