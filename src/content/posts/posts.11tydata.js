module.exports = {
  tags: "posts",
  layout: "layouts/post.njk",
  permalink: "/{{ page.date | date: '%Y/%m/%d' }}/{{ page.fileSlug }}/",
  "tags-works-comment": "make files available in `collections.posts`",
};
