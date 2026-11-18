/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parakh: {
          bg: "var(--parakh-bg)",
          card: "var(--parakh-card)",
          cardHover: "var(--parakh-card-hover)",
          border: "var(--parakh-border)",
          blue: "var(--parakh-primary)",
          primary: "var(--parakh-primary)",
          primaryHover: "var(--parakh-primary-hover)",
          dark: "var(--parakh-text)",
          text: "var(--parakh-text)",
          muted: "var(--parakh-muted)",
          success: "var(--parakh-success)",
          warning: "var(--parakh-warning)",
          danger: "var(--parakh-danger)",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
