"use client";

import * as React from "react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";

const KEY = "elv_age_verified";

export function AgeGate() {
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = sessionStorage.getItem(KEY);
    if (!ok) setShown(true);
  }, []);

  const accept = () => {
    sessionStorage.setItem(KEY, "1");
    setShown(false);
  };

  const decline = () => {
    window.location.href = "https://www.google.com";
  };

  if (!shown) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-fume/95 backdrop-blur-md p-6 animate-fade-in-slow"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(180,240,0,0.14), transparent 40%), radial-gradient(circle at 80% 80%, rgba(116,195,52,0.14), transparent 40%)",
        }}
      />
      <div className="relative w-full max-w-md rounded-card border border-purple/20 bg-glass backdrop-blur-xl p-8 sm:p-10 shadow-2xl text-center">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-purple">
          Restricted · 18+
        </p>
        <h2
          id="age-gate-title"
          className="mt-3 font-display uppercase text-[26px] sm:text-[30px] leading-tight font-bold text-ink"
        >
          You must be 18 or older to enter.
        </h2>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Breaking Bud is a private members club operating under the
          constitutional right to privacy in South Africa. Members only.
        </p>
        <div className="mt-7 flex flex-col gap-2.5">
          <Button size="lg" className="w-full" onClick={accept}>
            I am 18 or older — Enter
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="w-full"
            onClick={decline}
          >
            I am under 18 — Exit
          </Button>
        </div>
        <p className="mt-6 font-mono text-[11px] text-muted/80 leading-relaxed">
          By entering, you confirm you are an adult and acknowledge our
          private-members model under <em>Minister of Justice v Prince</em> [2018]
          ZACC 30. POPIA-compliant.
        </p>
      </div>
    </div>
  );
}
