/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Make sure your index.html is properly included
    "./src/**/*.{js,ts,jsx,tsx}", // Ensures all JS/TS/JSX/TSX files in src are included for purging
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // Removed line-clamp plugin as requested
  ],
}
