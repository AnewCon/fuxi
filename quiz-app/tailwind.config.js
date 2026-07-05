/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a5f',
          light: '#2a5080',
          dark: '#152a45',
        },
        accent: {
          DEFAULT: '#d4af37',
          light: '#e0c060',
          dark: '#b8952e',
        },
      },
      fontFamily: {
        sans: ['"Microsoft YaHei"', '"Source Han Sans SC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
