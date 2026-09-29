---
title: "The starter website"
description: "manablox frontend writes a complete website for your CMS in one command. This page explains the four frameworks, every question and option, the files it creates, and how to extend and run it."
---

`manablox frontend` writes a complete, working website for a space. It already reads pages from the public API, shows the main menu, renders blocks, and has the `/preview` route the visual editor needs. The code is yours afterwards: plain files you can read and change, with no hidden framework on top.

## Before you start

You need a running CMS with some published content:

1. Your project from [Create your CMS](../getting-started/create-your-cms.md) runs with `pnpm dev` (admin at `http://localhost:3000`).
2. A space exists and has at least one published page. The easiest way is to create the space with the **Basic setup** option, which adds Page and Article types, a Teaser block, a few published pages and a main menu.
3. The public API runs in a second terminal with `pnpm dev:public` (at `http://localhost:3100`). If it answers with the error `publicApi.space.unresolved`, see [The public API](./public-api.md#which-space-it-serves).

Check the last step by opening `http://localhost:3100/v1/permalink/about` in your browser. With the Basic setup you should see the About page as JSON.

## Create the website

Open a terminal in the folder where the website should live (not inside your CMS project) and run:

```sh
pnpm dlx @manablox/cli frontend my-site
```

`pnpm dlx` downloads the `manablox` command for this one run, so nothing is installed globally. (`npx @manablox/cli frontend my-site` works too.) The command asks a few questions, writes the folder `my-site`, installs its packages and prints the next steps.

:::tip
The suggested addresses fit a `local` project made by `manablox create`: the public API at `http://localhost:3100` and the admin at `http://localhost:3000`. When your CMS runs on a server, answer with its addresses (or pass `--url` and `--editor-origin`). A wrong admin address makes the visual editor wait forever.
:::

## Choosing a framework

The first question is which framework the website is built with. All four do the same things; pick the one you know or want to learn.

| Choice | `--framework` | What it is | Dev port |
| --- | --- | --- | --- |
| Astro | `astro` (default) | Pages are rendered on a Node server. Visitors get plain HTML with almost no JavaScript | 3005 |
| Vite + TypeScript | `plain` | No framework. Everything is rendered in the browser, and `pnpm build` makes static files any web host can serve | 3003 |
| Vite + React, server-rendered | `react-ssr` | React 19, rendered on the server and taken over by the browser | 3007 |
| Vite + Vue, server-rendered | `vue-ssr` | Vue 3, rendered on the server and taken over by the browser | 3006 |

Not sure? Take **Astro**. It is the default, it is simple to read, and search engines get complete HTML. Choose `plain` if you only have static web hosting (no Node server), and `vue-ssr` or `react-ssr` if you already know Vue or React.

## Every question

The command asks only for what you did not pass as an option. With `--yes` it asks nothing and takes the defaults.

| Question | Option | Default | What to answer |
| --- | --- | --- | --- |
| What should the frontend be built with? | `--framework` | `astro` | See the table above |
| Where should the frontend be created? | `[dir]` or `--dir` | `my-site` | The folder name. It must be empty, unless you pass `--force` |
| Project name | `--name` | the folder name | The `name` in `package.json` |
| URL of the delivery API | `--url` | `http://localhost:3100` | The public API. Keep the default for a local project |
| The admin's origin, for the visual editor's preview channel | `--editor-origin` | `http://localhost:3000` | Keep the default for a local project, your admin's address on a server |
| Write components for a space's content and block types? | `--model` | `management` when asked, `none` otherwise | See [Components from your content model](#components-from-your-content-model) |
| Space id | `--space-id` | empty | Leave empty when you read from the public API. If you picked a space in the question before, it is filled in; that does no harm |
| Port of the dev server | `--port` | one per framework | Any free port |
| Install dependencies now with pnpm? | `--install`, `--no-install` | yes | Yes, unless you want to run `pnpm install` yourself |
| Initialise a git repository? | `--git`, `--no-git` | yes | Yes if you use git |

Two more options are never asked: `--manablox-version` sets the version range of the `@manablox/*` packages (default: the version of the CLI you ran), and `--force` writes into a folder that is not empty.

The same run without questions, for a script:

```sh
pnpm dlx @manablox/cli frontend my-site --yes --framework astro
```

The full option list is also in [The manablox command](../help/cli.md).

## What you should see

The command lists every file it wrote, installs the packages and ends with the next steps, for example:

```sh
cd my-site
pnpm dev                     # http://localhost:3005
pnpm types                   # typed content, once the space has a model
```

If `pnpm install` fails (for example because you are offline), the files are still written. Run `pnpm install` inside the folder once the problem is fixed.

## Run it

```sh
cd my-site
pnpm dev
```

Open the address it prints (`http://localhost:3005` for Astro). You should see your home page with the main menu at the top. Click **About**: the address changes to `/about` and the About page appears.

If you see "Something went wrong" instead, the website could not reach the public API. Check that `pnpm dev:public` still runs in your CMS project. If you get "Not found" (or an empty page in Astro), nothing is published at that path yet.

## The files it creates

Every website gets `package.json`, `tsconfig.json`, `pnpm-workspace.yaml`, `.gitignore`, `.env`, `.env.example` and a `README.md` that explains every file. The rest depends on the framework.

### Astro

| File | What it does |
| --- | --- |
| `src/pages/[...slug].astro` | The one page route. It asks the CMS for the document at the current address and renders it |
| `src/pages/preview.astro` | The canvas the visual editor drives |
| `src/layouts/Site.astro` | The HTML around every page |
| `src/components/Blocks.astro` | Renders a list of blocks, each through its component |
| `src/components/blocks/` | One component per block type (`Teaser.astro`) and the registry `index.ts` |
| `src/components/content/` | Components for whole content types, and their registry `index.ts` |
| `src/lib/manablox.ts` | Creates the SDK client, once per server process |
| `src/lib/preview/` | Browser versions of the block renderers, used only by the preview canvas |
| `astro.config.mjs` | Astro settings, including the port |

### Vite + TypeScript (plain)

| File | What it does |
| --- | --- |
| `index.html` | The page shell |
| `src/main.ts` | Creates the client and decides what each address renders |
| `src/router.ts` | Handles link clicks and the back button without reloading the page |
| `src/config.ts` | Reads the settings from `.env` |
| `src/pages.ts` | Renders a document, its menu and a list of its child pages |
| `src/blocks/` | One renderer per block type (`teaser.ts`) and the registry `index.ts` |
| `src/content/` | Renderers for whole content types, and their registry |
| `src/preview.ts` | The canvas the visual editor drives |
| `vite.config.ts` | Vite settings, including the port |

### Vite + Vue and Vite + React (server-rendered)

| File | What it does |
| --- | --- |
| `server.js` | A small Express server. In development it runs Vite with hot reload, in production it serves the build |
| `src/entry-server.ts(x)` | Renders a page to HTML on the server |
| `src/entry-client.ts(x)` | Takes over in the browser |
| `src/pages/Page.vue` or `Page.tsx` | Renders a document |
| `src/pages/Preview.vue` or `Preview.tsx` | The canvas the visual editor drives |
| `src/components/Blocks.vue` or `Blocks.tsx` | Renders a list of blocks |
| `src/components/blocks/` | One component per block type (`Teaser.vue` or `Teaser.tsx`) and the registry `index.ts` |
| `src/components/content/` | Components for whole content types, and their registry |
| `src/lib/manablox.ts` | Creates the SDK client |
| `src/composables/useLoad.ts` (Vue), `src/lib/load.ts` (React) | Loads the page data on the server and reuses it in the browser |

## How routing by permalink works

Every document in Manablox has a permalink: its path on the website, built from its slug and the slugs of its parents. "Hello world" under "Blog" has the permalink `blog/hello-world`.

The starter has no page files per page. It has one catch-all route that handles every address:

1. A visitor opens `/blog/hello-world`.
2. The route calls `client.byPermalink('/blog/hello-world')`, which asks the public API for the published document with that permalink. The main menu is loaded at the same time.
3. If a document comes back, it is rendered. If its content type has a component of its own, that component renders it; otherwise a general article layout shows the title, a `summary` field and the blocks of a `components` field.
4. If nothing is published at that path, the visitor gets a 404 page.
5. If the CMS cannot be reached, the visitor gets a 503 error page that is never cached, so a short outage is not remembered as a missing page.

The address `/` shows the space's home page: the document marked with the star in the admin's content tree. New pages need no code: publish a document in the admin and its permalink works right away.

The menu at the top is the menu with the technical name `main`, as built in the admin under Menus. See [Menus](../admin/menus.md).

## Adding a component for your own block type

Blocks are the building pieces editors stack on a page. The starter looks up each block's type name in a registry (a list that maps a type name to a component). A block type the registry does not know shows the note `No renderer for block type "..."` on the page, so nothing disappears silently.

Say you created a block type `quote` in the admin, with a text field `text` and a text field `author`. Here is how to add it to the Vue starter:

1. Create `src/components/blocks/Quote.vue`:

```vue
<script setup lang="ts">
import { fieldAttribute } from '@manablox/live-preview';
import type { Block } from '@manablox/public-sdk';

const props = defineProps<{ block: Block; path: (string | number)[] }>();
</script>

<template>
  <blockquote v-bind="fieldAttribute(path)">
    <p v-bind="fieldAttribute([...path, 'text'])">{{ block.text }}</p>
    <footer v-if="block.author" v-bind="fieldAttribute([...path, 'author'])">{{ block.author }}</footer>
  </blockquote>
</template>
```

2. Register it in `src/components/blocks/index.ts`:

```ts
import type { Component } from 'vue';
import Quote from './Quote.vue';
import Teaser from './Teaser.vue';

export const blockRenderers: Record<string, Component> = {
  teaser: Teaser,
  quote: Quote,
};
```

3. Save. The dev server reloads, and every `quote` block renders through your component.

Each field value is available directly on the block (`block.text`), named by the field's technical name. The `fieldAttribute(...)` calls add a `data-manablox-field` attribute; they are what lets an editor click the quote in the visual editor and land on the right field. Leave them out and the page still works, only click-to-edit does not.

The other frameworks follow the same pattern. Copy the teaser file next to it and adapt it:

| Framework | Component | Registry |
| --- | --- | --- |
| Astro | `src/components/blocks/Quote.astro` | `src/components/blocks/index.ts` |
| Astro, for the visual editor | `src/lib/preview/blocks/quote.ts` | `src/lib/preview/blocks/index.ts` |
| Vite + TypeScript | `src/blocks/quote.ts` | `src/blocks/index.ts` |
| Vite + React | `src/components/blocks/Quote.tsx` | `src/components/blocks/index.ts` |

Astro needs the component twice: Astro components run only on the server, and the preview canvas renders in the browser, so it has its own small renderers under `src/lib/preview/`.

A whole content type can get its own component the same way, in the `content` folder and its registry. Any type without one uses the general article layout.

## Components from your content model

Instead of writing components by hand, the command can write one for every content type and block type in your space, with one element per field. The website then shows your real fields from the first `pnpm dev`.

The question "Write components for a space's content and block types?" offers three answers:

| Answer | `--model` | What happens |
| --- | --- | --- |
| Yes, from the management API | `management` | Asks for the management API address (default `http://localhost:3000`) and an API key, lists the spaces the key can read, and lets you pick one |
| Yes, from the delivery API above | `delivery` | Reads the types from the public API. No key and no space to pick: the public API serves exactly one space |
| No | `none` | Writes only the example `teaser` block |

For a local project, `delivery` is the easiest: it only needs `pnpm dev:public` running. Use `management` when the public API does not run yet, or when you have several spaces. Create the key in the admin under `Settings > API keys`, see [API keys](../admin/api-keys.md).

Then it asks which types get a component: all of them, or a pick from a list grouped into content types and block types.

The same on the command line:

```sh
pnpm dlx @manablox/cli frontend my-site --yes --framework astro --model delivery --types page,article,teaser
```

```sh
pnpm dlx @manablox/cli frontend my-site --yes --framework vue-ssr --api-key "your-key" --space marketing
```

| Option | Meaning |
| --- | --- |
| `--model management\|delivery\|none` | Where the content model is read from |
| `--api-url` | The management API, default `http://localhost:3000`. Implies `management` |
| `--api-key` | A key that may read the space. Implies `management` |
| `--space` | The space, by technical name or id. Needed when the key can read several spaces |
| `--types` | Comma-separated type names, or `all` (the default). On its own it implies `delivery` |

What you get:

- A component per block type in the blocks folder, and the registry filled in.
- A component per content type in the content folder, and its registry filled in.
- A `fields.ts` file with small helpers that turn field values into something to show: text, dates, rich text, images, links and related documents. An empty field shows nothing.
- An `expand` list on the page request, so images and related documents arrive complete instead of as bare ids.

These components are a starting point, not something the command keeps up to date. If you add a field in the admin later, add a line to its component yourself. If you add a new type, add a component and a line in the registry.

If the command cannot reach the API or the key is refused, it tells you why and offers "Try again" or "Go on without it" (which writes the example teaser).

## Typed content with pnpm types

The website is written in TypeScript, a version of JavaScript that checks your code for mistakes before it runs. `pnpm types` teaches it your content model:

```sh
pnpm types
```

It reads the model from the public API (`/v1/types`) and writes `src/manablox.d.ts`, with one TypeScript interface per content type and block type. You should see a line like `manablox-sdk: wrote 5 types to src/manablox.d.ts`; the number depends on your space.

Run it again whenever the content model changes, and commit the file: the difference to the previous version shows exactly which fields were added, renamed or removed. The [SDK page](./sdk.md#typed-content) shows how to use the types in your code.

## Settings in .env

Your answers are written to `.env`, with a copy in `.env.example` for others:

| Variable | Meaning |
| --- | --- |
| `MANABLOX_URL` | The public API the website reads from |
| `MANABLOX_ADMIN_ORIGIN` | The admin's address; the preview only accepts messages from there |
| `MANABLOX_SPACE_ID` | Only needed when reading from a management API |
| `PORT` | The port of the server (server-rendered frameworks) |

In the `plain` starter the names start with `VITE_` (`VITE_MANABLOX_URL`, ...). Vite copies them into the built files, so after a change you must run `pnpm build` again, and the values must be addresses a visitor's browser can reach.

The three server-rendered starters read the variables when the server starts, so one build can run against any CMS. Your answers are also built into the code as defaults, which is why the website runs without any setup. To point a server at another CMS, set the variable when you start it:

```sh
MANABLOX_URL=https://content.example.com MANABLOX_ADMIN_ORIGIN=https://cms.example.com pnpm start
```

The website never needs an API key: the public API has nothing secret to unlock.

## The visual editor

Tell the space where the website runs, so the admin can show it next to the editor:

1. In the admin, switch to your space, open `Settings > General` and open the **Name and website** card.
2. Set **Website address** to the website's address, for example `http://localhost:3005`, and click **Save changes**.
3. Open a page under Content and click **Visual**.

The website appears next to the fields, and every change you type shows up in it before you save. The full story, and what to check if it says "Waiting for the site...", is in [Preview and the visual editor](./preview.md).

## Build for production

| Framework | Build | Run the build |
| --- | --- | --- |
| Astro | `pnpm build` | `pnpm start` (a Node server) |
| Vite + Vue, Vite + React | `pnpm build` | `pnpm start` (a Node server) |
| Vite + TypeScript | `pnpm build` | Upload the `dist` folder to any static web host. `pnpm preview` tries it locally |

The Node servers listen on `PORT`. Server-rendered pages are sent with a header that lets a CDN keep them for a few minutes, see [Caching](./caching.md).

The `plain` website handles all addresses in the browser, so your web host must answer every path with `index.html`. Most static hosts call this a "single-page app" or "fallback" setting.

Every starter also has `pnpm typecheck`, which checks the code for type errors without building.

For putting the CMS itself online, see [Put it on a server](../going-live/index.md).
