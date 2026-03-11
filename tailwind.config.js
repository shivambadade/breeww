/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        casino: {
          dark: '#0B0F2A',
          card: '#141A3C',
          accent: '#6366f1', // Indigo-500 equivalent
          gold: '#FFD700',
        }
      }
    },
  },
  plugins: [],
}

