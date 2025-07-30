/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#ffe5e7", // soft blush
          100: "#ffccd2",
          200: "#ff99a4",
          300: "#ff6f81",
          400: "#ff4d6b",
          500: "#ff2c5a", // main extracted
          600: "#e0204c",
          700: "#c41643",
          800: "#a10e38",
          900: "#7e082d",
          950: "#4e031a",
        },
        secondary: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899", // Main secondary color
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
          950: "#500724",
        },
      },
     
    },
  },
  plugins: [],
});
