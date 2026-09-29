---
title: "A Nuxt website"
description: "Build a Nuxt website for your Manablox content with the @manablox/nuxt module, step by step: pages by permalink, blocks, the main menu and the visual editor."
---

[Nuxt](https://nuxt.com) is a popular framework for building websites with Vue. The `@manablox/nuxt` module connects a Nuxt site to Manablox: it sets up the SDK, loads the document for the current address, renders blocks, and turns a `/preview` page into the visual editor's canvas.

This page builds a Nuxt website from scratch. If you would rather start from finished code, [the starter website](./starter-website.md) offers Vue, React, Astro and plain TypeScript, and does the same without Nuxt.

## Before you start

- Your CMS runs with `pnpm dev` (admin at `http://localhost:3000`) and the public API with `pnpm dev:public` (at `http://localhost:3100`). See [The public API](./public-api.md).
- The examples use a space made with the **Basic setup**: Page and Article types, a Teaser block and a main menu. With your own content model, change the type and field names to yours.
- Nuxt 4 or newer. Nuxt needs a current Node.js, see [What you need](../getting-started/before-you-begin.md).

## 1. Create a Nuxt project

Open a terminal in the folder where your website should live (not inside your CMS project) and run:

```sh
npx nuxi@latest init my-nuxt-site
```

`nuxi` is Nuxt's own command line tool. It asks a few questions: choose `pnpm` as the package manager, and skip the optional modules. When it is done, go into the new folder:

```sh
cd my-nuxt-site
```

You should see a `nuxt.config.ts`, a `package.json` and an `app` folder with `app.vue` in it.

## 2. Install the module

```sh
pnpm add @manablox/nuxt @manablox/public-sdk
```

`@manablox/nuxt` is the module. `@manablox/public-sdk` is the SDK, which your own components use for things like turning rich text into HTML.

## 3. Tell it where your CMS is

For a CMS made by `manablox create` running on your computer, there is nothing to do: the module reads from the public API at `http://localhost:3100` and accepts the visual editor from the admin at `http://localhost:3000`.

If your CMS runs somewhere else, create a file `.env` in `my-nuxt-site` with its addresses:

```sh
MANABLOX_URL=https://content.example.com
MANABLOX_ADMIN_ORIGIN=https://cms.example.com
```

`MANABLOX_URL` is the public API the website reads from. `MANABLOX_ADMIN_ORIGIN` is the address of your admin; the preview page only accepts drafts from there.

## 4. Configure Nuxt

Open `nuxt.config.ts` and change it to this. Keep the `compatibilityDate` line `nuxi` wrote, with its date:

```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  modules: ['@manablox/nuxt'],

  // The defaults fit a local CMS; see the options below.
  manablox: {
    transport: 'graphql',
  },

  // The Manablox admin already uses port 3000.
  devServer: { port: 3002 },

  // A block of type `teaser` renders <BlockTeaser> from app/components/blocks/Teaser.vue.
  components: [{ path: '~/components/blocks', prefix: 'Block', global: true }, '~/components'],

  routeRules: {
    // The preview is drawn in the browser, from what the admin sends.
    '/preview': { ssr: false },
  },
});
```

What each part does:

| Setting | Meaning |
| --- | --- |
| `modules` | Loads the Manablox module |
| `manablox.transport` | `graphql` (the default) or `rest`. This guide uses GraphQL, where you pick the fields and images come complete |
| `devServer.port` | Runs the website on `http://localhost:3002`, so it does not clash with the admin |
| `components` | Registers every file in `app/components/blocks` globally, with the prefix `Block`, so the module can find a block's component by name |
| `routeRules` | Renders `/preview` only in the browser |

All options of the `manablox` section:

| Option | Default | Meaning |
| --- | --- | --- |
| `url` | `MANABLOX_URL` from `.env`, else `http://localhost:3100` | The public API the website reads from |
| `spaceId` | `MANABLOX_SPACE_ID` from `.env`, else none | Only needed when reading from a management API, see below. The public API ignores it |
| `locale` | `en` | The language to read |
| `transport` | `graphql` | `graphql` or `rest`. Only the public API serves `rest` |
| `apiKey` | none | An API key for server code you write yourself. It never reaches the browser |
| `cache` | `{ ttl: 1000, max: 100 }` | How long the website remembers an answer from the CMS (`ttl`, in milliseconds) and how many answers it keeps (`max`). `false` turns it off |
| `preview.enabled` | `true` | `false` stops the preview page from connecting to the admin |
| `preview.route` | `/preview` | Only recorded. The admin always opens the space's website address plus `/preview`, so keep your preview page there |
| `preview.editorOrigin` | `MANABLOX_ADMIN_ORIGIN` from `.env`, else `http://localhost:3000` | The admin's address, checked on every message from the visual editor |

A project created without the public API (`--no-public`) has only the management API, at `http://localhost:3000` on your computer. To read from it, set `url` to that address, set `spaceId` to your space's id (without it every page is a 404, because the management API serves every space) and keep the `graphql` transport, because the management API has no REST.

## 5. The menu and the page shell

Replace `app/app.vue` with this. It loads the menu called `main` once and shows it above every page:

```vue
<script setup lang="ts">
const { data: menu } = await useAsyncData('menu', () => useManablox().menu('main'));
</script>

<template>
  <div>
    <nav>
      <NuxtLink v-for="item in menu?.items ?? []" :key="item.id" :to="item.href ?? '/'" :target="item.target">
        {{ item.label }}
      </NuxtLink>
    </nav>
    <NuxtPage />
  </div>
</template>
```

`useManablox()` is provided by the module (you do not import it) and returns an SDK client. `menu('main')` is described in [The SDK](./sdk.md#menus).

## 6. One page for every address

Create `app/pages/[...slug].vue`. The name `[...slug]` makes it a catch-all: it handles every address, and the module looks up the document whose permalink matches.

```vue
<script setup lang="ts">
import type { BlocksValue } from '@manablox/public-sdk';
import { richTextToHtml } from '@manablox/public-sdk';

// The fields to load, per content type, in GraphQL.
const SELECTION = `
  ... on Page {
    summary
    components {
      grid
      blocks {
        blockId
        typeName
        layout
        ... on Teaser {
          headline
          body
          image { alt card: variant(preset: "card") }
        }
      }
    }
  }
  ... on Article {
    summary
    body
  }
`;

const { data: page, error } = await useManabloxPage<{
  summary?: string | null;
  body?: unknown;
  components?: BlocksValue;
}>(SELECTION);

if (error.value) {
  throw createError({ statusCode: 503, statusMessage: 'The CMS could not be reached', fatal: true });
}
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

useHead({ title: page.value.title });

const body = computed(() => (page.value?.body ? richTextToHtml(page.value.body) : ''));
</script>

<template>
  <article v-if="page">
    <h1>{{ page.title }}</h1>
    <p v-if="page.summary">{{ page.summary }}</p>
    <div v-if="body" v-html="body" />
    <ManabloxBlocks v-if="page.components" :blocks="page.components" field="components" />
  </article>
</template>
```

What happens here:

- `useManabloxPage(SELECTION)` takes the current address, asks the public API for the document with that permalink, and loads it on the server. The browser reuses the result instead of asking again.
- With `transport: 'rest'` there is no selection. Images and related documents then arrive as ids unless you name them: `useManabloxPage({ expand: ['hero', 'author'] })` delivers those fields whole.
- `SELECTION` lists the fields to load for each content type, in GraphQL (see [GraphQL](./graphql.md)). The basic fields such as `title` are always included.
- No document means a 404 page; a CMS that cannot be reached means a 503 page. Keeping them apart matters: an outage should not look like a missing page.
- `richTextToHtml` turns a rich text field into safe HTML, which is why `v-html` is fine here. Never use `v-html` with any other CMS text.
- `<ManabloxBlocks>` renders the blocks of the `components` field, each with the component named after its type, laid out on the editor's grid.

## 7. A component per block type

Create `app/components/blocks/Teaser.vue`. `<ManabloxBlocks>` passes each field of the block as a prop:

```vue
<script setup lang="ts">
import { richTextToHtml } from '@manablox/public-sdk';

const props = defineProps<{
  headline?: string;
  body?: unknown;
  image?: { alt?: string | null; card?: string } | string | null;
}>();

const html = computed(() => (props.body ? richTextToHtml(props.body) : ''));
const picture = computed(() => (props.image && typeof props.image === 'object' ? props.image : null));
</script>

<template>
  <section class="teaser">
    <img v-if="picture?.card" :src="picture.card" :alt="picture.alt ?? ''" />
    <h2 v-if="headline">{{ headline }}</h2>
    <div v-if="html" v-html="html" />
  </section>
</template>
```

The file name decides which block type it renders: the module turns the type name into PascalCase and adds the prefix, so `teaser` renders `<BlockTeaser>` and a type `image_gallery` would render `<BlockImageGallery>` from `ImageGallery.vue`. Give each block component a single root element; the module puts the attributes the visual editor needs on it.

For a new block type, add a file here and add its fields to `SELECTION` with `... on YourType { ... }`.

## 8. Try it

```sh
pnpm dev
```

Open `http://localhost:3002`. You should see the menu and your home page. Click **About**, then **Blog**. Open `http://localhost:3002/blog/hello-world` to see the article.

If Nuxt shows a 503 error, check that `pnpm dev:public` runs in your CMS project and, if you set one, that `MANABLOX_URL` in `.env` is right. If you see a 404 for a page you know exists, check that it is published.

## 9. The preview page for the visual editor

Create `app/pages/preview.vue`:

```vue
<script setup lang="ts">
import type { BlocksValue } from '@manablox/public-sdk';
import { normaliseFields } from '@manablox/public-sdk';

// The admin sends fields in its own storage shape; this gives them the shape the SDK uses.
function draftBlocks(fields: Record<string, unknown>) {
  return normaliseFields(fields).components as BlocksValue | undefined;
}
</script>

<template>
  <ManabloxPreview v-slot="{ document, fields }">
    <article>
      <h1>{{ document.title || 'Untitled' }}</h1>
      <p v-if="fields.summary">{{ fields.summary }}</p>
      <ManabloxBlocks v-if="draftBlocks(fields)" :blocks="draftBlocks(fields)" field="components" />
    </article>
  </ManabloxPreview>
</template>
```

`<ManabloxPreview>` connects to the admin, checks that messages come from the admin's address (`preview.editorOrigin`), and renders its content with the draft being edited. Until the admin connects it shows "Waiting for the editor...", which is what you see when you open `/preview` directly.

Now tell the admin where the website is:

1. In the admin, switch to your space, open `Settings > General` and open the **Name and website** card.
2. Set **Website address** to `http://localhost:3002` and click **Save changes**.
3. Open a Page under Content and click **Visual**.

You should see your page next to the fields, and **Live preview connected** in the header. Change the title: the page follows as you type. Click a block on the page to open it in the panel; each block also gets a small toolbar to move, add or delete blocks. See [Preview and the visual editor](./preview.md) for everything editors can do, and what to check if it does not connect.

Images of a draft arrive as ids, not as finished image addresses, so the teaser shows them only on the published page. That is why the component checks that `image` is an object.

## 10. Build for production

```sh
pnpm build
node .output/server/index.mjs
```

`pnpm build` writes the finished website to `.output`. The second command starts it; it listens on port 3000 unless you set `PORT`, for example `PORT=3002 node .output/server/index.mjs`.

The values from `nuxt.config.ts` and `.env` are fixed when you build. To point a built website at other addresses, set `NUXT_PUBLIC_MANABLOX_URL` and `NUXT_PUBLIC_MANABLOX_PREVIEW_EDITOR_ORIGIN` (and, if you use them, `NUXT_PUBLIC_MANABLOX_SPACE_ID` and `NUXT_PUBLIC_MANABLOX_TRANSPORT`) when you start it; Nuxt uses them instead. On a server both must be `https` addresses, see [Domains and HTTPS](../going-live/domains-and-https.md).

For how fast a publish shows up on the site, see [Caching](./caching.md).

## What the module provides

| Name | What it is |
| --- | --- |
| `useManablox()` | The SDK client, set up from your `manablox` options. Every call returns the same client, and on the server each visit gets its own |
| `useManabloxPage(selection)` or `useManabloxPage({ selection, expand })` | Loads the document for the current address, on the server, and reuses it in the browser. `expand` names the image and relation fields to deliver whole on `rest` |
| `useManabloxPreviewState()` | The draft the admin sends while the page is open in the visual editor, for components outside `<ManabloxPreview>` such as a layout. `null` everywhere else |
| `<ManabloxBlocks>` | Renders a blocks field. Props: `blocks`, `field` (default `components`), `prefix` (default `Block`), `grid`, `gap` |
| `<ManabloxPreview>` | The visual editor's canvas. Its slot receives `document` and `fields` |

All of them are available everywhere without an import.
