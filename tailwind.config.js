/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        base:    "#08090C",
        surface: "#0F1117",
        panel:   "#141720",
        border:  "#1E2232",
        // Accent
        amber:   "#F5A623",
        "amber-dim": "#B87A1A",
        // Status
        green:   "#22C55E",
        yellow:  "#EAB308",
        red:     "#EF4444",
        // Text
        "text-primary":  "#E8EAF0",
        "text-muted":    "#5A6070",
        "text-faint":    "#2E3344",
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', "monospace"],
        sans: ['"IBM Plex Sans"', "sans-serif"],
      },
      boxShadow: {
        "glow-amber": "0 0 20px rgba(245,166,35,0.15)",
        "glow-green": "0 0 20px rgba(34,197,94,0.12)",
      },
    },
  },
  plugins: [],
};