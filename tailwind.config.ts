import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F8F5EF",
          dark: "#F1EDE4",
          darkest: "#EAE4D8",
        },
        card: "#FEFCF8",
        ink: {
          DEFAULT: "#1A1714",
          body: "#3C3830",
          secondary: "#6E6860",
          muted: "#A09890",
        },
        border: "#E2DDD4",
        accent: {
          DEFAULT: "#5B4FD6",
          light: "#EEEDFB",
        },
        teal: "#0A8A7F",
        gold: "#C5872A",
        success: "#16A34A",
        sky: "#1E8FE1",
      },
      fontFamily: {
        serif: ["'Fraunces'", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tight: "-.03em",
        tighter: "-.04em",
        tightest: "-.05em",
      },
      borderRadius: {
        pill: "100px",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
