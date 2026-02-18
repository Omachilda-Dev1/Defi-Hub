/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FDB813',
        'primary-dark': '#E5A50B',
        secondary: '#000000',
        accent: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
