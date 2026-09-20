import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2EC4B6",
        primaryLight: "#CBF3F0",

        background: "#FFFFFF",

        warning: "#FFBF69",
        danger: "#FF9F1C",

        text: {
            primary: "#12302D",
            secondary: "#52706C",
        },
      },
    },
  },
  plugins: [],
};

export default config;
