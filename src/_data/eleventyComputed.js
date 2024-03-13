/**
 * Global computed data futzing.
 *
 * Returns an object that operates on merged data from Eleventy and returns
 * computed content data.
 *
 * @typedef {import('../../lib/types').MergedData} MergedData
 * @typedef {import('../../lib/types').ComputedContentData} ComputedContentData
 */

module.exports = /** @type {<Partial>ComputedContentData}> */ {
  // Open Graph data
  og: {
    image:
      /**
       * @param {MergedData} data
       */
      (data) => data.og?.image,
    description:
      /**
       * @param {MergedData} data
       */
      (data) => {
        // Order of preference:
        // 1. data.og.description - when set manually in local data
        // 2. data.description - prefer to `excerpt` if present
        // 3. data.excerpt
        if (data.og?.description) {
          return data.og.description;
        }
        const contentDescription = data.description ?? data.excerpt;
        return contentDescription ?? data.metadata.description;
      },
    title:
      /**
       * @param {MergedData} data
       */
      (data) => data.title,
    url:
      /**
       * @param {MergedData} data
       */
      function (data) {
        return this.htmlBaseUrl(data.page.url, data.metadata.url);
      },
  },
};
