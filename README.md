# Lyza-dot-com with Eleventy

This project houses the source of [Lyza.com](https://www.lyza.com) built with the [Eleventy](https://www.11ty.dev/) static site generator.

## Content and Data

- Source content is authored in markdown with front-matter. markdown should adhere to the [commonmark spec](https://spec.commonmark.org/) with the following extensions:
  - footnotes
- Source data is authored in YAML

## Development

```
npm install
npm start
```

## Series Plugin

An inelegant local 11ty plugin (`lib/series`) supports the ability to group content into "series". Series metadata is defined in `series.yaml`. To add a piece of content to a series, add an `inSeries` field to its front-matter, i.e. `inSeries: {seriesSlug}`[^1], referencing the `slug` of the `series` the content should be associated with. Series pages are output at `/series/{series.slug}` and navigation within a series is possible from within relevant content pages.

The feature is designed this way to avoid coupling content source data with 11ty implementation details.

[^1]: The field is keyed as `inSeries` to avoid namespace collision with `series` in 11ty's globals. This is an artifact of 11ty architecture.

## Featured content snippet on home page

The featured-content ("The latest") snippet on the landing page (`index.md` content) will by default feature the most recent content tagged `'posts'` (i.e. the latest blog post). To feature something else, add a `featured` object to the front-matter/data of `index.md`, e.g.:

```yaml
featured:
  title: Title of featured content
  excerpt: Some description of featured content
  url: /relative/to/site/root
```
