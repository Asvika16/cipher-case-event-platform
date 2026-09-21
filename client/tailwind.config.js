/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mystery: {
          950: '#070A13',
          900: '#0F172A',
          800: '#1E1B4B',
          700: '#312E81',
          accent: '#6366F1',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          gold: '#F59E0B'
        }
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.35)',
        'glow-blue': '0 0 20px rgba(99, 102, 241, 0.35)',
        'glow-gold': '0 0 25px rgba(245, 158, 11, 0.4)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
