---
title: "A website without code"
description: "Turn a space into a designed site: Manablox shows your content as a finished website that you design in the admin, with no frontend to build. Switch a space, pick a starter theme and find your way around the Design section."
---

Manablox can show your content in two ways:

- **Your own frontend.** A developer builds a website that reads the content through the API. This is what [Building your website](../website/index.md) explains.
- **A designed site.** You design the website right in the admin, and Manablox serves it for you. No code, no separate website project.

This part of the guide is about the second way. You choose per space, and you can switch back and forth at any time: your content, your designs and the API stay either way.

## What you design

| Part | What it decides | Page |
| --- | --- | --- |
| Theme | Colors, fonts, text sizes, spacing, rounded corners and shadows, the look of buttons and links | [Colors, fonts and spacing](./theme.md) |
| Blocks | How each block type looks, for example a teaser or a quote | [Designing blocks](./blocks.md) |
| Pages | How the pages of each content type look | [Pages, layouts and menus](./pages-layouts-menus.md) |
| Layouts | The frame around every page: header, menus and footer | [Pages, layouts and menus](./pages-layouts-menus.md) |
| Menus | How your menus look on large and on small screens | [Pages, layouts and menus](./pages-layouts-menus.md) |
| Site settings | Site name, logo, favicon, search engine texts, layouts per content type, custom code; the 404 page, languages and password under **Settings > General** | [Site settings](./site-settings.md) |
| Domains | The web addresses the site answers on, under **Settings > API hosts** | [Domains](./domains.md) |

You never start from an empty page. Everything you have not designed yet is built automatically from your content types: every field of a block or page is shown, top to bottom, in the theme's colors and fonts. A new block type shows up on the site straight away. You only change what you want to look different.

## Before you start

Designed sites come from the **website plugin**, an add-on you pick as **Designed websites** when `manablox create` asks for features (or with `--website`), or add later with `pnpm exec manablox plugin install website`. It adds the **Design** section to the admin and a small extra program that runs next to the CMS and shows the sites, called the **site process**. Without the plugin, the admin has no Design section and your spaces use their own frontend.

In a project on your computer, start it in a second terminal window while `pnpm dev` runs:

```sh
pnpm dev:site
```

It runs at <http://localhost:3200>. The `.env` file already tells the admin where to find it (`SITE_URL`).

In a `docker` project the site process is the `site` service and starts with everything else. See [Put the designed site online](./domains.md#put-the-designed-site-online).

## Switch a space to a designed site

A new space can start as a designed site right away: choose **Designed site** under **Website** when you create it (see [Spaces](../admin/spaces.md)). For an existing space:

You need a role that may change the space's settings: owners and admins can.

1. Click **Design** in the sidebar (or press `g` then `e`).
2. The page says "Design the site here instead of coding it". Under **Start from**, pick a starter theme (see below), or **Keep what is there** if the space already has a theme.
3. Click **Switch to a designed site**.

The theme arrives as a **draft**. Nothing is public yet: you look it over, change what you like, and [publish](./publishing.md) when you are ready.

To go back to your own frontend, open **Design**, open **Website mode** at the bottom of the overview (or **Settings > General**, section **Website**) and click **Use my own frontend instead**, then **Switch to own frontend**. Your designs are kept, so you can switch again later.

## Starter themes

The list groups twelve themes into professional, creative and personal ones:

| Group | Theme | What it looks like |
| --- | --- | --- |
| Professional | **Neutral** | Calm grays, a blue accent and one clean sans-serif font. Fits almost any site |
| Professional | **Corporate** | Navy and teal with a friendly sans-serif, for companies and services |
| Professional | **Minimal** | Black on white, square corners and lots of air |
| Professional | **Practice** | Deep green, warm sand and serif headings, for firms, practices and clinics |
| Creative | **Bold** | High contrast, big headlines and a bright accent, for products and campaigns |
| Creative | **Studio** | Electric blue, coral and a characterful grotesque, for studios and agencies |
| Creative | **Playful** | Purple and sunshine yellow, round shapes and hard shadows, for events and fun products |
| Creative | **Noir** | Near black, warm gold and an elegant serif. Lets photos and artwork shine |
| Personal | **Editorial** | Warm paper tones and a classic serif font, made for long reads and blogs |
| Personal | **Journal** | Cream paper, terracotta and two warm serifs, like a well-kept notebook |
| Personal | **Blossom** | Blush pink, apricot and soft rounded type, for lifestyle and personal pages |
| Personal | **Terminal** | Monospace headings and a signal green, for developers, makers and tinkerers |

Your developer can add more themes; they show up in the same list with a "from code" badge. You can try another theme later with **Theme gallery** on the overview; see [Sharing themes](./sharing-themes.md).

## Find your way around

**Design** in the sidebar opens the overview. It starts with where the site stands (published or not, reachable on a domain or not), then a card for each part of the design, and a **Getting started** list that ticks off the first steps: pick colors and fonts, shape your pages, style your blocks, set up header and footer, add a domain, publish. Below, **Waiting to be published** lists the designs with changes visitors do not see yet.

A panel on the left lists every part of the designer, each with a few words on what it is for:

| Entry | What you do there |
| --- | --- |
| **Overview** | Where to start: the state of the site, the first steps, publishing, preview links, and under the folded sections every design with its versions, the theme gallery, import and export |
| **Theme** | Colors, fonts, text sizes, spacing and the look of basic elements |
| **Blocks** | Design each block type |
| **Pages** | Design the pages of each content type |
| **Layouts** | Header, footer and the frame around pages |
| **Menus** | How each menu looks |
| **Site settings** | Site name, logo, search engines, layouts, custom code |

The 404 page, the languages in addresses and the password are under **Settings > General**, the domains under **Settings > API hosts**.

Every design carries a small badge:

| Badge | Meaning |
| --- | --- |
| **automatic** | Nobody has changed it yet; the site builds it automatically from your content types |
| **draft** | Saved, but never published; visitors still see the automatic design |
| **not published** | You changed it since the last publish; visitors see the older version until you publish |
| **live** | Visitors see this design |

## How editing works

A designer fills the whole window. The bar on top has **Back**, the name and badge of the design, and its actions. Below are the columns: on the left what the design is made of, in the middle a **preview** that shows the design as the site will show it, and on the right the settings of whatever you selected. Click anything in the preview to select it.

- Changes save themselves as a draft, a moment after you make them. The bar says **Saving...**, then **Saved**.
- **Undo** and **Redo** in the bar (`Ctrl+Z` and `Shift+Ctrl+Z`) take back or repeat your last steps.
- Above the preview you switch between **Desktop**, **Tablet** and **Mobile** to see how the design looks on each screen size, and zoom with **Fit**, **50%**, **75%** or **100%**.
- Visitors only see your changes after you publish. See [Publishing and preview links](./publishing.md).

If someone else saved the same design while you were working on it, a note tells you so. Click **Discard my changes and reload** to continue from their version.

## Who may do what

| Permission | Lets someone |
| --- | --- |
| **See designs** | Open the Design section and preview links |
| **Edit designs** | Change the theme, blocks, pages, layouts and menus as drafts |
| **Publish designs** | Make drafts live and reset designs |
| **Edit custom CSS and head code** | Change the custom code in the site settings |
| **Manage domains** | Add and remove the web addresses of the site |

Editors can see, edit and publish designs. Custom code and domains are for owners and admins, because code runs on every page and a domain decides where the site appears. See [Users and roles](../admin/users-and-roles.md).
