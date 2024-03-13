"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = __importStar(require("js-yaml"));
const fs_1 = require("fs");
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
module.exports = (eleventyConfig) => {
    const filepath = `./${eleventyConfig.dir.input}/${eleventyConfig.dir.data}/series.yaml`;
    const seriesData = yaml.load((0, fs_1.readFileSync)(filepath, "utf8"));
    eleventyConfig.addFilter("getSeriesBySlug", (seriesData, slug) => seriesData.find((item) => item.slug == slug));
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
