/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parakh: {
          blue: "#1d4ed8", // royal blue primary actions
          dark: "#0f172a", // dark navy text
          bg: "#f1f5f9",   // light blue-gray background
          card: "#ffffff", // clean white cards
          border: "#e2e8f0",
          success: "#16a34a",
          warning: "#d97706",
          danger: "#dc2626",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
