const { DateTime } = require("luxon");
const yaml = require("js-yaml");
const matter = require("gray-matter");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");

const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const seriesPlugin = require("./lib/series");

const siteConfig = require("./src/_data/config");

module.exports = function (eleventyConfig) {
  // 11ty plugins
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  // My own plugins
  eleventyConfig.addPlugin(seriesPlugin);

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

  // Take a title and return a URL to a composited Open Graph image via
  // Cloudinary's image-transform URL API
  eleventyConfig.addFilter("cloudinaryOGImage", (title) => {
    if (!siteConfig.cloudinary?.id) {
      return undefined;
    }

    const cloudinaryURLParts = [
      // Set up fetch URI, with cloudinary ID and size of overall image (the URL to the image
      // used here comes at the very end of the URL). Set height, width, quality
      `https://res.cloudinary.com/${siteConfig.cloudinary.id}/image/fetch/w_1200,h_630,q_100`,
      // Static: Render "Lyza / Danger / Gardner" text layers
      "co_rgb:000,l_text:Playfair%20Display_72_900_line:Lyza,c_fit,w_540/fl_layer_apply,g_north_west,x_40,y_40/co_rgb:000,l_text:Playfair%20Display_72_900_line:Gardner,c_fit,w_540/fl_layer_apply,g_north_west,x_40,y_135/co_rgb:e60a62,l_text:Playfair%20Display_72_900_line:Danger,c_fit,w_540/fl_layer_apply,g_north_west,x_60,y_92",
      // Static: Render a photo of me in bottom right. This contains Base-64 encoded URL to image of me on cloudinary
      "l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGZzc3Nkd2J1L2ltYWdlL3VwbG9hZC92MTcwOTIyNjEyOC9seXphX2loNnJray5naWY=/fl_layer_apply,g_south_east",
      // Static: Render "Lyza.com" on bottom right, near photo of me
      "co_rgb:e60a62,l_text:Playfair%20Display%20SC_36_bold_line_spacing_-20:Lyza.Com,c_fit,w_500/fl_layer_apply,g_south_east,x_220,y_20",
      // Render the title of the post/thing
      // NB: ',', '/' and '%' must be double-escaped. Failure mode otherwise is not graceful
      `co_rgb:44403c,l_text:Playfair%20Display_72_400_italic_line_spacing_-15:${encodeURIComponent(title.replaceAll(/[,\/\%]/g, encodeURIComponent))},c_fit,w_800/fl_layer_apply,g_north,y_240`,
      // And, finally, give the URL of the image that will be at the base/background of all of this
      "https://res.cloudinary.com/dfsssdwbu/image/upload/v1709226095/white_ldpjpk.jpg",
    ];
    return cloudinaryURLParts.join("/");
  });

  // Config directories
  return {
    dir: {
      input: "src",
      includes: "_includes",
    },
  };
};
