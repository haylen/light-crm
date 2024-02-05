/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './node_modules/tailwind-datepicker-react/dist/**/*.js' /* Styles for the datepicker */,
  ],
  daisyui: {
    themes: ['light', 'dark'],
  },
  darkMode: ['class', '[data-theme="dark"]'],
  plugins: [require('daisyui')],
  theme: {
    extend: {},
  },
};
