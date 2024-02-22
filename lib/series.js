const yaml = require("js-yaml");
const fs = require("fs");

/**
 * Simple 11ty plugin to generate "series" collections from series YAML
 * metadata.
 *
 * A collection is created for each entry in series data, keyed by `slug`.
 * Content can be added to a series (i.e. added to its collection) by adding an
 * `inSeries` field to front-matter. The value of the field should be the slug
 * of the series to associate with.
 *
 * @param { import('@11ty/eleventy/src/UserConfig') }  eleventyConfig
 */
module.exports = (eleventyConfig) => {
  const filepath = `./${eleventyConfig.dir.input}/${eleventyConfig.dir.data}/series.yaml`;
  const seriesData = yaml.load(fs.readFileSync(filepath, "utf8"));

  // Look up a series global data object by slug
  eleventyConfig.addFilter("getSeriesBySlug", (seriesData, slug) =>
    seriesData.find((item) => item.slug == slug),
  );

  // Add a collection for each series in data, keyed by its `slug` field
  // Add all content with front-matter/data `inSeries: {series-slug}` to the
  // collection
  (seriesData || []).forEach((series) => {
    eleventyConfig.addCollection(series.slug, function (collectionApi) {
      return collectionApi
        .getAllSorted()
        .filter((item) => item.data?.inSeries === series.slug);
    });
  });
};
