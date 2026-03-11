/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography"

export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [typography]/**För markdown struktur*/,
}

