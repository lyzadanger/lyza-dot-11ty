---
title: Scampering after Node.js Versions
tags:
  - tech
  - web
  - js
date: "2015-12-08T18:55:01.019Z"
excerpt: >-
  Everything about Node.js is exponential curves right now. While at Node
  Interactive here in Portland, my mind has started racing about understanding
  and managing Node.js versions.
---

The morning keynotes at [Node Interactive](http://events.linuxfoundation.org/events/node-interactive) just happened and I'm reeling a bit and talking to interesting people but wanted to write something down before I forget.

Node.js versions are _cray-zee_ for me right now.

For some reason, it was calming when [James Snell](https://twitter.com/jasnell) mentioned that the late-2014 Node.js/io split freaked _everyone_ out and my desire to stick my fingers in my ears and pretend it didn't happen echoed how most of the community felt, too. And so we are all glad to see the convergence, and now the best of both communities combined:

- The open governance model and velocity from io.js
- The stability focus from Node.js

And a whole lot less weird tension about the Node.js vs. io.js fiasco.

### Straight to 5.0.x?

Cool. By now, most of us in the node community have seen the [release schedule for Node.js](https://nodesource.com/blog/essential-steps-long-term-support-for-nodejs). The launch into that was fast and heavy: `4.0.0` in September, `5.0.0` in October (at time of writing we're at `5.1.1` for stable). This had led to a sense of rushing to be writing new code on the latest, but hang on.

`4.x` and `5.x` are both stable, but they're not the same: `4.x` will go into active LTS (long-term support) in six months, and will stay in LTS for 18 months after that. `5.x` is stable, but will never got into LTS. That is, stable-with-LTS releases are yearly—and the releases you should lean toward for long-term, production work.

### Who Uses What, Now?

Yes, we are moving quickly as a community. Also in Snell's keynote was the statistic: about 38% of folks are at `4.0.0` or better. That's fast.

At the same time, there is a lot of legacy code out there. [Tom Croucher](https://twitter.com/sh1mmer), in his keynote on Node.js at Uber, mentioned a currently-open issue in Uber's codebase to upgrade something that is still on `0.8`. If most of your stuff is on `0.10` or `0.12`, you are not alone. Just note: active maintenance for `0.12` ends about a year from now; `0.10` earlier (Octoberish). You have some time but not forever.

### So How Do We Manage This?

There are an assortment of ways for managing node versions from within a project, but a universal pattern hasn't quite coalesced.

Dropping a `.node-version` in a project root is a tactic I've seen on occasion, but its inclusion in version-controlled code can be bothersome and it's not a pattern I see terribly often. Other flavors of this dotfile-controlled versioning can be seen in `.nvmrc` or `.npmrc` form.

The definition of an `engines` property in `package.json` is ubiquitous, but it's only advisory in current `npm` versions—you'll get a `WARN`, but a package made for `4.0`+ will happily install on your local version of `0.12` (and then break when you try to use it later).

I'm sure I missed things, but, again, this seems scattershot to me at the moment.

### Maybe the Answer is Obvious

Maybe version management has already been roundly sorted and I'm an ignoramus for not being on top of it. But it's harshing me this week. Although I haven't blogged in a month, a hell of a lot has been going on with my site under the covers. More on that later, maybe, but.

Yesterday I tried to deploy a bunch of site infrastructure updates to lyza.com's new host, [netlify](http://netlify.com). Call me boneheaded for not thinking more carefully about dropping in ES6 enhancements supported by `>=4.0.0` but it wasn't until after I'd deployed and the build failed—netlify won't deploy broken builds, fortunately; yay for that—that I realized I didn't even know what version netlify was using to build my site. Turns out `0.12.2` (I'll gloss over it, but figuring _that_ out was not as straightforward as you might imagine). Cue a few [furious](https://github.com/lyzadanger/lyza-dot-com/commit/7cc8bc19d8d81777b78f7f40508f43bb9b828682) patch [commits](https://github.com/lyzadanger/lyza-dot-com/commit/fc3e504d147281073ccf009cf31fdcb33a15e79b) to back out of my ES6 syntax and the builds succeeded again.

Netlify support via gitter was quick and responsive, and they explained I could use an `.nvmrc` keyed to any of the available versions in their [open-source Docker build image](https://github.com/netlify/build-image/blob/master/Dockerfile#L99), but—and I think this is a common theme—it's not documented anywhere and it took a bit of breaking to figure it out.

I think the next few months are going to involve a bit of scrambling as the community works through some of this stuff. Now to go re-apply that ES6 stuff and get my site up to `4.0`+. See yah!
