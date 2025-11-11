/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a2e',
        secondary: '#16213e',
        accent: '#ff6b6b',
        success: '#51cf66',
        warning: '#ffd43b',
        error: '#ff6b6b',
        info: '#4dabf7'
      },
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      animation: {
        'bounce-soft': 'bounce-soft 0.6s ease-out',
        'pulse-soft': 'pulse-soft 1s ease-out'
      },
      keyframes: {
        'bounce-soft': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' }
        },
        'pulse-soft': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.1)',
        'elevated': '0 4px 16px rgba(0,0,0,0.15)'
      }
    },
  },
  plugins: [],
}