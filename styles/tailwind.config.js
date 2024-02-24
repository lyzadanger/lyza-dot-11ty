const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

// These are from https://uicolors.app/create based on the DEFAULT
const customColors = {
  pank: {
    50: "#fff0f7",
    100: "#ffe4f2",
    200: "#ffc9e7",
    300: "#ff9dd1",
    400: "#ff60b0",
    500: "#ff3190",
    600: "#e60a62",
    DEFAULT: "#e60a62",
    700: "#d6004f",
    800: "#b00441",
    900: "#92093a",
    950: "#5a001e",
  },
};

module.exports = {
  content: ["_site/**/*.{html,md,njk}"],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: colors.stone["800"],
      },
      borderWidth: {
        3: "3px",
        10: "10px",
      },
      colors: {
        ...customColors,
        grey: colors.stone,
        blue: colors.sky,
      },
      fontFamily: {
        body: ["'Georgia'", "'Times New Roman'", "serif"],
        title: ["'Playfair Display SC'", "'Times New Roman'", "serif"],
        display: [
          '"Playfair Display"',
          "Georgia",
          "'Times New Roman'",
          "ui-serif",
        ],
        smallcaps: ["'Playfair Display SC'", "'Times New Roman'", "serif"],
      },
      screens: {
        xs: "480px",
        ...defaultTheme.screens,
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: colors.sky["800"],
              transitionProperty: "color",
              transitionDuration: "150ms",
              "&:hover": {
                color: customColors.pank.DEFAULT,
              },
            },
            // Remove literal quotation marks and backticks from blockquote, code
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
            "code ::before": { content: "none" },
            "code ::after": { content: "none" },
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
