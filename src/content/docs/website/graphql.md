---
title: "GraphQL"
description: "Ask the public API for exactly the fields a page needs, with one query. A beginner's introduction to the Manablox GraphQL API, with examples and tools to try it."
---

GraphQL is a way to ask an API for data by describing the shape of the answer you want. Instead of calling several addresses, you send one query to one address, and the answer has exactly the fields you asked for, nothing more.

You do not need GraphQL to build a website with Manablox. The [SDK](./sdk.md) with its REST transport is simpler for beginners. GraphQL is worth learning when your team already uses it, or when a page needs only a few fields of large documents.

## The address

Every query is a `POST` request to `/graphql` on the public API:

| Project | Address |
| --- | --- |
| `local`, while you develop | `http://localhost:3100/graphql` |
| On a server | `https://<your public API domain>/graphql` |

The request body is JSON with a `query` and, optionally, `variables`. The public API only returns published content of the space it serves, and it needs no login or key.

## Your first query

A query lists the fields you want, nested like the answer. This one asks for the title and permalink of the document at `/about`:

```graphql
{
  contentByPermalink(permalink: "about") {
    title
    permalink
  }
}
```

The answer mirrors the query:

```json
{
  "data": {
    "contentByPermalink": {
      "title": "About",
      "permalink": "about"
    }
  }
}
```

Send it from a terminal with `curl`:

```sh
curl -X POST http://localhost:3100/graphql -H 'content-type: application/json' -d '{"query":"{ contentByPermalink(permalink: \"about\") { title permalink } }"}'
```

You should see the JSON above. If you see `"contentByPermalink": null`, nothing is published at `about` in the space the public API serves. If `curl` cannot connect, start the public API with `pnpm dev:public` in your CMS project.

## How your content model becomes a schema

A schema is the list of everything you can ask for. Manablox builds it from your content model, so it changes when you add a content type or a field in the admin:

- Each content type becomes a GraphQL type, named in PascalCase: `page` becomes `Page`, `blog-post` becomes `BlogPost`.
- Each block type becomes a type too: `teaser` becomes `Teaser`.
- Field names are written in camelCase: `meta_description` becomes `metaDescription`.
- Fields that only some roles may read are left out of the public schema.

Every content type shares a set of basic fields, through an interface called `ContentNode`:

| Field | Meaning |
| --- | --- |
| `id` | The document's id |
| `typeName` | The content type's technical name, for example `page` |
| `title`, `slug`, `permalink` | Title, slug and full path |
| `locale` | The language of this version |
| `status` | The publishing status |
| `publishedAt`, `updatedAt` | Dates |

Content types also have `parent` and `children`, to walk the page tree.

Fields that belong to one type only are asked for with `... on TypeName { }`. This is called an inline fragment; it means "if the document is a Page, also give me these fields".

## The questions you can ask

