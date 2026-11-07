/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          500: '#0284c7',
          600: '#026aa7',
          700: '#035388',
          800: '#0b3c5d',
          900: '#0f2b42',
        }
      }
    },
  },
  plugins: [],
}
