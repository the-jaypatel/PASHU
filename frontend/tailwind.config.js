/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1F4D3A',
          dark: '#163A2C',
          light: '#2E6B51',
        },
        sage: {
          DEFAULT: '#A8B5A2',
          light: '#D3DBCC',
          dark: '#7E8D78',
        },
        cream: {
          DEFAULT: '#F6F3EA',
          dark: '#EDE8DA',
        },
        earth: {
          DEFAULT: '#8A6847',
          light: '#A98A68',
        },
        ink: {
          DEFAULT: '#252825',
          soft: '#4B4F4A',
          muted: '#6E736E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(37, 40, 37, 0.05), 0 4px 16px rgba(37, 40, 37, 0.06)',
        cardhover: '0 2px 4px rgba(37, 40, 37, 0.06), 0 10px 28px rgba(37, 40, 37, 0.10)',
        float: '0 8px 30px rgba(22, 58, 44, 0.18)',
      },
      maxWidth: {
        page: '76rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scan-sweep': {
          '0%': { top: '0%' },
          '100%': { top: 'calc(100% - 3px)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'scan-sweep': 'scan-sweep 2.6s ease-in-out infinite alternate',
        'pulse-dot': 'pulse-dot 1.6s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
}
