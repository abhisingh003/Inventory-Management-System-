/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 25px 60px rgba(15, 23, 42, 0.12)",
      },
      backgroundImage: {
        gradientGlare: "radial-gradient(circle at top, rgba(99, 102, 241, 0.18), transparent 35%)",
      },
    },
  },
  plugins: [],
};
