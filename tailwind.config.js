/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0D1117',
        paper: '#F4F2EE', 
        gold: '#C7A358',
        petrol: '#2C4B63',
        sage: '#6C8A6E',
      },
      borderRadius: { 
        xl: '1rem', 
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'inter': ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
} 