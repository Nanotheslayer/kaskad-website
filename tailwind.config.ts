import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#ffcb05',
          'yellow-light': '#fff4cc',
          'yellow-dark': '#e6b800',
          red: '#ed1b24',
          'red-light': '#fde7e8',
          'red-dark': '#c41920',
          dark: '#1f2430',
          black: '#161a23',
        },
        ink: {
          DEFAULT: '#1f2430',
          soft: '#4b5263',
          muted: '#7b8294',
        },
        page: '#f1f2f6',
        // Пастельная палитра — цветовые акценты интерфейса
        tint: {
          sun: '#fff1b8',
          mint: '#d6f0e0',
          rose: '#fcdcd6',
          lilac: '#e6defc',
          sky: '#d5e9fb',
          peach: '#ffe3c8',
        },
        accent: {
          sun: '#b98900',
          mint: '#1d8a4a',
          rose: '#d4452f',
          lilac: '#6a4ccb',
          sky: '#1c6fc2',
          peach: '#d9631a',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Rubik', 'Roboto', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(31,36,48,0.04), 0 4px 16px rgba(31,36,48,0.04)',
        lift: '0 8px 28px rgba(31,36,48,0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config
