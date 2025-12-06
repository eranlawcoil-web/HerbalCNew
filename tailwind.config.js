/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Heebo', 'sans-serif'],
        serif: ['Heebo', 'sans-serif'], 
      },
      colors: {
        earth: {
          950: '#0d0f0d',
          900: '#1a1d1a',
          800: '#262a26',
          700: '#384038',
          accent: '#d4a373',
        },
        nature: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          800: '#1f2937',
          900: '#111827',
          sage: '#84a98c',
          darkSage: '#52796f',
          lightSage: '#cad2c5'
        }
      }
    },
  },
  plugins: [],
}