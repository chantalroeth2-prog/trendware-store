/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff9f5",
          100: "#fef3ec",
          200: "#fde2d7",
          300: "#f9c6b8",
          400: "#f29e8b",
          500: "#d4a373",
          600: "#bc8a5f",
          700: "#a1714a",
          800: "#865837",
          900: "#4a2d1d",
        },
        accent: {
          400: "#f2cc8f",
          500: "#e07a5f",
          600: "#d16244",
        },
        surface: {
          900: "#fdfbf7",
          800: "#f8f3eb",
          700: "#f2eada",
          600: "#e7dbcb",
          500: "#d8c7b4",
        },
      },
      fontFamily: {
        display: ["var(--font-comfortaa)", "sans-serif"],
      },
      borderRadius: {
        boutique: "24px",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in-up-delay": "fade-in-up 0.6s ease-out 0.15s forwards",
        "fade-in-up-delay-2": "fade-in-up 0.6s ease-out 0.3s forwards",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        ticker: "ticker 30s linear infinite",
      },
    },
  },
  plugins: [],
};
