import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
         * BREAKING BUD accent — the toxic-green ramp, kept under the legacy
         * `purple` key so existing markup keeps compiling. Values are driven by
         * CSS variables (see globals.css) so every token swaps between the
         * light ("lab paper") and dark ("fume lab") palettes automatically.
         */
        purple: {
          DEFAULT: "rgb(var(--purple) / <alpha-value>)", // links, actions, tile symbol
          light: "rgb(var(--purple-light) / <alpha-value>)", // highlights / glow
          dark: "rgb(var(--purple-dark) / <alpha-value>)", // strongest emphasis / hover
          50: "rgb(var(--purple-50) / <alpha-value>)",
          100: "rgb(var(--purple-100) / <alpha-value>)",
          200: "rgb(var(--purple-200) / <alpha-value>)",
          300: "rgb(var(--purple-300) / <alpha-value>)",
          400: "rgb(var(--purple-400) / <alpha-value>)",
          500: "rgb(var(--purple-500) / <alpha-value>)",
          600: "rgb(var(--purple-600) / <alpha-value>)",
          700: "rgb(var(--purple-700) / <alpha-value>)",
          800: "rgb(var(--purple-800) / <alpha-value>)",
          900: "rgb(var(--purple-900) / <alpha-value>)",
        },
        // Named brand tokens for new markup
        toxic: {
          yield: "rgb(var(--toxic-yield) / <alpha-value>)",
          green: "rgb(var(--toxic-green) / <alpha-value>)",
          reaction: "rgb(var(--toxic-reaction) / <alpha-value>)",
        },
        fume: "rgb(var(--fume) / <alpha-value>)", // constant: always-dark panels
        panel: "rgb(var(--panel) / <alpha-value>)",
        glass: "rgb(var(--glass) / <alpha-value>)",
        bone: "rgb(var(--bone) / <alpha-value>)", // constant: light text on dark
        gold: "rgb(var(--gold) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
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
