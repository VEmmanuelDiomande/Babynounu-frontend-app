/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        love: ["League Spartan", "sans-serif"],
        anton: ["League Spartan", "sans-serif"],
      },
      fontSize: {
        xr: [
          "10px",
          {
            lineHeight: "12px",
            letterSpacing: "-0.03em",
          },
        ],
        xs: [
          "12px",
          {
            lineHeight: "14px",
            letterSpacing: "-0.03em",
          },
        ],
        sm: [
          "14px",
          {
            lineHeight: "16px",
            letterSpacing: "-0.03em",
          },
        ],
        base: [
          "16px",
          {
            lineHeight: "18px",
            letterSpacing: "-0.03em",
          },
        ],
        ng: [
          "18px",
          {
            lineHeight: "22px",
            letterSpacing: "-0.03em",
          },
        ],
        lg: [
          "20px",
          {
            lineHeight: "22px",
            letterSpacing: "-0.03em",
          },
        ],
        xl: [
          "24px",
          {
            lineHeight: "26px",
            letterSpacing: "-0.03em",
          },
        ],
        "2xl": [
          "28px",
          {
            lineHeight: "32px",
            letterSpacing: "-0.03em",
          },
        ],
        "3xl": [
          "32px",
          {
            lineHeight: "36px",
            letterSpacing: "-0.03em",
          },
        ],
        desc: [
          "15.5px",
          {
            lineHeight: "18px",
            letterSpacing: "-0.03em",
          },
        ],
        label: [
          "14px",
          {
            lineHeight: "16px",
            letterSpacing: "-0.06em",
          },
        ],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#ffffff",
        tahiti: {
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        primary: "#F77C3D",
        secondary: "#55c4bd",
        indigos: "#6574cd",
      },
    },
  },
  plugins: [],
};
