import * as yaml from "js-yaml";
import { readFileSync } from "fs";

import type { UserConfig } from "@11ty/eleventy";

// TODO: Organize and document types here
export type Series = {
  slug: string;
  title: string;
  description: string;
};

// Pretend 11ty type
type CollectionAPI = {
  getAllSorted: () => Record<string, any>[];
};

/**
 * Simple 11ty plugin to generate "series" collections from series YAML
 * metadata. Also adds a custom filter to look up a series in an array of
 * series objects by slug.
 *
 * A collection is created for each entry in series data, keyed by `slug`.
 * Content can be added to a series (i.e. added to its collection) by adding an
 * `inSeries` field to front-matter. The value of the field should be the slug
 * of the series to associate with.
 */
module.exports = (eleventyConfig: UserConfig) => {
  const filepath = `./${eleventyConfig.dir.input}/${eleventyConfig.dir.data}/series.yaml`;

  const seriesData = yaml.load(readFileSync(filepath, "utf8")) as Series[];

  eleventyConfig.addFilter(
    "getSeriesBySlug",
    (seriesData: Series[], slug: string) =>
      seriesData.find((item) => item.slug == slug),
  );

  // Add a collection for each series in data, keyed by its `slug` field
  // Add all content with front-matter/data `inSeries: {series-slug}` to the
  // collection
  (seriesData || []).forEach((series) => {
    eleventyConfig.addCollection(
      series.slug,
      function (collectionApi: CollectionAPI) {
        return collectionApi
          .getAllSorted()
          .filter((item) => item.data?.inSeries === series.slug);
      },
    );
  });
};
