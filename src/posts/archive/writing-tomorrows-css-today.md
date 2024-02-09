---
title: Writing Tomorrow's CSS Today
tags:
  - tech
  - standards
  - css
date: "2015-08-11T17:22:29.218Z"
excerpt: >-
  Did you know that, using CSS transpilers, you can use to-spec CSS of the
  future, today? Here are some of the magical things I'm using these days.
---

[Whether or not I'm correct](http://alistapart.com/column/what-will-save-us-from-the-dark-side-of-pre-processors) in calling [PostCSS](https://github.com/postcss/postcss) a CSS _post-processor_ or not, that is, semantic arguments notwithstanding: I love the tool and its general promise and philosophy.

I use PostCSS as part of my workflow on this site. We use it copiously at [Cloud Four](http://www.cloudfour.com). One of the hints, to me, that it's a nice fit is that both dev-y and design-y people seem to thrive in its world.

Here are a couple of specific CSS things I've been enjoying writing in my source lately.

### `var` and `calc`

The combination of `calc` and `var` for basic computation, which is a large part of the draw of pre-processors like Sass, Less and stylus. I make use of the `:root` selector as a place to stash my variables, for example:

```css
:root {
  --ratio: 1.2;
  --font-size-sm: 1em;
  --font-size-md: calc(var(--font-size-sm) * var(--ratio));
  /* ... and so on, font and heading sizes up to xxl */
}
```

The above is an abbreviated riff on a pattern established by Cloud Four's Erik Jung, who is a master at typographic thinking. But note how I can chain along defined variables and calcs to create a rhythmic relationship of type. The value of `ratio` is also used to calculate ideal `line-height`. It's used in this site's source.

This is valid CSS per the [CSS Custom Properties for Cascading Variables Module Level 1](http://www.w3.org/TR/css-variables/) (I call it "CSS Variables" because _mouthful_). But you won't see it in my site's source untrammeled because PostCSS transpiles it to the kind of CSS browsers of this day and age can handle.

### Custom Selectors

Used sparingly, things like this are self-evidently useful:

```css
@custom-selector :--headings h1, h2, h3, h4, h5, h6;
/* ...later on */
:--headings {
  color: var(--heading-color);
  font: var(--heading-font);
  font-weight: var(--font-weight);
  line-height: 1;
}
```

Like with CSS variables, the spec is called something different: [CSS Aliases](http://tabatkins.github.io/specs/css-aliases/).

### Custom Media Queries

And how:

```css
@custom-media --sm-viewport (width >= 30em);
/* ... and later ... */
@media (--sm-viewport) {
  .Announcement {
    padding: var(--space-xsm);
    margin: var(--space-md) var(--space-sm);
  }
}
```

This is per the [custom media queries](https://drafts.csswg.org/mediaqueries/#custom-mq) part of the [Media Queries Level 4](https://drafts.csswg.org/mediaqueries/) spec.

Next time I'll natter on about how adding [Suit CSS](https://suitcss.github.io/) to this mix makes extra magic sauce.
