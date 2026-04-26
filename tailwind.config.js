/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: '#e0f2fe',
          green: '#dcfce7',
          pink: '#fce7f3',
          purple: '#f3e8ff',
          yellow: '#fef08a'
        }
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)' },
        }
      }
    },
  },
  plugins: [],
}
