const { DateTime } = require("luxon");
const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  // Necessary because `_tmp_ is gitignored and 11ty won't see it otherwise
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addWatchTarget("./_tmp/styles.css");
  eleventyConfig.addPassthroughCopy({ "./_tmp/styles.css": "./styles.css" });

  // Static images
  eleventyConfig.addPassthroughCopy("src/images");

  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "/" });

  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
    autoescape: false,
  });

  eleventyConfig.addFilter("localeDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toLocaleString(
      DateTime.DATE_FULL
    );
  });

  // Return all the tags used in a collection
  eleventyConfig.addFilter("getAllTagsWithCount", (collection) => {
    const tags = [];
    for (let item of collection) {
      (item.data.tags || []).forEach((tag) => {
        if (tag === "post") {
          return;
        }
        const existingTag = tags.find((el) => el.tag === tag);
        if (existingTag) {
          existingTag.count++;
        } else {
          tags.push({ tag, count: 1 });
        }
      });
    }
    tags.sort((a, b) => {
      if (a.count < b.count) {
        return 1;
      } else if (a.count > b.count) {
        return -1;
      }
      return 0;
    });
    return tags;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
    },
  };
};
