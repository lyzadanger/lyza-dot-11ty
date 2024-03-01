/**
 * Global computed data merging operations.
 *
 * Merge local Open Graph template data with global defaults and assure an
 * object of Open Graph data exists for each content item.
 *
 * @typedef OGData
 *   @prop {string} [image] - Content-specific OG image, if any
 *   @prop {string} [description] - Merged content description or excerpt
 *   @prop {string} title
 *   @prop {string} [url] - Fully-qualified canonical URL to content
 */

module.exports = /** @type OGData */ {
  og: {
    image: (data) => data.og?.image,
    description: (data) => {
      // Cascade:
      // 1. data.og.description - when set manually in local data
      // 2. data.description - prefer to `excerpt` if present
      // 3. data.excerpt
      if (data?.og.description) {
        return data.og.description;
      }
      const contentDescription = data.description ?? data.excerpt;
      return contentDescription ?? data.metadata?.description;
    },
    title: (data) => data.title,
    url: function (data) {
      return this.htmlBaseUrl(data.page?.url, data.metadata?.url);
    },
  },
};
