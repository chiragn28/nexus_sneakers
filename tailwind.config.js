/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /**
         * "Nexus Orange" — the single signature accent, identical in both themes.
         * `nexus.DEFAULT` (#FF4D00) is the fill colour: always pair it with BLACK
         * text (6.3:1) — white on it only clears 3.3:1.
         * `nexus.text` (#D93C00) is the accent colour for TEXT on light surfaces
         * (4.6:1 on white). On dark surfaces use `nexus.DEFAULT` directly.
         */
        nexus: {
          DEFAULT: '#FF4D00',
          text: '#D93C00',
          50: '#FFF3ED',
          100: '#FFE1D1',
          200: '#FFC0A3',
          300: '#FF9968',
          400: '#FF7433',
          500: '#FF4D00',
          600: '#E04300',
          700: '#B83700',
          800: '#8A2900',
          900: '#571A00',
        },
        /** Neutral ramp — warm-ish black so the orange doesn't look plastic. */
        ink: {
          50: '#F7F7F6',
          100: '#EDEDEB',
          200: '#DBDBD7',
          300: '#B9B9B3',
          400: '#8A8A84',
          500: '#5F5F5A',
          600: '#454541',
          700: '#2E2E2B',
          800: '#1C1C1A',
          900: '#121211',
          950: '#0A0A09',
        },
      },
      fontFamily: {
        display: ['"Archivo Black"', '"Bebas Neue"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      transitionDuration: {
        250: '250ms',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
        'pulse-ring': 'pulse-ring 700ms ease-out',
      },
    },
  },
  plugins: [],
};
