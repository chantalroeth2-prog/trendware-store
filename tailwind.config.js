/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdfbf7",
          100: "#f7f2ea",
          200: "#eee3d3",
          300: "#e2ceb8",
          400: "#d5b597",
          500: "#d4a373",
          600: "#bc8a5f",
          700: "#a1714a",
          800: "#865837",
          900: "#4a2d1d",
        },
        accent: {
          100: "#fceade",
          200: "#f8d5c2",
          300: "#f4ac8e",
          400: "#ee876b",
          500: "#e76f51",
          600: "#d45638",
        },
        rose: {
          50: "#fff8f6",
          100: "#fceade",
          200: "#f8d2c2",
          300: "#f4a88f",
        },
        surface: {
          900: "#fdfbf7",
          800: "#f7f2ea",
          700: "#fceade",
          600: "#f4ece1",
          500: "#e8dac9",
        },
      },
      fontFamily: {
        display: ["var(--font-comfortaa)", "sans-serif"],
      },
      borderRadius: {
        boutique: "24px",
        "3xl": "24px",
        "4xl": "32px",
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
