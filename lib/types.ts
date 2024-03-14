// Content Data types
// `*ContentData` data are declared (in front matter, e.g.) at the most
// granular level: a single piece of content.

export type OpenGraphContentData = {
  title?: string;
  image?: string;
  url?: string;
  description?: string;
};

export type ContentData = {
  /** All content must declare a title */
  title: string;

  /** Slug of series this content belongs to */
  inSeries?: string;

  excerpt?: string;
  description?: string;
  tags?: string[];
  date?: string;
  og?: OpenGraphContentData;
};

// Global data types

export type Series = {
  slug: string;
  title: string;
  description: string;
};

export type Config = {
  cloudinary: {
    id: string;
  };
  environment: string;
};

// Merged data

/**
 * This is a partial representation of the the context object after the build
 * system (Eleventy) is done merging in data from other parts of the cascade.
 * This data is the input to me-specific data computation.
 *
 * NB: These types should be expanded if they have data fields operated on by
 *     any of my own code.
 */
export type MergedData = ContentData & {
  /** Eleventy-provided page data */
  page: Record<string, unknown>;

  // Global data from my own src data modules
  books: Record<string, unknown>[];
  config: Config;
  education: Record<string, unknown>[];
  events: Record<string, unknown>[];
  metadata: {
    description: string;
    url: string;
  };
  profile: Record<string, unknown>;
  series: Series[];
  skills: Record<string, unknown>[];
};

// Computed data types
// These represent the data that are in context for template rendering

export type ComputedOpenGraphContentData = OpenGraphContentData & {
  /** Title is non-optional once OG data is computed/merged */
  title: string;
};

/**
 * This is a partial representation of the returned data object from
 * me-specific data computation. This is the data context that is provided
 * to a templates for build.
 *
 */
export type ComputedContentData = MergedData & {
  /** Open Graph data object is guaranteed to be present */
  og: ComputedOpenGraphContentData;
};
