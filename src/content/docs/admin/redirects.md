---
title: "Redirects"
description: "Send visitors and search engines from old addresses to new ones, so old links and bookmarks keep working. Manablox adds them for you when a page moves."
---

A redirect sends visitors (and search engines) from an old address to a new one, so old links and bookmarks keep working. You find them under **Redirects** in the **Structure** part of the sidebar, or with `g` then `r`.

Redirects belong to the space, not to one kind of website. A [designed site](../design/index.md) follows them by itself; a website you build with code asks the public API for them (see [Use them on your own website](#use-them-on-your-own-website)).

Seeing redirects needs the permission **See redirects**, adding and changing them **Add, edit and remove redirects**. Editors, admins and owners have both; viewers may look.

## Automatic redirects

When a published page gets a new address, for example because you changed its slug or moved it, Manablox adds a permanent redirect from the old address for you. Pages below it that moved along get one too. You do not need to do anything. These show up in the list as **automatic**.

If a page gets its old address back, the redirect from that address goes away again, because a live page always wins.

## Add a redirect yourself

1. Click **Redirects** in the sidebar.
2. Click **Add redirect**.
3. In **Old path**, type the old address without the domain, for example `/old-page`. Leave out the language prefix.
4. Under **Send visitors to**, choose **Path or URL** and type the new address, or choose **Document** and **Pick a document**. A document redirect follows the page even if its address changes later, and sends each visitor to the page in their language.
5. Choose the **Kind**: **301 - moved for good** for a permanent move (best for search engines), or **302 - temporary**.
6. In a multilingual space, pick the **Language** it applies to, or leave **Every language**.
7. Click **Save**.

Use the search box and the **All**, **Manual** and **Automatic** filters to find redirects in a long list. Editing an automatic redirect turns it into a manual one, which later publishes leave alone.

Good to know:

- A redirect only applies when no page has that address.
- If the new address is itself redirected, Manablox saves the final address instead, so visitors never take more than one hop.
- A redirect to its own address, or one that would send visitors round in a circle, is refused.
- A redirect for one language wins over one for every language with the same old address.

## Use them on your own website

A website built with code gets every redirect of a language in one call and forwards visitors itself, for example in its router or middleware. With the [SDK](../website/sdk.md):

```ts
const redirects = await cms.redirects({ locale: 'en' });

const match = redirects.find((redirect) => redirect.fromPath === '/old-page');
if (match) {
  // match.toPath is a path like '/new-page' or a full address
  // match.status is 301 or 302
}
```

Over REST it is `GET /v1/redirects?locale=en`, in GraphQL `redirects(locale: "en")`.

- Paths start with `/` and have no language prefix. If your website puts the language in front of its addresses, add it yourself.
- A redirect to a document comes with the document's current address. A redirect to a page that is not published (or has no version in that language) is left out.
- Without `locale` you get the space's default language.
