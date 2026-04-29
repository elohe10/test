import type { Config } from "tailwindcss";

// ─────────────────────────────────────────────────────────────
// BRAND COLORS — change these to update the entire site palette
// ─────────────────────────────────────────────────────────────
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color — warm espresso brown
        brand: {
          DEFAULT: "#6B3F1F",
          light: "#A0522D",
          dark: "#3E1F0A",
        },
        // Accent — warm golden amber
        accent: {
          DEFAULT: "#D4A853",
          light: "#F0C87A",
          dark: "#A07830",
        },
        // Cream — used for backgrounds
        cream: {
          DEFAULT: "#FAF6F0",
          dark: "#F0E8DC",
        },
        // Dark — used for text and dark sections
        dark: {
          DEFAULT: "#1A1008",
          card: "#2A1A0E",
        },
      },
      fontFamily: {
        // Serif for headings — gives a premium cafe feel
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        // Sans for body text
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        scroll: "scroll 30s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
