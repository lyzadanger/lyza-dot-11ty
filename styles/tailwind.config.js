const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

const customColors = require("./colors");

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
            code: {
              fontWeight: 500,
              padding: "0 0.25em",
              backgroundColor: colors.stone["100"],
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
