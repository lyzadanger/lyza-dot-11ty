const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  // Necessary because `_tmp_ is gitignored and 11ty won't see it otherwise
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addWatchTarget("./_tmp/styles.css");
  eleventyConfig.addPassthroughCopy({ "./_tmp/styles.css": "./styles.css" });

  // Static images
  eleventyConfig.addPassthroughCopy("src/images");

  return {
    dir: {
      input: "src",
      includes: "_includes",
    },
  };
};
