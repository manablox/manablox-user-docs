---
title: "Site settings"
description: "The settings of a designed site as a whole: name, logo and favicon, the page title in the browser tab, texts and images for search engines and social media, which layout each content type uses and custom code. Plus the website settings of the space: 404 page, languages and password."
---

Click **Design** in the sidebar, then **Site settings**. The settings are on four tabs. They save as a draft and reach the site when you click **Publish** in the header.

The 404 page, the languages in addresses and the password are settings of the space instead. They are under **Settings > General** and apply at once; see [Website settings of the space](#website-settings-of-the-space). The domains of the site are under **Settings > API hosts**; see [Domains](./domains.md).

## General

| Setting | What it does |
| --- | --- |
| **Site name** | The name of your site, used in page titles and by the logo element |
| **Logo** | An image from your assets, with an **Alt text** per language for screen readers |
| **Favicon** | The small icon in the browser tab |
| **Page title pattern** | What the browser tab and search engines show as a page's title. `{title}` is the page's title, `{site}` the site name. The default is `{title} \| {site}` |

Below the pattern you see how it looks for "A page called About us" and for a page without a title. A warning appears if the pattern has no `{title}` or uses a placeholder that does not exist.

## Search and sharing

| Setting | What it does |
| --- | --- |
| **Default description** | The short text search engines show under your pages, per language. A page design can take it from a field instead; see [Page designs](./pages-layouts-menus.md#page-designs) |
| **Default share image** | The picture shown when a page is shared on social media. 1200 by 630 pixels works best |
| **Let search engines list the site** | Switch it off while the site is not ready: every page is then marked "do not index" and search engines are asked to stay away |
| **Extra robots.txt lines** | Extra rules for search engine robots, for advanced cases |

The site creates a sitemap for search engines by itself, at `/sitemap.xml`, with every published page in every language.

## Layouts

For each content type, pick which [layout](./pages-layouts-menus.md#layouts) its pages use. **Default layout** is the one called `default`. When a page design picks a layout itself, this tab shows "Set in the page design".

## Custom code

For things the designer cannot do, like an analytics script or a special font effect.

| Setting | What it does |
| --- | --- |
| **Custom CSS** | Style rules added after all designs, so they win over everything else |
| **Code in head** | HTML added to the head of every page, for example a tracking or verification snippet |
| **Code at the end of the body** | HTML added at the end of every page, for example a chat widget |

Only people with the permission **Edit custom CSS and head code** can change these; owners and admins have it. Everyone else sees them locked.

:::caution
Code here runs on every page of your site, for every visitor. Only paste code you trust. As soon as there is code in the head or at the end of the body, the site loosens its built-in protection against injected scripts, so that your code can load what it needs.
:::

## Website settings of the space

Click **Settings** in the sidebar, then **General**. Below the name, languages and uploads of the space are its website settings. Changing them needs a role that may change the space's settings, such as owner or admin, and they apply at once.

| Section | What it does |
| --- | --- |
| **Website** | Whether the space is a designed site or feeds your own frontend. **Switch to a designed site** or **Use my own frontend instead** changes it; your designs are kept either way |
| **404 page and languages** | For a designed site. **Page not found** is what visitors see at an address that does not exist: **Pick a document** to use one of your pages, or **Use the generated page**, a simple page with a link home. **Languages in addresses** is how visitors reach the other languages of a multilingual space: **Path prefix** puts the language in front of the address (`/de/ueber-uns`), except for the default language, and **Domain per language** uses a separate domain for each language, like `example.de` (see [Domains](./domains.md)) |
| **Site password** | For a designed site. Keeps the whole site behind one password, for example while it is not ready or for a members-only site. See [Password-protected sites](./site-password.md) |

## The Manablox badge

Whoever runs your Manablox instance can add a small "Made with Manablox" link to the bottom corner of every page. While it is there, **Settings > General** says "A Manablox badge is shown on this site". It cannot be switched off in the admin; ask whoever runs your instance.

