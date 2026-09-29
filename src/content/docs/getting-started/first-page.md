---
title: "Your first page"
description: "Build a simple Page content type in the admin, write an About page, publish it and check that the public API serves it."
---

A new space does not know what a page is yet. In Manablox you first describe a kind of content (a **content type**), and then write documents of that kind. On this page you build a small "Page" type with a summary and a body text, write an "About" page with it, publish it, and check that it is really out there.

You need the admin open at `http://localhost:3000`, signed in, with the empty "Website" space from [Sign in and create a space](./first-sign-in.md). Everything here happens in the browser, except the very last check.

## Part 1: build the Page type

A content type is like a form template: it lists the fields every document of that kind has. See [Key ideas](../concepts.md#content-type) if you want the longer explanation.

1. In the sidebar, click **Content types**. You see two cards: "Document types" and "Block types".
2. On the "Document types" card, click **New document type**. The type editor opens with the heading "New content type".
3. In **Label**, type `Page`. The **Technical name** below fills itself in as `page`.
4. Look at the **Behaviour** card on the right. Kind is "Content", and "Has a slug and permalink", "Publishable", "Visible in the content tree" and "Can appear in menus" are ticked. Leave them like that: a page has a web address, can be published, sits in the tree and can be put in a menu.

### The fields you get for free

Open the **Built-in fields** panel by clicking its title. It lists what every page has without you adding anything: `title`, `slug`, `permalink`, `status` and a few more. So you do not add a "Title" field yourself. Close the panel again.

### Add a summary

1. On the **Fields** card, click **Add field**. A list of field types opens: Text, Rich text, Number, and so on.
2. Click **Text**. A new field appears with its settings open.
3. Change its **Label** from "Text" to `Summary`. Its technical name follows and becomes `summary`.
4. Under **Value**, set **Input** to **Multi-line**, so editors get a box for a few sentences instead of a single line.

### Add a body text

1. Click **Add field** again and choose **Rich text**. Rich text is formatted text: headings, bold, lists and links.
2. Change its **Label** to `Body`. The technical name becomes `body`.

Each field also has the switches **Required** (a page cannot be saved while the field is empty), **Translated** (a separate value per language) and **Unique** (no two pages may hold the same value). Leave them off for now. All field types and their settings are explained in [Field types](../content-model/field-types.md).

### Save the type

Click **Save** at the top right. You should see the message `Saved "Page"`, and "Page" appears in the list of types on the left.

:::note
After saving, the technical names (`page`, `summary`, `body`) are locked. Websites use them to find your content, so renaming them would break those websites. Labels can always be changed.
:::

## Part 2: write the About page

1. In the sidebar, click **Content**. On the left you see the content tree, still empty.
2. Click **New** at the top right. A menu lists the types you can create; click **Page**.
3. In **Title**, type `About`. The **Slug** below fills itself in as `about`. That will be the page's web address.
4. In **Summary**, write a sentence or two, for example `We bake bread and cakes with love since 1998.`
5. In **Body**, write a few lines. Try the toolbar: make a word bold or add a heading.
6. Click **Save** at the top right.

You should see the message "Saved", and the page appears in the tree on the left. The badge next to the title in the editor says **draft**: the page is saved, but nobody outside the admin can see it yet.

## Part 3: publish it

Click **Publish** at the top right (or press Ctrl+Enter, Cmd+Enter on a Mac).

You should see the message `Published "About"`, and the badge next to the title changes to **live**. In the tree, a small green dot next to "About" marks it as published.

What happened: the admin copied the current draft to the published version, which is the one the public API hands out. From now on, when you change the page and save, the badge says **changed** until you publish again. Visitors keep seeing the last published version in the meantime. [Drafts, publishing and versions](../content-model/publishing.md) explains this in detail, including scheduled publishing and the version history.

## Part 4: make it the home page

A space can mark one page as its home page, which a website shows at its main address (`/`). Your starter website in the next step uses this.

In the content tree, move the mouse over the "About" row. A star appears on the right; click it. You should see "Set as the home page", and the star stays visible.

## Part 5: check it from outside

The admin says the page is live. Let's ask the public API, the part of the CMS your website will read from, to be sure.

The public API is a second small server. Open a **second terminal**, go to your project folder, and start it:

```sh
cd my-cms
pnpm dev:public
```

Like `pnpm dev`, it keeps running. After a few seconds you should see a line containing `listening`. With exactly one space it serves that one automatically.

Now open this address in your browser:

```
http://localhost:3100/v1/permalink/about
```

You should see a block of text in JSON format (the format programs use to exchange data). Look for `title` with the value `About` and, under `fields`, your summary. The body is there too, as a structured description of the formatted text rather than finished HTML; the website turns it into HTML.

You can also try `http://localhost:3100/v1/permalink` without `about`: since About is the home page, it returns the same page.

:::tip
Change the summary in the admin and click only **Save**, not Publish. Reload the JSON page: it still shows the old summary. Now click **Publish** and reload again: the new text appears. That is the difference between a draft and the published version.
:::

## If something goes wrong

| You see | Try this |
| --- | --- |
| No **New** button, or "No content types yet." in its menu | The Page type was not saved. Go back to **Content types** and save it |
| The browser cannot reach `localhost:3100` | `pnpm dev:public` is not running, or stopped with an error. Look at its terminal |
| An error mentioning `publicApi.space.unresolved` (status 503) | The public API does not know which space to serve. With no space yet, create one; it is picked up within ten seconds. With several spaces, see [The public API](../website/public-api.md#which-space-it-serves) |
| An error saying the content was not found | The page is not published, or its slug is not `about`. Check the badge and the Slug field in the admin |

## Next step

Keep both terminals running. In [Show it on a website](./first-website.md) you create a small website that shows this page.
