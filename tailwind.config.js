/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      zIndex: {
        '60': '60',
        '999': '999',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.1)'
      },
      clipPath: {
        'card': 'polygon(0% 0%, 85% 0%, 100% 15%, 0% 800%)',
      },
    },
  },
  plugins: [],
}