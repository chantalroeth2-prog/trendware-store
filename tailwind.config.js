/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef8f4",
          100: "#fceee4",
          200: "#f8d8c4",
          300: "#f0c4a8",
          400: "#e8a87c",
          500: "#c87f5a",
          600: "#b06a48",
          700: "#955838",
          800: "#7d4830",
          900: "#653a28",
        },
        accent: {
          400: "#e8a87c",
          500: "#c87f5a",
          600: "#b06a48",
        },
        teal: {
          900: "#152e2d",
          800: "#1e3f3d",
          700: "#2a5653",
          600: "#377069",
          500: "#4a8a82",
          400: "#6ba69e",
        },
        surface: {
          900: "#faf5ef",
          800: "#f5efe8",
          700: "#ede5db",
          600: "#e3d9cd",
          500: "#d5cbbe",
        },
      },
      fontFamily: {
        display: ["var(--font-comfortaa)", "sans-serif"],
      },
      borderRadius: {
        boutique: "16px",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(100%)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in-up-delay": "fade-in-up 0.6s ease-out 0.15s forwards",
        "fade-in-up-delay-2": "fade-in-up 0.6s ease-out 0.3s forwards",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 10s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        ticker: "ticker 30s linear infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
        "slide-out-right": "slide-out-right 0.3s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
