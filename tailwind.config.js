// tailwind.config.js v1.0
// Design tokens sourced from Stitch export — Luminous Forge (vibrant_light)
// Stitch project: 6986830875527672919
// DO NOT use Electric Azure (blue/cyan) variants

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Luminous Forge surface hierarchy ──────────────────────────────
        // Rule: define depth through tonal shifts, NOT borders
        "surface":                  "#fbf8ff",  // canvas / page bg
        "surface-bright":           "#fbf8ff",
        "surface-dim":              "#dad9e4",
        "surface-container-lowest": "#ffffff",  // most elevated cards
        "surface-container-low":    "#f4f2fe",  // large background zones
        "surface-container":        "#eeecf8",
        "surface-container-high":   "#e9e7f3",  // recessed / inset areas
        "surface-container-highest":"#e3e1ed",
        "surface-variant":          "#e3e1ed",
        "inverse-surface":          "#2f3039",
        "inverse-on-surface":       "#f1effb",

        // ── Primary — Electric Purple ──────────────────────────────────────
        "primary":                  "#7d12ff",
        "on-primary":               "#ffffff",
        "primary-container":        "#8b3dff",
        "on-primary-container":     "#f1ebff",
        "primary-fixed":            "#eaddff",
        "primary-fixed-dim":        "#d2bbff",
        "on-primary-fixed":         "#25005a",
        "on-primary-fixed-variant": "#5a00c6",
        "surface-tint":             "#7d12ff",
        "inverse-primary":          "#d2bbff",

        // ── Secondary — Deep Violet ────────────────────────────────────────
        "secondary":                "#7c4dff",
        "on-secondary":             "#ffffff",
        "secondary-container":      "#b399ff",
        "on-secondary-container":   "#3f1e8c",
        "secondary-fixed":          "#e8ddff",
        "secondary-fixed-dim":      "#cebdff",
        "on-secondary-fixed":       "#21005e",
        "on-secondary-fixed-variant":"#4f319c",

        // ── Tertiary — Amber accent ────────────────────────────────────────
        "tertiary":                 "#7d3d00",
        "on-tertiary":              "#ffffff",
        "tertiary-container":       "#a15100",
        "on-tertiary-container":    "#ffe0cd",
        "tertiary-fixed":           "#ffdcc6",
        "tertiary-fixed-dim":       "#ffb784",
        "on-tertiary-fixed":        "#301400",

        // ── Text / content ─────────────────────────────────────────────────
        "background":               "#fbf8ff",
        "on-background":            "#1a1b23",
        "on-surface":               "#1a1b23",  // near-black — never pure black
        "on-surface-variant":       "#4a4455",

        // ── Borders — Ghost border only, 15% opacity ───────────────────────
        "outline":                  "#7b7487",
        "outline-variant":          "#ccc3d8",  // use at /15 opacity

        // ── Error ──────────────────────────────────────────────────────────
        "error":                    "#ba1a1a",
        "on-error":                 "#ffffff",
        "error-container":          "#ffdad6",
        "on-error-container":       "#93000a",
      },

      fontFamily: {
        // Plus Jakarta Sans — all roles
        sans:      ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        headline:  ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        body:      ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        label:     ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },

      // Luminous Forge rounding scale
      // Rule: live in xl (1.5rem) and full. Small radii feel dated.
      borderRadius: {
        DEFAULT: "0.25rem",
        sm:      "0.375rem",
        md:      "0.5rem",
        lg:      "0.75rem",   // standard card corners
        xl:      "1.5rem",    // hero cards, modals
        "2xl":   "2rem",      // card preview
        full:    "9999px",    // pill buttons, chips
      },

      boxShadow: {
        // Ambient shadow — tinted, never pure black
        card:    "0 32px 48px -12px rgba(26, 27, 35, 0.04)",
        "card-hover": "0 32px 48px -12px rgba(26, 27, 35, 0.12), 0 0 0 1px rgba(125, 18, 255, 0.15)",
        glow:    "0 0 24px rgba(125, 18, 255, 0.35)",
        "glow-sm":"0 4px 16px rgba(125, 18, 255, 0.25)",
        inner:   "inset 0 2px 8px rgba(0,0,0,0.04)",
      },

      transitionTimingFunction: {
        // Standard Deceleration — Luminous Forge motion spec
        // Do NOT use bounce/spring
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      transitionDuration: {
        standard: "200ms",
      },
    },
  },
  plugins: [],
};
