import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        /*
         * BREAKING BUD accent — kept under the legacy `purple` key so existing
         * markup keeps compiling. The value is the toxic-green ramp, inverted
         * (50 = darkest lab panel, 900 = brightest) so old light-tint usages
         * read correctly on the dark surface.
         */
        purple: {
          DEFAULT: "#74C334", // toxic green — links, actions, product tiles
          light: "#9BE84A", // reaction — highlights / glow
          dark: "#B4F000", // toxic yield — hero accent, strongest emphasis
          50: "#0F1A0A",
          100: "#16240D",
          200: "#22371A",
          300: "#33501F",
          400: "#5A8F2A",
          500: "#74C334",
          600: "#86D341",
          700: "#9BE84A",
          800: "#B4F000",
          900: "#C9FF4D",
        },
        // Named brand tokens for new markup
        toxic: {
          yield: "#B4F000",
          green: "#74C334",
          reaction: "#9BE84A",
        },
        fume: "#060706",
        panel: "#0E140A",
        glass: "#142318",
        bone: "#E9E7DD",
        gold: "#B4F000", // legacy premium accent -> toxic yield
        background: "#0A0C0A",
        surface: "#0E140A",
        ink: "#E9E7DD",
        muted: "#8A9284",
        line: "#1E2A18",
        success: "#74C334",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-oswald)", "Impact", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        h1: ["52px", { lineHeight: "1.02", fontWeight: "700", letterSpacing: "-0.01em" }],
        h2: ["34px", { lineHeight: "1.08", fontWeight: "700" }],
        h3: ["22px", { lineHeight: "1.25", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "1.4", fontWeight: "500" }],
        button: ["14px", { lineHeight: "1", fontWeight: "600", letterSpacing: "0.06em" }],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
        badge: "6px",
      },
      boxShadow: {
        card: "0 2px 14px rgba(0,0,0,0.5)",
        "card-hover": "0 0 28px rgba(180, 240, 0, 0.16)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-slow": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-slow": "fade-in-slow 1.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
