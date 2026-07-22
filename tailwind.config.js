/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./*.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#ff6b35',
          pink: '#ff4b8b',
          cyan: '#00f5ff',
          darkBg: '#09090b',
          panelBg: '#121215',
          border: 'rgba(255, 255, 255, 0.08)'
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['monospace', 'Courier New', 'Courier']
      }
    }
  },
  plugins: [],
}
