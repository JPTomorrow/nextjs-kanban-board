/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fff",
        "primary-2": "#310d0d",
        secondary: "#000",
        "secondary-2": "#ffeac3",
      },
    },
  },
  plugins: [],
};
