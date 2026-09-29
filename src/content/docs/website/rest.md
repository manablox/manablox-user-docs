---
title: "REST"
description: "Read published content with plain web addresses: the REST routes of the public API, what a document looks like, lists, menus, images and errors."
---

REST is the simplest way to read content from Manablox: every question is a plain web address, and the answer is JSON. You can try it in your browser, with `curl` in a terminal, or from any programming language. There is nothing to install.

REST is served by the public API only, and it is read-only. All addresses below start with the public API's address: `http://localhost:3100` in a `local` project.

## Try it

With the public API running (`pnpm dev:public` in your CMS project) and a space made by the **Basic setup**, open this address in your browser:

```
http://localhost:3100/v1/permalink/about
```

You should see the About page as JSON. Or, in a terminal:

```sh
curl http://localhost:3100/v1/permalink/about
```

If the browser shows an error page with status 404, nothing is published at `about` in the space the public API serves. If it cannot connect at all, the public API is not running.

## The routes

| Route | Returns |
| --- | --- |
| `GET /v1/permalink/{path}` | The document at a path, for example `/v1/permalink/blog/hello-world` |
| `GET /v1/permalink` | The space's home page (the document with the star in the content tree) |
| `GET /v1/content/{id}` | One document by its id |
| `GET /v1/content` | A list of documents, see [Lists](#lists) |
| `GET /v1/menus/{name}` | A menu by its technical name, for example `/v1/menus/main` |
| `GET /v1/redirects` | Every redirect of a language, see [Redirects](../admin/redirects.md#use-them-on-your-own-website) |
| `GET /v1/assets/{id}` | An image or file: its details and the addresses of its sizes |
| `GET /v1/types` | The content model of the space, used to generate TypeScript types |
| `GET /openapi.json` | A machine-readable description of all routes (OpenAPI) |
| `GET /` | A short overview of what this API serves |

These query parameters work on most routes:

| Parameter | Meaning | Works on |
| --- | --- | --- |
| `locale` | The language, for example `?locale=de`. Default: the space's default language | permalink, content list, menus |
| `expand` | Relation fields to include in full, comma separated: `?expand=image,author` | permalink, content, content list, menus |

## What a document looks like

```sh
curl 'http://localhost:3100/v1/permalink/about?expand=image'
```

```json
{
  "id": "4f0c...",
  "type": "page",
  "title": "About",
  "slug": "about",
  "permalink": "about",
  "locale": "en",
  "parentId": null,
  "publishedAt": "2026-09-06T09:00:00.000Z",
  "updatedAt": "2026-09-06T09:00:00.000Z",
  "fields": {
    "summary": "What My Site is about.",
    "components": {
      "grid": null,
      "blocks": [
        {
          "blockId": "9a1e...",
          "type": "teaser",
          "fields": {
            "headline": "About us",
            "body": { "type": "doc", "content": [] },
            "image": null
          }
        }
      ]
    }
  }
}
```

- `type` is the technical name of the content type.
- `fields` holds every field, by its technical name. The whole document arrives at once; there is nothing to select.
- A blocks field is `{ grid, blocks }`. Each block has a `blockId`, a `type` (the block type's technical name) and its own `fields`. Blocks placed on a grid also carry a `layout`.
- A rich text field (`body`) is structured JSON. The SDK's `richTextToHtml` turns it into safe HTML, see [The SDK](./sdk.md#rich-text).

## Relations and expand

A field that points to something else (an image, another document, a user) holds only an id by default. Name it in `expand` to get the whole object instead:

```sh
curl 'http://localhost:3100/v1/permalink/blog/hello-world?expand=image'
```

Now `fields.image` is an object like this:

```json
{
  "id": "c2d4...",
  "url": "http://localhost:3100/media/c2d4.../original",
  "filename": "team.jpg",
  "mimeType": "image/jpeg",
  "width": 1600,
  "height": 900,
  "alt": "Our team",
  "variants": {
    "thumb": "http://localhost:3100/media/...",
    "card": "http://localhost:3100/media/...",
    "hero": "http://localhost:3100/media/..."
  }
}
```

`url` is the original file. `variants` are ready-made sizes: `thumb` (320 pixels), `card` (640) and `hero` (1920). Use them directly in `<img>` tags; they are signed by the CMS, so do not try to build such addresses yourself.

`expand` also works for fields inside blocks. A related document that is not published, or an image nothing published uses, is left out.

## Lists

`GET /v1/content` returns documents page by page:

```sh
curl 'http://localhost:3100/v1/content?type=article&limit=10'
```

```json
{ "items": [], "total": 1, "limit": 10, "offset": 0 }
```

(`items` holds the documents, in the same shape as above.)

| Parameter | Meaning |
| --- | --- |
| `type` | Only this content type, by its technical name |
| `parentId` | Only the direct children of this document id |
| `under` | Everything below this document id, at any depth |
| `search` | A search term |
| `tags` | Only documents carrying at least one of these tags, by tag slug, comma separated: `?tags=travel,food` (up to ten) |
| `limit` | How many to return: 1 to 100, default 25. A larger number is refused with status 422 |
| `offset` | How many to skip. For page 2 with 10 per page: `offset=10` |
| `locale`, `expand` | As above |

`total` is the number of matching documents, so you can work out how many pages there are.

## Menus

```sh
curl http://localhost:3100/v1/menus/main
```

```json
{
  "id": "...",
  "name": "Main navigation",
  "machineName": "main",
  "items": [
    { "id": "...", "label": "About", "url": null, "target": "_self", "content": { "type": "page", "title": "About", "permalink": "about" }, "children": [] },
    { "id": "...", "label": "Shop", "url": "https://shop.example.com", "target": "_blank", "content": null, "children": [] }
  ]
}
```

An entry points either to a document (`content`, shortened above) or to an external address (`url`). Link to `url` when it is set, otherwise to `/` plus `content.permalink`. Entries can be nested to any depth through `children`.

## Errors

| Status | Meaning |
| --- | --- |
| `200` | Here is your content |
| `304` | Not modified: your cached copy is still current (see [Caching](./caching.md)) |
| `400` | The request could not be read |
| `404` | Nothing published here: no such document, menu, image or content type |
| `422` | A parameter is invalid, for example `limit=500` or an id that is not an id |
| `429` | Too many requests from your address in a short time; wait a moment |
| `503` | The public API does not know which space to serve yet, see [The public API](./public-api.md#which-space-it-serves) |
| `5xx` | The CMS could not answer. Show an error page, not a 404 |

Every error answer has the same JSON body:

```json
{
  "error": {
    "key": "content.notFound",
    "kind": "not_found",
    "status": 404,
    "message": "content.notFound",
    "details": [{ "key": "content.notFound", "params": { "id": "22222222-2222-4222-8222-222222222222" } }]
  }
}
```

- `key` names the problem. It never changes between versions, so your code can check it, for example `content.notFound` or `rateLimit.exceeded`.
- `kind` is the group it belongs to: `validation`, `not_found`, `bad_request`, `rate_limited`, `unavailable` or `internal`, among others.
- `details` lists the single problems. For an invalid parameter (`validation.failed`) there is one entry per parameter, with its name in `path` and the rule it broke in `params`.

The public API never shows detailed error messages, so it cannot leak anything about the server: `message` repeats the key, and an unexpected error only says `internal.error`.

## From JavaScript

Plain `fetch` works:

```js
const response = await fetch('http://localhost:3100/v1/permalink/about');
if (response.status === 404) {
  // show your 404 page
} else if (!response.ok) {
  // the CMS could not answer: show an error page
} else {
  const page = await response.json();
  console.log(page.title, page.fields.summary);
}
```

The [SDK](./sdk.md) does the same with less code, and adds retries, a small cache and helpers for rich text, blocks and images. Create it with `transport: 'rest'` to use these routes.
