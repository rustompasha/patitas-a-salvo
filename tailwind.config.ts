import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens carried over from the Patitas a Salvo prototype
        sand: {
          DEFAULT: '#D8CFBE',
          50: '#F8F3EA',
          100: '#F1EADE',
          200: '#EBE2D2',
          300: '#E7DECE',
        },
        forest: {
          DEFAULT: '#1F4D3A',
          dark: '#1A2620',
        },
        ember: {
          DEFAULT: '#FF6B2C',
          dark: '#C2410C',
        },
        ink: '#1F2933',
        muted: '#6B7280',
        faint: '#9AA3AD',
        lost: '#D62828',
        found: '#1F4D3A',
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
