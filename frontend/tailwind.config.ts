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
          light: "#F9FAFB",
          dark: "#0B0F19",
          DEFAULT: "#0B0F19",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1A1F2B",
          DEFAULT: "#1A1F2B",
          hoverLight: "#F3F4F6",
          hoverDark: "#1E2532",
        },
        severity: {
          high: "#A36361",     // Muted Red - Critical/High Risk
          med1: "#D3A29D",     // Dusty Pink - Medium/Warning
          med2: "#E8B298",     // Peach - Medium/Warning
          low1: "#9EABA2",     // Sage Green - Low/Safe/Normal
          low2: "#BDD1C5",     // Mint Green - Low/Safe/Normal
        },
        accent: {
          DEFAULT: "#EECC8C",  // Soft Yellow (Interactive/Highlight)
          hover: "#F3D9A5",
          muted: "rgba(238, 204, 140, 0.15)",
        },
        shield: {
          bgDark: "#0B0F19",
          bgLight: "#F9FAFB",
          cardDark: "#1A1F2B",
          cardLight: "#FFFFFF",
          cardHoverDark: "#1E2532",
          cardHoverLight: "#F3F4F6",
          textDark: "#FFFFFF",
          textLight: "#111827",
          textMutedDark: "#9CA3AF",
          textMutedLight: "#6B7280",
          borderDark: "rgba(255, 255, 255, 0.07)",
          borderLight: "rgba(0, 0, 0, 0.08)",
          high: "#A36361",
          medium: "#D3A29D",
          warning: "#E8B298",
          low: "#9EABA2",
          safe: "#BDD1C5",
          accent: "#EECC8C",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        badge: "8px",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.4)",
        cardLight: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        glow: "0 0 15px -3px rgba(238, 204, 140, 0.2)",
        glowRed: "0 0 15px -3px rgba(163, 99, 97, 0.25)",
      }
    },
  },
  plugins: [],
};

export default config;
