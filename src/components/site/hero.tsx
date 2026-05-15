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
      className="relative isolate overflow-hidden text-white min-h-[100svh] flex items-center bg-purple-900"
    >
      {/* Fallback gradient — visible immediately while video buffers, and as
          a permanent fallback if autoplay is blocked or the file can't load. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, #4A2A8C 0%, #2A1463 55%, #170A3A 100%)",
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

      {/* Purple wash overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(61,31,138,0.55) 0%, rgba(61,31,138,0.35) 30%, rgba(61,31,138,0.7) 100%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(155,114,232,0.25), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 -z-10 grain pointer-events-none" />

      {/* Content */}
      <div className="container-wide relative pt-32 sm:pt-40 pb-20 w-full">
        <div className="max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-md px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white/90">
            <Circle className="h-2 w-2 fill-success text-success animate-pulse-soft" />
            Open now · 24/7 delivery
          </div>

          <h1 className="mt-6 font-display text-[44px] sm:text-[60px] lg:text-[76px] leading-[1.02] font-bold tracking-tight text-white text-balance">
            Above The Rest.
            <br />
            <span className="text-gradient-purple bg-gradient-to-r from-white via-purple-200 to-purple-light bg-clip-text text-transparent">
              Delivered 24/7.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed">
            Stellenbosch&apos;s exclusive private members club. Premium cannabis,
            curated and delivered with care.
            <span className="block mt-1 text-white/60 italic">
              Not in your face. But in your space.
            </span>
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className="bg-white text-purple-dark hover:bg-white/95 hover:text-purple-dark min-w-[180px]"
            >
              <a href={JOIN_URL}>Join Free</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="border border-white/30 bg-white/5 backdrop-blur text-white hover:bg-white/10 hover:text-white hover:border-white/50 min-w-[180px]"
            >
              <a href={LOGIN_URL}>Member Log In</a>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-6 text-[13px] text-white/60">
            <div>
              <p className="text-white/90 font-semibold">24/7</p>
              <p>Delivery</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-white/90 font-semibold">Stellenbosch</p>
              <p>Members only</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-white/90 font-semibold">Free</p>
              <p>To join</p>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#how-it-works"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-white/60 hover:text-white animate-pulse-soft"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-7 w-7" />
      </a>
    </section>
  );
}
