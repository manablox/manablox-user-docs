---
title: "Preview and the visual editor"
description: "Editors can edit a page right next to the real website and see every change before they save. This page explains what they get and how to set up a website for it, step by step."
---

The visual editor shows your real website inside the admin, next to the fields of the document being edited. Every letter an editor types appears on the website at once, before anything is saved or published. Editors can click text on the page to edit it, and move, add or remove blocks right there.

This works because the website has a special page, `/preview`, that the admin opens in a frame and feeds with the draft. The website never loads the draft itself, so it needs no password or API key.

## What editors get

In the admin, open a document under Content and click **Visual** in the toolbar. The button appears for documents that have a URL and a blocks field, such as the Pages of the **Basic setup**.

A full-screen view opens:

- On the left, the website, showing the document exactly as it looks right now, unsaved changes included.
- At the top, a switch between desktop, tablet and mobile widths, so the page's own mobile layout shows.
- On the right, a panel with the fields of whatever you clicked: a block's fields, or the document's own fields when nothing is selected.
- In the header, a status: **Live preview connected** when the website answered, **Waiting for the site...** while it has not.

On the website itself, editors can:

- Click any text or image to open its field in the panel.
- Double-click a heading or a paragraph and type directly on the page. Enter or a click elsewhere finishes, Escape cancels. Rich text gets a small toolbar (bold, italic, a link, lists and more, as the field allows); Ctrl+Z undoes, and pasted text keeps only the formatting the field can hold.
- Use the small toolbar on each block to drag it, move it up or down, add a block after it, or delete it.
- Resize a block by dragging its handles, when the blocks field is laid out on a grid.

Nothing is stored until you click **Save**. **Close** brings you back to the normal editor. See [Editing content](../admin/editing-content.md) for the rest of the editor.

## What the website needs

Three things, which the starter website already has or asks for:

| What | Why | In the starter website |
| --- | --- | --- |
| A `/preview` page | The admin opens `<website address>/preview` in the frame and sends the draft to it | Already there |
| The admin's address | The preview page only accepts drafts from the admin's origin (scheme, host and port), so no other site can control it | `MANABLOX_ADMIN_ORIGIN` in `.env`, from the `--editor-origin` answer |
| The space's website address | Tells the admin where the website runs | You set it in the admin under `Settings > General` |

The website must also allow being shown in a frame on the admin's address. The starter websites do. If you add security headers later, do not send `X-Frame-Options: DENY`, and if you use a `frame-ancestors` rule, include the admin's origin.

:::note
You do not need `CORS_ORIGINS` for the visual editor. The draft travels from the admin to the website inside the browser; the website never calls the management API. `CORS_ORIGINS` in your CMS project's `.env` is only for your own browser code that calls the management API directly, which the starter never does.
:::

## Set it up on your computer

This uses a `local` project with the admin at `http://localhost:3000` and the Astro starter on port 3005. Use your starter's port if you picked another framework.

1. Start the CMS with `pnpm dev` and the public API with `pnpm dev:public`, in two terminals in your CMS project.
2. Create the website if you have not yet. Its suggested admin address, `http://localhost:3000`, is the one of a `local` project, so press Enter at that question:

```sh
pnpm dlx @manablox/cli frontend my-site
```

3. If the website already exists, open its `.env` and check the admin's address. For the `plain` starter the variable is `VITE_MANABLOX_ADMIN_ORIGIN`; restart `pnpm dev` after a change.

```sh
MANABLOX_ADMIN_ORIGIN=http://localhost:3000
```

4. Start the website with `pnpm dev` in its folder, and check that `http://localhost:3005` shows your home page.
5. In the admin, switch to your space, open `Settings > General`, open the **Name and website** card, set **Website address** to `http://localhost:3005` and click **Save changes**.
6. Open a Page under Content and click **Visual**.

You should see your page in the frame and **Live preview connected** in the header. Type in a field on the right: the page in the frame changes as you type.

