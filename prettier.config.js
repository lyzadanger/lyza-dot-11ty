module.exports = {
  // There is no prettier support for .njk. Instead, fake it by treating
  // .njk files as liquid.
  // See https://github.com/tailwindlabs/tailwindcss/discussions/11731#discussioncomment-7925745
  plugins: ["prettier-plugin-jinja-template", "prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "*.njk",
      options: {
        parser: "jinja-template",
      },
    },
  ],
  tailwindConfig: "./styles/tailwind.config.js",
};
