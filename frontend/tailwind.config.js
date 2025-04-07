/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#374151",
        accent: "#FACC15",
        background: "#F3F4F6",
        text: "#1F2937",
        muted: "#9CA3AF",
        accept: "#22C55E",
        reject: "#EF4444",
      },
      fontFamily: {
        sans: ["Vazir", "sans-serif"],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};
