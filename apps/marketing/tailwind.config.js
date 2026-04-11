/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,tsx,json}", "../simple-table-marketing-api/src/blogs/**/*.json"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        nav: "1140px",
      },
    },
  },
  plugins: [],
};
