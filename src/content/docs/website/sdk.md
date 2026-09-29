---
title: "The SDK"
description: "@manablox/public-sdk is a small JavaScript library that reads your content from the public API. Install it, create a client, and fetch pages, lists, menus and images."
---

An SDK (software development kit) is a library that does the talking to an API for you. `@manablox/public-sdk` reads published content from Manablox: you ask for "the page at `/about`" or "the menu called `main`" and get plain JavaScript objects back. It works in the browser, in Node and on edge servers, and it has no dependencies of its own.

The [starter website](./starter-website.md) already uses it. This page is for when you add it to a website of your own, or want to understand what the starter does.

## Install

In your website's folder:

```sh
pnpm add @manablox/public-sdk
```

(`npm install @manablox/public-sdk` works the same.) You should see the package appear under `dependencies` in `package.json`.

## Create a client

A client is an object that knows where your CMS is. Create one and reuse it for every request:

```ts
import { createClient } from '@manablox/public-sdk';

const cms = createClient({
  url: 'http://localhost:3100',
  transport: 'rest',
});
```

`url` is the address of the public API. In a `local` project that is `http://localhost:3100`; on a server it is your public API's domain. `transport: 'rest'` makes every document arrive complete, which is the simplest choice. Without it the client uses GraphQL, where you list the fields you want, see [Choosing a transport](#choosing-a-transport).

| Option | Meaning |
| --- | --- |
| `url` | The address of the API. Required |
| `transport` | `'rest'` or `'graphql'` (the default) |
| `locale` | The language to read, for example `'de'`. Defaults to the space's default language |
| `spaceId` | Only when you read from a management API; the public API serves one space |
| `cache` | `{ ttl, max }`: keep answers in memory for `ttl` milliseconds (default 1000), at most `max` of them. `false` turns it off |
| `timeout` | How long one request may take, in milliseconds. Default 10000 |
| `retry` | `{ attempts, baseDelay, maxDelay }`: how often a failed request is tried again. Default 3 attempts |
| `headers` | Extra HTTP headers for every request |
| `fetch` | Your own `fetch` function, if your platform needs one |

## Try it in two minutes

You can try the SDK without a website. Make an empty folder, install the package there with `pnpm add @manablox/public-sdk`, and create a file `try.mjs`:

```js
import { createClient } from '@manablox/public-sdk';

const cms = createClient({ url: 'http://localhost:3100', transport: 'rest' });

const page = await cms.byPermalink('/about');
console.log(page ? page.title : 'Nothing published at /about');
```

Run it with `node try.mjs`. With a space made by the **Basic setup** and the public API running (`pnpm dev:public` in your CMS project), it prints `About`.

## Fetch a page by its permalink

```ts
const page = await cms.byPermalink('/blog/hello-world');

if (!page) {
  // nothing is published at this path: show your 404 page
} else {
  console.log(page.title);    // "Hello world"
  console.log(page.type);     // "article", the content type's technical name
  console.log(page.summary);  // a field, by its technical name
}
```

`byPermalink` takes the path of the address, with or without slashes. `'/'` or `''` returns the space's home page. It returns `null` when nothing is published at that path.

Every field is available directly on the document (`page.summary`) and also under `fields` (`page.fields.summary`). Use whichever reads better.

Other ways to get one document:

| Call | Returns |
| --- | --- |
| `cms.byPermalink(path)` | The document at a path, or `null` |
| `cms.get(id)` | One document by its id, or `null` |

## List documents

`list` returns several documents at once, for example the latest articles for a blog page:

```ts
const result = await cms.list({ type: 'article', limit: 10 });

for (const article of result.items) {
  console.log(article.title, '/' + article.permalink);
}
console.log(`${result.total} articles in total`);
```

| Argument | Meaning |
| --- | --- |
| `type` | Only documents of this content type (its technical name) |
| `parentId` | Only the direct children of this document id |
| `under` | Everything below this document id, at any depth |
| `search` | A search term |
| `tags` | Tag slugs, for example `['travel', 'food']`: only documents carrying at least one of them |
| `limit` | How many to return. Default 25, at most 100; a larger number throws an error |
| `offset` | How many to skip, for "page 2" links |

