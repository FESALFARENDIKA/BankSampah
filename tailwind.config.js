/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#f0fdf4', // Softest green (very light mint/lime)
          900: '#dcfce7', // Fresh light green
          850: '#f6fdf9', // Clean light green background
          800: '#ffffff', // White cards
          700: '#bbf7d0', // Pastel green borders
          600: '#86efac', // Soft active highlights
          500: '#22c55e', // Brand young green (hijau muda cerah)
          400: '#16a34a', // Darker young green
          300: '#15803d', // Forest green accent
        },
        slate: {
          50: '#f8fafc',
          100: '#0f172a', // Headings
          200: '#1e293b', // Body
          300: '#334155',
          400: '#475569', // Medium gray
          500: '#64748b',
          600: '#cbd5e1', // Light borders
          700: '#e2e8f0',
          800: '#f1f5f9',
          900: '#f8fafc',
        },
        emerald: {
          DEFAULT: '#22c55e',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
