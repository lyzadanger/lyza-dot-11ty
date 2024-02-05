const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

const customColors = {
  pank: "#e60a62",
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
                color: customColors.pank,
              },
            },
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
