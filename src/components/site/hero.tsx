"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Circle } from "lucide-react";
import { JOIN_URL, LOGIN_URL } from "@/lib/constants";

export function Hero() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = React.useState(false);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Ensure muted + inline before attempting to play. Required for autoplay
    // on iOS Safari, Chrome mobile, and most desktop browsers.
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.loop = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    // Force-load (some browsers defer when source is added declaratively).
    try {
      v.load();
    } catch {
      /* noop */
    }

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // Autoplay rejected. We'll retry on the next user interaction.
        });
      }
    };

    const markReady = () => setVideoReady(true);

    // Attempt to play as soon as any usable readiness event fires.
    const onLoadedMetadata = () => tryPlay();
    const onLoadedData = () => {
      markReady();
      tryPlay();
    };
    const onCanPlay = () => {
      markReady();
      tryPlay();
    };
    const onPlaying = () => markReady();

    // Some browsers occasionally pause looping videos when tabs change or
    // when memory pressure kicks in. Resume automatically.
    const onPause = () => {
      if (!v.ended) tryPlay();
    };
    const onEnded = () => tryPlay();
    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };

    // Last-resort fallback: if the browser blocks autoplay entirely
    // (some strict mobile data-saver modes), kick playback off on the
    // first user interaction anywhere on the page.
    const onFirstInteraction = () => {
      tryPlay();
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
    };

    v.addEventListener("loadedmetadata", onLoadedMetadata);
    v.addEventListener("loadeddata", onLoadedData);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("touchstart", onFirstInteraction, { passive: true });
    window.addEventListener("click", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    window.addEventListener("scroll", onFirstInteraction, { passive: true });

    // If the video is already buffered enough, play immediately.
    if (v.readyState >= 2) {
      markReady();
      tryPlay();
    } else {
      tryPlay();
    }

    return () => {
      v.removeEventListener("loadedmetadata", onLoadedMetadata);
      v.removeEventListener("loadeddata", onLoadedData);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden text-ink min-h-[100svh] flex items-center bg-fume"
    >
      {/* Fallback gradient — visible immediately while video buffers, and as
          a permanent fallback if autoplay is blocked or the file can't load. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #142318 0%, #0A0C0A 55%, #060706 100%)",
        }}
      />

      {/* Video background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover -z-20 transition-opacity duration-700 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        loop
        muted
        playsInline
        x-webkit-airplay="deny"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        poster=""
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/assets/video/landing-bg.mp4" type="video/mp4" />
      </video>

      {/* Fume-black wash overlay — kept heavy so legacy branding in the
          background video is not legible under the rebrand. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,7,6,0.97) 0%, rgba(6,7,6,0.95) 30%, rgba(6,7,6,0.99) 100%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 25%, rgba(116,195,52,0.18), transparent 55%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(155,232,74,0.04) 0px, rgba(155,232,74,0.04) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(155,232,74,0.04) 0px, rgba(155,232,74,0.04) 1px, transparent 1px, transparent 40px)",
        }}
      />
      <div className="absolute inset-0 -z-10 grain pointer-events-none" />

      {/* Content */}
      <div className="container-wide relative pt-32 sm:pt-40 pb-20 w-full">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple/30 bg-purple/10 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-purple-light">
              <Circle className="h-2 w-2 fill-success text-success animate-pulse-soft" />
              Open now · 24/7 in Midrand
            </div>

            <p className="mt-6 font-display text-sm uppercase tracking-[0.35em] text-muted">
              Cook. Weigh. Sell.
            </p>

            <h1 className="mt-3 font-display uppercase text-[44px] sm:text-[62px] lg:text-[78px] leading-[0.95] font-bold tracking-tight text-ink text-balance">
              The Science of
              <br />
              <span className="text-purple text-glow">A Better High.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg text-ink/75 leading-relaxed">
              Lab-graded flower, named like elements. Every strain gets its own
              tile on the table.
              <span className="block mt-1 font-mono text-sm text-muted">
                Members only · 18+ · Open 24/7.
              </span>
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="min-w-[200px]">
                <a href={JOIN_URL}>Browse The Table →</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="min-w-[180px]"
              >
                <a href={LOGIN_URL}>Member Log In</a>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6 font-mono text-[13px] text-muted">
              <div>
                <p className="text-ink font-semibold">24/7</p>
                <p>Delivery</p>
              </div>
              <div className="h-8 w-px bg-line" />
              <div>
                <p className="text-ink font-semibold">Midrand</p>
                <p>Members only</p>
              </div>
              <div className="h-8 w-px bg-line" />
              <div>
                <p className="text-ink font-semibold">Free</p>
                <p>To join</p>
              </div>
            </div>
          </div>

          {/* Periodic-tile motif — the house element */}
          <div className="hidden lg:flex justify-center animate-fade-in">
            <div className="element-tile glow-toxic h-64 w-64 p-6">
              <div className="flex items-start justify-between font-mono text-sm text-muted">
                <span>420</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-display text-8xl font-bold leading-none text-purple text-glow">
                  Bu
                </span>
              </div>
              <div className="font-display text-2xl uppercase tracking-wide text-ink">
                Budium
                <span className="mt-1 block font-mono text-xs normal-case tracking-normal text-muted">
                  House strain · THC 24.6%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#how-it-works"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-muted hover:text-purple animate-pulse-soft"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-7 w-7" />
      </a>
    </section>
  );
}
