/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#0B1B33',
          900: '#0F2542',
          800: '#143155',
          700: '#1E3A5F',
          600: '#1E40AF',
          500: '#2563EB',
          400: '#3B82F6',
          300: '#60A5FA',
          200: '#93C5FD',
        },
        accent: { 500: '#F59E0B', 400: '#FBBF24' },
        surface: { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(15, 37, 66, 0.12)',
        lift: '0 12px 40px -12px rgba(15, 37, 66, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};