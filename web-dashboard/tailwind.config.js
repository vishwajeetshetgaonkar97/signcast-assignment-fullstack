/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["poppins", "sans-serif"],
      },
      colors: {
        "bg-color": "rgb(var(--background))",
        "text-color": "rgb(var(--text))",
        "border-color": "rgb(var(--border))",
        "card-color": "rgb(var(--card))",
        "card-text-color": "rgb(var(--card-text))",
       "section-color": "rgb(var(--section))",
      },
    },
  },
  plugins: [],
  darkMode: "media", 
};
