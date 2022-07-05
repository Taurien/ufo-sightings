/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // => @media (max-width: 639px) { ... }
      // 'sm': {'max': '639px'},
      'mobile': {'max': '769px'},
      // => @media (min-width: px) { ... }
      'desktop': '768px',
    },
    extend: {},
  },
  plugins: [],
}
