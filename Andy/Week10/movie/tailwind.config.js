/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-pink': '#ff2d55',
        'primary-pink-hover': '#ff1744',
        'primary-pink-dark': '#c9184a',
        'primary-pink-light': '#ff4069',
        'bg-primary': '#000000',
        'bg-secondary': '#1c1c1e',
        'bg-tertiary': '#2c2c2e',
        'bg-elevated': '#3a3a3c',
        'text-primary': '#ffffff',
        'text-secondary': '#ebebf5',
        'text-tertiary': '#aeaeb2',
        'text-quaternary': '#8e8e93',
        'border-color': '#38383a',
      },
      boxShadow: {
        'custom': '0 0 0 4px rgba(255, 45, 85, 0.1)',
        'custom-hover': '0 8px 20px rgba(255, 45, 85, 0.3)',
        'card': '0 12px 24px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
