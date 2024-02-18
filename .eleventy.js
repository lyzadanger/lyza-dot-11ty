const { DateTime } = require("luxon");
const yaml = require("js-yaml");

const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  // 11ty plugins
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  // Extend markdown transformation with permalinks and footnotes support
  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItFootnote));
  eleventyConfig.amendLibrary("md", (mdLib) =>
    mdLib.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink({
        class: "markdown-it-anchor-permalink",
        safariReaderFix: true,
      }),
    }),
  );

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
      DateTime.DATE_MED,
    );
  });

  eleventyConfig.addFilter("formatDate", (dateObj, format = "LLL dd, yyyy") => {
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });

  // These tags should not be shown when rendering blog-post tags
  const excludedPostTags = ["all", "posts", /^series/];

  const filterTags = (itemTags, disallowedTags = excludedPostTags) => {
    return itemTags.filter((tag) => {
      for (const disallowed of disallowedTags) {
        // string comparison being speedier than `.match` if it's not a RegExp
        if (typeof disallowed === "string" && tag === disallowed) {
          return false;
        } else if (tag.match(disallowed)) {
          return false;
        }
      }
      return true;
    });
  };

  // Filter out excludedPostTags from an array of tags
  eleventyConfig.addFilter("postTags", filterTags);

  // Return the series tag representing the series that this item belongs to, if
  // any. Throw if the item belongs to multiple series, as that is not currently
  // allowed.
  // NB: This function cannot be an arrow function because of necessary
  // `this` binding.
  eleventyConfig.addFilter("seriesSlug", function (tags) {
    const seriesTags = (tags || []).filter((tag) => tag.match(/^series/));
    if (!seriesTags.length) {
      return false;
    }
    if (seriesTags.length > 1) {
      throw new Error(
        `Item may only belong to one series. File at '${this.page.inputPath}' has multiple series tags`,
      );
    }
    return seriesTags[0].replace("series-", "");
  });

  // Look up a series data object in `seriesData` by slug
  eleventyConfig.addFilter("getSeriesBySlug", (seriesData, slug) =>
    seriesData.find((item) => item.slug == slug),
  );

  // Custom filter: Return all the tags used in a collection, with counts
  // of how many items in the collection use each tag, sorted by count desc
  eleventyConfig.addFilter("getAllTagsWithCount", (collection) => {
    const tags = [];
    for (let item of collection) {
      const postTags = filterTags(item.data.tags || []);
      postTags.forEach((tag) => {
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
