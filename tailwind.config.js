/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        /* Surfaces — mirror :root in src/index.css */
        canvas: "var(--color-base)",
        surface: "var(--color-surface)",
        panel: "var(--color-panel)",
        raised: "var(--color-raised)",
        elevated: "var(--color-elevated)",
        edge: "var(--color-border)",
        "edge-bright": "var(--color-border-bright)",
        /* Text */
        ink: "var(--color-text-primary)",
        "ink-secondary": "var(--color-text-secondary)",
        "ink-muted": "var(--color-text-muted)",
        "ink-faint": "var(--color-text-faint)",
        /* Amber system */
        amber: {
          DEFAULT: "var(--color-amber)",
          hover: "var(--color-amber-hover)",
          active: "var(--color-amber-active)",
          dim: "var(--color-amber-dim)",
          muted: "var(--color-amber-muted)",
          subtle: "var(--color-amber-subtle)",
        },
        /* Status */
        positive: "var(--color-green)",
        caution: "var(--color-yellow)",
        negative: "var(--color-red)",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["var(--text-2xs)", { lineHeight: "var(--leading-tight)" }],
        xs: ["var(--text-xs)", { lineHeight: "var(--leading-snug)" }],
        sm: ["var(--text-sm)", { lineHeight: "var(--leading-normal)" }],
        md: ["var(--text-md)", { lineHeight: "var(--leading-normal)" }],
        base: ["var(--text-base)", { lineHeight: "var(--leading-normal)" }],
        lg: ["var(--text-lg)", { lineHeight: "var(--leading-snug)" }],
        xl: ["var(--text-xl)", { lineHeight: "var(--leading-snug)" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "var(--leading-tight)" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "var(--leading-tight)" }],
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      transitionDuration: {
        instant: "75ms",
        fast: "120ms",
        normal: "180ms",
        slow: "260ms",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.33, 1, 0.68, 1)",
        "in-out-soft": "cubic-bezier(0.45, 0, 0.55, 1)",
      },
      boxShadow: {
        ring: "var(--focus-ring)",
        /* Subtle elevation — no colored glow */
        lift: "0 1px 0 rgba(255,255,255,0.04) inset, 0 1px 2px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
