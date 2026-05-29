/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4361EE",
        secondary: "#374151",
        accent: "#FACC15",
        background: "#F3F4F6",
        text: "#1F2937",
        muted: "#94A3B8",
        accept: "#22C55E",
        reject: "#EF4444",
      },
      fontFamily: {
        sans: ["Vazir", "sans-serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-out forwards",
        indeterminate: "indeterminate-progress 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "indeterminate-progress": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide"), require("tailwind-scrollbar")],
};
