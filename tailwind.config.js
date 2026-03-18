/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'off-white': '#FAF9F6',
        'blush': '#FFD5CD',
        'dusty-rose': '#D4A5A5',
        'muted-mauve': '#9B7E8C',
        'wine': '#6B4C5C',
        'burgundy': '#4A3542',
      },
      backgroundImage: {
        'gradient-rose': 'linear-gradient(135deg, #FFD5CD 0%, #D4A5A5 50%, #9B7E8C 100%)',
        'gradient-mauve': 'linear-gradient(135deg, #9B7E8C 0%, #6B4C5C 50%, #4A3542 100%)',
        'gradient-soft': 'linear-gradient(135deg, #FAF9F6 0%, #FFD5CD 25%, #D4A5A5 75%, #9B7E8C 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(107, 76, 92, 0.15)',
        'glass-lg': '0 12px 40px 0 rgba(107, 76, 92, 0.2)',
        'float': '0 20px 60px -15px rgba(107, 76, 92, 0.3)',
        'inner-glass': 'inset 0 2px 8px 0 rgba(255, 255, 255, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
