import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          light: "#F0F4FF",
          dark: "#030712",
          DEFAULT: "#030712",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#0D1526",
          DEFAULT: "#0D1526",
          hoverLight: "#EBF0FF",
          hoverDark: "#162035",
        },
        navy: {
          50: "#F0F4FF",
          100: "#E0E9FF",
          200: "#C7D8FF",
          300: "#A5BCFF",
          400: "#7B96F5",
          500: "#4F6DE8",
          600: "#3B4FD4",
          700: "#2E3FB8",
          800: "#1E2B7A",
          900: "#0D1526",
          950: "#030712",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        badge: "8px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        cardLight: "0 1px 4px rgba(0, 0, 0, 0.08)",
        glow: "0 0 20px rgba(59, 130, 246, 0.35), 0 0 40px rgba(6, 182, 212, 0.12)",
        glowRed: "0 0 16px rgba(239, 68, 68, 0.3)",
        glowCyan: "0 0 16px rgba(6, 182, 212, 0.3)",
        glowGreen: "0 0 16px rgba(16, 185, 129, 0.3)",
      }
    },
  },
  plugins: [],
};

export default config;
