/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'league': {
          'bg-primary': '#0A0E1A',
          'bg-secondary': '#0A1428',
          'gold': '#F0E6D2',
          'gold-dark': '#C89B3C',
          'blue': '#0596AA',
          'blue-light': '#0AC8B9',
          'text-primary': '#CDBE91',
          'text-secondary': '#A09B8C'
        }
      },
      animation: {
        'pulse-blue': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}