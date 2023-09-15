/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        acred: {
          50: "#FBE3E2",
          100: "#F6C7C4",
          200: "#F2ABA7",
          300: "#ED9089",
          400: "#E9746C",
          500: "#E4584E",
          600: "#df2111",
          700: "#A82D25",
          800: "#701E19",
          900: "#380F0C",
        },
      },
    },
  },
  plugins: [],
}