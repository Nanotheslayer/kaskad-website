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
          'red-light': '#f9d4d6',
          'red-dark': '#c41920',
          dark: '#343436',
          black: '#1a1b23',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f5f5f0',
          hover: '#fafaf5',
        },
        urgency: {
          crisis: '#dc2626',
          urgent: '#d97706',
          planned: '#16a34a',
        },
        awareness: {
          low: '#ef4444',
          mid: '#f59e0b',
          high: '#22c55e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