The answer is `{ items, total, limit, offset }`. `total` counts every matching document, on both transports, so you can build page numbers from it.

To list the articles below the Blog page:

```ts
const blog = await cms.byPermalink('/blog');
const articles = blog ? await cms.list({ parentId: blog.id }) : null;
```

## Menus

Menus are built by editors in the admin under Menus. Ask for one by its technical name:

```ts
const menu = await cms.menu('main');

for (const item of menu?.items ?? []) {
  console.log(item.label, item.href, item.target);
  // item.children holds the entries nested under this one
}
```

Each entry has a `label`, an `href` you can put straight into a link (a page's path, or an external address), a `target` (`_self` or `_blank`) and `children`. `menu()` returns `null` when no menu has that name.

## Redirects

`cms.redirects()` returns every redirect of the language, so your website can forward old addresses. See [Redirects](../admin/redirects.md#use-them-on-your-own-website).

## Blocks

A blocks field (the starter model calls it `components`) holds the blocks an editor stacked on a page. Its value is `{ grid, blocks }`. `blocksOf` gives you the list:

```ts
import { blocksOf } from '@manablox/public-sdk';

for (const block of blocksOf(page.components)) {
  if (block.type === 'teaser') {
    console.log(block.headline);
  }
}
```

Each block has a `blockId`, a `type` (the block type's technical name) and its fields directly on it. If an editor arranged the blocks on a grid, `grid` describes the columns per screen size. The SDK exports helpers that turn it into CSS (`BLOCK_GRID_CSS`, `blocksGridStyle`, `blockLayoutStyle`); the starter website shows how they are used.

## Rich text

A rich text field arrives as structured data, not as HTML. Turn it into HTML with `richTextToHtml`:

```ts
import { isRichTextEmpty, richTextToHtml, richTextToText } from '@manablox/public-sdk';

if (!isRichTextEmpty(page.body)) {
  const html = richTextToHtml(page.body);   // '<p>Some <strong>bold</strong> text</p>'
  const plain = richTextToText(page.body);  // 'Some bold text', for a meta description
}
```

`richTextToHtml` escapes all text and only produces a fixed list of safe tags, so its output is safe to insert with `innerHTML`, Vue's `v-html` or Astro's `set:html`. Never insert any other CMS text that way.

## Images

An image field holds an asset: a file from the asset library. On the REST transport it arrives as an id unless you ask for it to be expanded (included in full):

```ts
import { assetSrcSet, assetUrl, isImage } from '@manablox/public-sdk';

const article = await cms.byPermalink('/blog/hello-world', { expand: ['image'] });
const image = article?.image;

if (image && typeof image === 'object' && isImage(image)) {
  const src = assetUrl(image, { preset: 'card' });
  const srcset = assetSrcSet(image, { thumb: 320, card: 640, hero: 1920 });
  const html = `<img src="${src}" srcset="${srcset}" alt="${image.alt ?? ''}">`;
}
```

`expand` takes the technical names of the fields to include in full. It works for images, related documents and users, and also inside blocks. On the GraphQL transport relations always arrive as objects.

A preset is a size the CMS prepares for you. Every project has three:

| Preset | Width |
| --- | --- |
| `thumb` | 320 pixels (fits inside 320 x 320) |
| `card` | 640 pixels |
| `hero` | 1920 pixels |

They are served as WebP and respect the crop and focal point an editor set in the admin. `assetUrl(image)` without a preset returns the original file. An unknown preset also falls back to the original, so a typo never gives a broken image. `assetSrcSet` builds a `srcset`, so the browser picks the smallest size that looks sharp.

To load one asset by id: `await cms.asset(id)`.

## Languages

Every call reads the space's default language unless you say otherwise:

```ts
const german = await cms.byPermalink('/about', { locale: 'de' });

const de = cms.withLocale('de');   // a client that always reads German
const menu = await de.menu('main');
```

See [Languages and translations](../content-model/localisation.md).

## When something goes wrong

- Nothing published at a path: `byPermalink` and `get` return `null`. Show a 404 page.
- The CMS is down or too slow: the call throws an error after a few retries. Show an error page, and do not cache it.

```ts
let page = null;
try {
  page = await cms.byPermalink(path);
} catch (error) {
  // the CMS could not answer: render a 503 error page instead of a 404
  console.error(error);
}
```

The errors the SDK throws itself all extend `ManabloxError`:

| Error | When | Useful properties |
| --- | --- | --- |
| `ManabloxHttpError` | The API answered with an error status | `status`, `key` (for example `content.notFound`), `details`, `isNotFound`, `isRateLimited` |
| `ManabloxGraphQLError` | A GraphQL answer carried errors | `status` (200 for errors in single fields, 4xx or 5xx when the whole query was refused), `key` (for example `graphql.query.tooDeep`), `errors` |
| `ManabloxTimeoutError` | A request took longer than `timeout` | |
| `ManabloxAbortError` | You cancelled the request | |

The `key` is the same one the API sends in its error body, see [REST](./rest.md#errors) and [GraphQL](./graphql.md#errors). Answers with status 429 or 5xx (including the 503 of a public API that has no space yet) are tried again before the error is thrown.

When the CMS cannot be reached at all, you get your platform's normal network error instead, so treat any error as "the CMS could not answer". Keeping "not found" and "CMS unreachable" apart matters: otherwise a short outage turns every page into a 404.

## Choosing a transport

| | `rest` | `graphql` (default) |
| --- | --- | --- |
| What arrives | The whole document, every field | The basic fields, plus what you list in `selection` |
| Related images and documents | Ids, unless named in `expand` | Always objects |
| Image presets | `assetUrl(image, { preset })` works | Ask for `variant(preset: "card")` in the selection |
| Needs | Nothing | Knowing a little GraphQL |

With GraphQL you pass the extra fields you need as `selection`:

```ts
const cms = createClient({ url: 'http://localhost:3100' });

const page = await cms.byPermalink('/about', {
  selection: '... on Page { summary }',
});
```

`cms.query(query, variables)` runs any GraphQL query you write yourself (GraphQL transport only). See [GraphQL](./graphql.md).

## Caching in the client

Each client keeps answers in memory for a short time (one second by default) and merges identical requests that run at the same moment. So when your layout and your page both ask for the main menu, only one request goes out. Pass `{ fresh: true }` to skip the memory for one call:

```ts
const page = await cms.byPermalink('/about', { fresh: true });
```

On a server, create one client per process and keep `ttl` short. See [Caching](./caching.md) for how this fits with the caches in the CMS.

## Typed content

If your website uses TypeScript, the SDK can write types for your content model, so your code editor knows which fields a page has and what kind of value each one holds:

```sh
pnpm exec manablox-sdk types --url http://localhost:3100 --out src/manablox.d.ts
```

You should see `manablox-sdk: wrote ... types to src/manablox.d.ts`. The file has one interface per content type and block type, named after the technical name (`page` becomes `Page`, `blog-post` becomes `BlogPost`), a `Content` type that is any of your content types, and a `ContentByName` map. Use them like this:

```ts
import type { Article } from './manablox';

const article = await cms.byPermalink<Article>('/blog/hello-world');
article?.summary;   // typed as string, null or missing
article?.date;      // your code editor suggests every field of Article
```

A relation field is typed as "an id or an object", because it arrives as an id unless you expand it. Run the command again whenever the content model changes, and commit the file. The starter website has it as `pnpm types`.

| Option | Meaning |
| --- | --- |
| `--url` | The public API. Defaults to the `MANABLOX_URL` environment variable |
| `--out` | The file to write. Without it the types are printed |
| `--prefix` | Put in front of every interface name, if your own types already use those names |

## Showing drafts

This client only ever reads published content. For reading drafts on your own server, the SDK has a second entry point, `@manablox/public-sdk/preview`, that talks to the management API with an API key. See [Preview and the visual editor](./preview.md#drafts-on-your-own-server).