For the server-rendered starters (Astro, Vue, React) the admin's address is also built into the code as a default. If you change it in `.env` and nothing happens, start the server with the variable set, for example `MANABLOX_ADMIN_ORIGIN=http://localhost:3000 pnpm dev`.

## On a server

The same three things, with the real addresses. Say the admin runs at `https://cms.example.com` and the website at `https://www.example.com`:

- In the website's environment: `MANABLOX_ADMIN_ORIGIN=https://cms.example.com`.
- In the admin: **Website address** of the space (under `Settings > General`, card **Name and website**) set to `https://www.example.com`.

When the admin is on `https`, the website must be on `https` too: a browser refuses to show an `http` page inside an `https` one. See [Domains and HTTPS](../going-live/domains-and-https.md).

## Your own website

If you did not use the starter, the `/preview` page is small. It uses the `@manablox/live-preview` package:

```ts
import { connectPreview } from '@manablox/live-preview';
import { normaliseFields } from '@manablox/public-sdk';

connectPreview({
  editorOrigin: 'http://localhost:3000',
  clickToEdit: true,
  onDocument: (document) => {
    const fields = normaliseFields(document.fields);
    // render document.title and fields with the same components as your normal pages
  },
});
```

- Call `connectPreview` once, in the browser, when the preview page loads. It returns a function that disconnects again.
- `onDocument` runs on every change. `normaliseFields` puts the draft's fields into the same shape the SDK gives you for published pages, so one set of components renders both.
- Add `fieldAttribute([...])` from the same package to the elements you render, so clicks select the right field: `fieldAttribute(['summary'])` for a document field, `fieldAttribute(['components', 0])` for the first block, `fieldAttribute(['components', 0, 'headline'])` for a field inside it. Put `listAttribute(['components'])` on the element that holds the blocks, so editors can add a block even to an empty list.

The block toolbar and editing text in place work on these same attributes; you do not have to build them. With Nuxt, the `@manablox/nuxt` module does all of this for you, see [A Nuxt website](./nuxt.md).

Keep the `@manablox/*` packages of your website at the same version as your CMS. When the admin is newer than the website's `@manablox/live-preview`, the frame can stay on "Waiting for the editor...".

## When it does not connect

If the header keeps saying **Waiting for the site...**, or the frame shows "Waiting for the editor...", check these in order:

1. The frame shows "This space has no frontend URL configured": switch to the space, open `Settings > General`, open **Name and website** and set the **Website address**.
2. The frame shows an error or a blank page: open the website address plus `/preview` in a new tab. It must load. If it does not, the website is not running or the URL is wrong.
3. The admin's address in the website's `.env` is exactly the address in your browser's address bar when you use the admin, including `http` or `https` and the port. A `local` project uses `http://localhost:3000`.
4. The website does not forbid frames (`X-Frame-Options` or `frame-ancestors`).
5. The admin is on `https` and the website on `http`: move the website to `https`.
6. The website's `@manablox/*` packages are older than the CMS: update them.

## Drafts on your own server

The visual editor covers editing. Sometimes you also want a normal page on a staging server that shows drafts, for example a "preview" link to send to a colleague. That needs the management API and an API key, and it must happen on your server only, never in the browser.

The SDK has a separate client for it:

```ts
// server code only: this file holds an API key
import { createPreviewClient } from '@manablox/public-sdk/preview';

const preview = createPreviewClient({
  url: 'http://localhost:3000',
  apiKey: process.env.MANABLOX_API_KEY,
  spaceId: process.env.MANABLOX_SPACE_ID,
});

const draft = await preview.byPermalink('/about', {
  selection: '... on Page { summary }',
});
```

- `url` is the management API, not the public API: the public API has no drafts at all.
- `apiKey` is a key from `Settings > API keys`. Restrict it to the one space and to reading content and assets, see [API keys](../admin/api-keys.md). Keep it in an environment variable, never in code that reaches the browser.
- `spaceId` is the id of the space. The public API shows it: open `http://localhost:3100/` and copy the value of `space`.
- The preview client always uses GraphQL and never caches, so pass the fields you need as `selection`, see [GraphQL](./graphql.md).
