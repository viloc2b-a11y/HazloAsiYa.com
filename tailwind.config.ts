import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:    { DEFAULT: '#08213A', 2: '#0D2A42', light: '#1a3a52' },
        green:   { DEFAULT: '#0A9E52', dark: '#087A3F', light: '#0EC96A', xl: '#4ade80' },
        gold:    { DEFAULT: '#C07A0C', light: '#D4920E', xl: '#F5B800' },
        cream:   { DEFAULT: '#F5F1EB', 2: '#EDE8E0' },
        teal:    { DEFAULT: '#12A493', light: '#15BFA8', xl: '#7AEADB' },
      },
      fontFamily: {
        serif: ['var(--font-dm-serif)', 'Georgia', 'serif'],
        sans:  ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up':  'fadeUp .5s ease both',
        'pop-in':   'popIn .4s cubic-bezier(.34,1.56,.64,1) both',
        'slide-in': 'slideIn .3s ease both',
        'pulse-teal': 'pulseTeal 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'none' } },
        popIn:   { from: { opacity: '0', transform: 'scale(.85)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-12px)' }, to: { opacity: '1', transform: 'none' } },
        pulseTeal: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(18, 164, 147, 0.45)' },
          '50%': { boxShadow: '0 0 0 14px rgba(18, 164, 147, 0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
