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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-purple-dark/95 backdrop-blur-md p-6 animate-fade-in-slow"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(155,114,232,0.4), transparent 40%), radial-gradient(circle at 80% 80%, rgba(108,63,197,0.4), transparent 40%)",
        }}
      />
      <div className="relative w-full max-w-md rounded-card border border-white/10 bg-purple-dark/40 backdrop-blur-xl p-8 sm:p-10 shadow-2xl text-center">
        <div className="flex justify-center mb-6">
          <Logo variant="light" />
        </div>
        <h2
          id="age-gate-title"
          className="font-display text-[26px] sm:text-[30px] leading-tight font-semibold text-white"
        >
          You must be 18 or older to enter this site.
        </h2>
        <p className="mt-3 text-sm text-white/70 leading-relaxed">
          Elevations247 is a private members club operating under the
          constitutional right to privacy in South Africa. Members only.
        </p>
        <div className="mt-7 flex flex-col gap-2.5">
          <Button
            size="lg"
            className="w-full bg-white text-purple-dark hover:bg-white/95"
            onClick={accept}
          >
            I am 18 or older — Enter
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/40"
            onClick={decline}
          >
            I am under 18 — Exit
          </Button>
        </div>
        <p className="mt-6 text-[11px] text-white/50 leading-relaxed">
          By entering, you confirm you are an adult and acknowledge our
          private-members model under <em>Minister of Justice v Prince</em> [2018]
          ZACC 30. POPIA-compliant.
        </p>
      </div>
    </div>
  );
}
