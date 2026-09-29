---
title: "Pages, layouts and menus"
description: "Design how the pages of each content type look, build the header and footer around them as layouts, and style your menus for large and small screens."
---

Blocks are the pieces; pages, layouts and menus put them together. All three designers work like the [block designer](./blocks.md): **Layers** with its **Add** menu on the left, the preview in the middle, settings on the right, drafts that save by themselves and a **Publish** button in the bar on top.

## Page designs

A page design decides how every page of one content type looks, for example every blog post.

1. Click **Design** in the sidebar, then **Pages**.
2. Click **Edit design** on a content type.

A generated page design shows the title first, then every field. Arrange it like a block: add elements, choose which field each shows, style them. Besides the page's own fields you can show its **title**, its **address**, its **publishing date** and its **author**.

A **Blocks** element shows the page's blocks, each in its own block design and laid out on the grid editors arranged in the content editor.

**Page settings** on the right holds three settings:

- **Layout**: the frame around these pages. **As in Site settings** uses the layout the [site settings](./site-settings.md#layouts) assign.
- **Search description from**: a field whose text search engines show under the page title. Without one, the site's default description is used.
- **Share image from**: an image field used when the page is shared on social media. Without one, the site's default share image is used.

To preview with real content, choose **A real page** under **Preview content** on the right and **Pick a page**.

## Layouts

A layout is the frame around pages: typically a header with the logo and the main menu, and a footer. Every site has a layout called `default`; pages use it unless their page design or the site settings pick another.

1. Click **Design** in the sidebar, then **Layouts**.
2. Click **Edit design** on a layout.

The preview shows a sample page where each page goes. Layouts have an extra group in the **Add** menu, **Site**:

| Element | What it shows |
| --- | --- |
| **Page content** | Where each page appears, in its page design. A layout has exactly one, so it cannot be removed or copied |
| **Menu** | One of your [menus](../admin/menus.md). **Menu** picks which one, **Looks like** picks its design |
| **Logo** | The logo from the site settings, linked to the home page |
| **Breadcrumbs** | The path from the home page to the current page |
| **Language switch** | Links to the page in the other languages, as names (English, Deutsch) or codes (EN, DE) |
| **Search link** | A link to your search page |

Elements can also show the **site name** and the **site logo** from the site settings.

### Create, copy or delete a layout

- **New layout** asks for a **Name** (for example "Landing page") and whether it **Starts from** the generated header, page and footer or **A copy of** another layout. Click **Create**.
- **Duplicate** (the copy icon) on a layout's card copies it.
- **Delete** removes a layout (not `default`). If pages use it, the dialog lists them and asks where to **Move them to**.

## Menus

The entries of a menu are edited under **Menus** in the sidebar (see [Menus](../admin/menus.md)). How a menu looks is designed here.

1. Click **Design** in the sidebar, then **Menus**.
2. Click **Edit design** on a menu.

**Kind of menu** on the left picks a preset:

| Preset | Looks like |
| --- | --- |
| **Horizontal bar** | Top-level entries in a row, nothing below them |
| **Vertical list** | Entries under each other, sub-entries indented |
| **Dropdown** | A row whose sub-entries open below on hover or focus |
| **Mega menu** | A row whose sub-entries open as a wide panel |
| **Footer columns** | Each top-level entry heads a column of its sub-entries |

**Use the preset's styles** starts the styles over from the chosen preset. **Shows** sets how many levels appear.

**On phones and tablets** decides what small screens get:

- **Keep as is**: the same menu.
- **Burger button**: a button with a menu icon opens the menu below it.
- **Slide-in panel**: a button slides the menu in from the side.

**Collapses on** picks when that happens: **Tablets and phones (below 1024px)** or **Phones only (below 640px)**. **Button label** is what screen readers read out for the button.

On the right, **Part** picks what to style (the whole menu, a level, the current page's entry, the mobile button or the opened menu); then style it like any element. Switch the preview to **Tablet** or **Mobile** to see the small-screen behaviour.

### Shared menu designs

Each menu has its own design. If several menus should look alike, click **New shared design** (or **Duplicate as a shared design** in a menu's row). In a layout, the **Menu** element's **Looks like** setting can then use the shared design for any menu.