| Query | What it returns |
| --- | --- |
| `contentByPermalink(permalink: "...", locale: "...")` | The document at a path. `""` is the home page |
| `content(id: "...")` | One document by its id |
| `contentsPage(type, parentId, under, search, tags, locale, limit, offset)` | A list of documents as `{ items, total, limit, offset }`: the documents in `items`, and `total` for page numbers. `tags` takes tag slugs, comma separated, and keeps documents carrying any of them. `limit` defaults to 25 and is at most 100 |
| `menu(name: "main", locale: "...")` | A menu with its entries |
| `redirects(locale: "...")` | Every redirect of a language, see [Redirects](../admin/redirects.md#use-them-on-your-own-website) |
| `asset(id: "...")` | One image or file |

`locale` is optional everywhere and defaults to the space's default language.

## A page with its blocks

A blocks field has two parts: `grid` (the layout an editor set, or `null`) and `blocks`. Every block has a `blockId`, a `typeName` and a `layout`, plus the fields of its block type. With a space made by the **Basic setup**:

```graphql
query Page($permalink: String!) {
  contentByPermalink(permalink: $permalink) {
    title
    ... on Page {
      summary
      components {
        grid
        blocks {
          blockId
          typeName
          ... on Teaser {
            headline
            body
            image {
              alt
              width
              height
              card: variant(preset: "card")
            }
          }
        }
      }
    }
  }
}
```

With the variables `{ "permalink": "about" }` it returns the About page, its summary and its teasers.

A few things this query shows:

- `$permalink` is a variable. You send its value next to the query, so the query text never changes.
- `body` is a rich text field. It arrives as structured JSON; turn it into HTML with the SDK's `richTextToHtml`, see [The SDK](./sdk.md#rich-text).
- Images arrive as objects with `url` (the original), `alt`, `width` and `height`. `variant(preset: "card")` returns the address of a resized copy; `card: ...` renames it in the answer. The presets are `thumb`, `card` and `hero`.
- Related documents and images are always included as objects. There is nothing to expand.

## A list and a menu

The first ten articles, with their summaries, and how many articles there are in total:

```graphql
{
  contentsPage(type: "article", limit: 10) {
    total
    items {
      title
      permalink
      ... on Article {
        summary
      }
    }
  }
}
```

For the next ten, add `offset: 10`.

The main menu, two levels deep:

```graphql
{
  menu(name: "main") {
    items {
      label
      url
      target
      content { permalink }
      children {
        label
        url
        content { permalink }
      }
    }
  }
}
```

A menu entry points either to a document (`content`) or to an external address (`url`). Build a link from `url` when it is set, otherwise from `/` plus `content.permalink`. The SDK does this for you and calls the result `href`.

## Tools to try queries

Writing queries is easier in a tool that suggests field names as you type. The public API keeps its schema private by default, so tools cannot read it. To switch that on while you develop:

1. Open `.env` in your CMS project and set `PUBLIC_GRAPHQL_INTROSPECTION=true`.
2. Restart `pnpm dev:public` (stop it with Ctrl+C, then start it again).
3. Open `http://localhost:3100/graphql` in your browser.

You should see GraphiQL, an editor for GraphQL queries: type on the left, press the run button, and read the answer on the right. Press Ctrl+Space for suggestions.

:::caution
Set `PUBLIC_GRAPHQL_INTROSPECTION` back to `false` before you go live. With it on, anyone can read the full list of your content types and fields.
:::

Any other GraphQL client works too, including desktop tools such as Postman or Insomnia: point it at the address above.

## From your website

With the SDK on its GraphQL transport, you only write the part that is specific to a type; the basic fields are added for you:

```ts
import { createClient } from '@manablox/public-sdk';

const cms = createClient({ url: 'http://localhost:3100', transport: 'graphql' });

const page = await cms.byPermalink('/about', {
  selection: '... on Page { summary components { grid blocks { blockId typeName ... on Teaser { headline body } } } }',
});

const data = await cms.query('{ contentsPage(type: "article", limit: 5) { items { title permalink } } }');
```

`cms.query` runs any query you write. Any other GraphQL library, or plain `fetch`, works the same way.

## Limits

To protect the server, the public API refuses queries that nest too deep (more than 8 levels) or are too expensive (a complexity score above 1000). Normal page queries stay far below both. A refused query answers with an error whose `extensions.key` is `graphql.query.tooDeep` or `graphql.query.tooComplex`, and `graphql.introspection.disabled` while the schema is private. A `limit` below 1 or above 100 is refused with `query.limit.invalid`, a negative `offset` with `query.offset.invalid`. There are no mutations (queries that change data): the public API is read-only.

## Errors

A GraphQL answer can hold `data` and `errors` side by side. Each error has a `message` and, under `extensions`, the same fields the REST API uses: a `key` that names the problem (for example `content.notFound`), its `kind`, its `status` and `details`:

```json
{
  "errors": [
    {
      "message": "Query exceeds the maximum depth of 8",
      "extensions": {
        "code": "QUERY_TOO_DEEP",
        "key": "graphql.query.tooDeep",
        "kind": "bad_request",
        "status": 400,
        "maxDepth": 8,
        "details": [{ "key": "graphql.query.tooDeep", "params": { "maxDepth": 8 } }]
      }
    }
  ]
}
```

Check `extensions.key` in your code, not the message. An unexpected error has no key and only says "Unexpected error".

The HTTP status tells you whether the query ran at all:

| Status | Meaning |
| --- | --- |
| `200` | The query ran. Errors in single fields (for example an unknown content type) are listed in `errors`, next to the rest of the answer |
| `400` | The whole query was refused: it could not be read, asks for fields that do not exist, or is too deep or too expensive. Clients that send `Accept: application/graphql-response+json`, as the SDK does, get 400; plain `application/json` clients get 200 with only `errors` |
| `404` | The space is not available, for example while it is being imported |
| `429` | Too many requests from your address in a short time |
| `503` | The public API does not know which space to serve yet, see [The public API](./public-api.md#which-space-it-serves) |
