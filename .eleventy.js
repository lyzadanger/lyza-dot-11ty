const { DateTime } = require("luxon");
const yaml = require("js-yaml");

const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  // 11ty plugins
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  // Add YAML support
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Necessary because `_tmp_ is gitignored and 11ty won't see it otherwise
  // TODO: validate this
  eleventyConfig.setUseGitIgnore(false);

  // Build config
  // Everything in src/public will pass through to _site
  eleventyConfig.addPassthroughCopy({ "./src/public/": "/" });

  // Styles
  eleventyConfig.addWatchTarget("./_tmp/styles.css");
  eleventyConfig.addPassthroughCopy({ "./_tmp/styles.css": "./styles.css" });

  // Templating config
  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
    autoescape: false,
  });

  // Custom filter for formatting locale dates
  eleventyConfig.addFilter("localeDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toLocaleString(
      DateTime.DATE_FULL
    );
  });

  // Custom filter: Return all the tags used in a collection, with counts
  // of how many items in the collection use each tag, sorted by count desc
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
    // Sort by count, descending
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

  // Config directories
  return {
    dir: {
      input: "src",
      includes: "_includes",
    },
  };
};
