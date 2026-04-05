/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          500: '#10b981',
          600: '#059669',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'marquee': 'marquee 30s linear infinite',
        'pulse-neon': 'pulseNeon 2s infinite ease-in-out',
        'glow-green': 'glowGreen 3s infinite',
      },
      keyframes: {
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' },
        },
        glowGreen: {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.3))' },
          '50%': { filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.6))' },
        }
      }
    },
  },
  plugins: [],
}
