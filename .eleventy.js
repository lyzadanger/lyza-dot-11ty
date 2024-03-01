const { DateTime } = require("luxon");
const yaml = require("js-yaml");
const matter = require("gray-matter");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");

// @ts-ignore Third-party types being incomplete is not my problem right now
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const seriesPlugin = require("./lib/series");
const cloudinaryPlugin = require("./lib/cloudinary");

const siteConfig = require("./src/_data/config");

module.exports = function (eleventyConfig) {
  // 11ty plugins
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  // My own plugins
  eleventyConfig.addPlugin(seriesPlugin);
  eleventyConfig.addPlugin(cloudinaryPlugin, siteConfig?.cloudinary);

  // Extend markdown transformation with permalinks and footnotes support
  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItFootnote));
  eleventyConfig.amendLibrary("md", (mdLib) =>
    mdLib.use(markdownItAnchor, {
      // @ts-ignore Missing third-party typing on `permalink` prop
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

  const md = new markdownIt({
    html: true,
  });

  // Add a custom shortcode to render the content as markdown, after first
  // parsing out any front matter
  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return md.render(matter(content).content);
  });

  // Custom date filters
  eleventyConfig.addFilter("localeDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toLocaleString(
      DateTime.DATE_MED,
    );
  });

  eleventyConfig.addFilter("formatDate", (dateObj, format = "LLL dd, yyyy") => {
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });

  // These tags should not be shown when rendering blog-post tags
  const excludedPostTags = ["all", "posts"];

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
