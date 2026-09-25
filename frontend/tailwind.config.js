/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#f8fafc",
          dark: "#0b0e14",
        },
        surface: {
          light: "#ffffff",
          dark: "#121824",
          "light-hover": "#f1f5f9",
          "dark-hover": "#1a2336",
        },
        border: {
          light: "#e2e8f0",
          dark: "#1f293d",
        },
        primary: {
          DEFAULT: "#00f0ff",
          purple: "#8a2be2",
          pink: "#ff007f",
          gold: "#ffd700",
        },
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
        glow: "0 0 20px rgba(0, 240, 255, 0.35)",
        "glow-gold": "0 0 20px rgba(255, 215, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
