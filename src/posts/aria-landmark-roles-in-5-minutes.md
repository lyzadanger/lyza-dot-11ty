---
title: ARIA Landmark Roles in 5 Minutes
tags:
  - tech
  - a11y
  - web
  - howto
date: '2015-09-04T20:13:17.977Z'
excerpt: >-
  There are lots of elements in play when trying to make web sites and apps
  accessible, but correct use of ARIA roles in HTML is straightforward and has
  big impact.
---

The recent results for [WebAIM's survey study](http://webaim.org/projects/screenreadersurvey6/) of screen reader users reminded me of two things:

* Much of what stands between us and an accessible Web boils down to [our own awareness and knowledge](http://webaim.org/projects/screenreadersurvey6/#reasons) as web implementors
* A majority of screen reader users [rely on ARIA landmark roles](http://webaim.org/projects/screenreadersurvey6/#landmarks) for basic navigation and wayfinding in web documents

Paraphrased: *Web accessibility is a complex subject, but using ARIA landmark roles alone can give us a good start*.

## ARIA's Roles Model

[WAI-ARIA](http://www.w3.org/WAI/intro/aria.php) (Web Accessibility Initiative's Accessible Rich Internet Applications Suite, whew) "provides a framework for adding attributes to identify features for user interaction, how they relate to each other, and their current state." I'm not going to delve into all of what it encompasses because that is a lot.

Let's just talk about roles for now. Using the `role` attribute in an HTML element is a way of explicitly declaring what it does in the HTML document. What its purpose is. What it _means_ in this great universe of web stuff. Like this:

```html
<main role="main">
<nav role="navigation">
```

## Four Categories of Role

There are a [lot of defined roles in ARIA](http://www.w3.org/TR/wai-aria/roles), meant for accomplishing different things. Let's focus in further.

There are four categories of role:

1. **abstract**: which you can't use directly anyway, so let's plug our ears and move on
2. **widget**: which you use if you're building ARIA-enhanced "widgets", we're not today, so onward!
3. **document structure**: "structures that organize content in a page": useful, but, still, let us onward...
4. **landmark**: "regions of the page intended as navigational landmarks", ding ding ding! These are signposts we can easily add to each and every HTML document we make.

### There are Eight Landmark Roles

There are only eight (8) landmark roles to master. Fewer, really, because not all are applicable to all things:

* **application**: Defines a "region declared as a web application" (versus a content-y web document). Puts certain screen readers in a particular application mode. Don't use it unless you know what you're doing.
* **banner**: A site-level region, typically including logo, headings.
* **complementary**: An area of content within a page that is _related_ to the main content, but would stand alone separate from it.
* **contentinfo**: Typically contains metadata about the main document, with copyright info, utility links, etc. Typically assigned to a `footer` element in applied usage.
* **form**: What it sounds like. Opinions differ, but I consider `<form role="form">` to be redundant.
* **main**: The main content of the document.
* **navigation**: An element containing navigation, like you'd expect.
* **search**: An element containing search functionality.

### Four Essential Landmark Roles

I am of the opinion that you can get excellent bang for the accessibility-improvement buck by simply using the following four ARIA landmark roles in every HTML document you produce:

* **banner**: Stick this role on the `<header>` or other element that wraps the masthead or main banner of the page. Done.
* **main**: Put this role on the element containing the main, _unique_ content of the page. That might be an article or blog post, for example. In writing this post I realized that my `main` role was poorly assigned on my site's templates. It'll be fixed by the time you see this.
* **contentinfo**: Stick it on your main site footer.
* **navigation**: Stick it on your navigation elements.

With the exception of `navigation`, each of these roles should appear _only once per document_.

### Am I doing it right?

Go grab the [tota11y](http://khan.github.io/tota11y/) toolkit and quickly check any page. It has a section for `Landmarks`. Easy peasy!

p.s.: This isn't the [first I've spoken of this](http://alistapart.com/column/wai-finding-with-aria-landmark-roles).
