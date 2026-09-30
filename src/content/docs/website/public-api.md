---
title: "The public API"
description: "The public API is the read-only part of Manablox your website talks to. Why it is separate, how to start it, and how it decides which space to serve."
---

The public API is a second Manablox server that runs next to the admin. It serves the published content of your spaces to your website, and nothing else: no drafts, no login, no way to change anything. It is the API your website, the [SDK](./sdk.md) and the [starter website](./starter-website.md) talk to.

## Why a separate server?

The management API (the one the admin uses) can do everything: read drafts, change content, manage users. That power is exactly what you do not want facing the whole internet. The public API is the same program started in a locked-down mode:

- It only reads published content. The code for reading drafts is not even switched on, so a draft cannot leak, whatever a request looks like.
- It has no login and ignores passwords and API keys. Every visitor is treated the same, which is also what makes it easy to cache.
- Every request is answered from one space. Other spaces, and their content types, are invisible to that request.
- With Postgres, it connects to the database with a user that may only read. Your project set this user up for you (`PUBLIC_DATABASE_URL` in `.env`). SQLite, a database that is a single file, has no users: there the public API opens the same file as the admin, and the locked-down mode described here is its protection. See [The database](../your-project/database.md#the-public-api-on-sqlite).
- Any website may call it from the browser (CORS allows every origin), because there is nothing private to protect.
- Error messages are always hidden, and each visitor's address may send about 300 requests per minute.

Because it only reads, you can run it on its own, put a CDN in front of it, or run several copies without any risk to your content.

## Start it

In a `local` project, the public API is not started by `pnpm dev`. Open a second terminal in your CMS project and run:

```sh
pnpm dev:public
```

`pnpm dev:public` starts the public API with the settings in `manablox.public.config.ts` and restarts it when that file changes. It listens on `http://localhost:3100` (the `PUBLIC_PORT` in `.env`).

To check that it runs, open `http://localhost:3100/` in your browser. You should see something like:

```json
{
  "name": "Manablox Public API",
  "version": "1.0.0",
  "space": "5e2c0a7e-...",
  "surfaces": { "graphql": "/graphql", "rest": "/v1", "openapi": "/openapi.json", "media": "/media/{assetId}/{variant}" }
}
```

`space` is the id of the space it serves at this address. The other lines list what it offers: [GraphQL](./graphql.md), [REST](./rest.md), a machine-readable description of the REST routes, and images.

Keep both terminals open while you work: `pnpm dev` for the admin, `pnpm dev:public` for the website. `pnpm start:public` starts it without watching for changes, as you would on a server. In a `docker` project it runs as its own container, see [Put it on a server](../going-live/index.md).

## Which space it serves

For every request, the public API decides which space answers, in this order:

1. **A pinned space.** If `MANABLOX_SPACE` or `MANABLOX_SPACE_ID` is set in `.env`, it always serves that space, whatever address a request uses.
2. **An API host.** Otherwise it looks at the host name the request was sent to, like `api.shop.example.com`, and serves the space that has this name under **Settings > API hosts**. See [Serving several spaces](#serving-several-spaces).
3. **The only space.** While no space has an API host, it serves the one space of your CMS, if there is exactly one.

### Without API hosts

Without a pin and without API hosts, it picks its space by itself:

| Spaces in your CMS | What happens |
| --- | --- |
| None | It starts, but answers every request with the error `publicApi.space.unresolved` (status 503). Create a space in the admin: within ten seconds it serves that space |
| Exactly one | It serves that space and logs that it picked the only one |
| Several | It logs a warning and answers every request with the same 503 error: it will not guess |

:::caution
Once it has picked a space this way, the public API keeps it until it stops. If you add a second space later, the running public API keeps serving the first one, but after the next restart it answers every request with the 503 error. Pin the space or give it an API host before you go live, so a new space can never take your website offline.
:::

While it has no space to serve, only `/healthz` answers normally. It tries again at most every ten seconds, when a request comes in, so it also finds the space once the extra spaces are gone.

### Pin a space

To pin a space (tell it which one to serve), put the space's technical name into `.env` in your CMS project:

```sh
MANABLOX_SPACE=marketing
```

You find the technical name in the admin under `Settings > Spaces`, in small letters under the space's name. You can also pin by id with `MANABLOX_SPACE_ID`. If no space has that name, it stops with `publicApi.space.notFound`.

Then stop `pnpm dev:public` with Ctrl+C and start it again. It reads the setting only at start, and it does not watch `.env`.

A space that is still being imported (see [Moving a space](../admin/transfer.md)) does not count for the automatic choice. If the space the public API serves is being imported, or its import failed, every request answers 404 with the error `space.notFound` until the import has finished.

### A fresh project, step by step

1. Start the CMS with `pnpm dev` and sign in at `http://localhost:3000`.
2. Create a space. Choose **Basic setup** if you want some content to try things with.
3. Start (or restart) the public API with `pnpm dev:public` in a second terminal.
4. Open `http://localhost:3100/v1/permalink` in your browser. You should see your home page as JSON.

## Serving several spaces

One public API can serve all your spaces. Give each space its own host name, and point all of them at the same public API:

1. In the admin, pick the space in the space switcher, click **Settings**, then **API hosts**.
2. Add the host name its website will read from, for example `api.blog.example.com`. Staging environments get host names of their own.
3. In your domain's DNS settings, point that name at the server the public API runs on.

Leave `MANABLOX_SPACE` and `MANABLOX_SPACE_ID` empty: a pinned public API ignores API hosts. Once any space has an API host, a request to a host name that no space has answers 404 with the error `publicApi.host.unknown`. **API hosts** is only shown if your plan includes custom domains.

You can also run a second public API with a different space and port instead. In a `local` project, a variable set in the terminal wins over `.env`:

```sh
MANABLOX_SPACE=blog PUBLIC_PORT=3101 PUBLIC_API_URL=http://localhost:3101 pnpm dev:public
```

The second website then reads from `http://localhost:3101`. Both share the same database and cache. With SQLite this works too, as long as only one management CMS runs on the database file.

## When you change a content type

When you create or change a content type in the admin, the public API picks up the change by itself. With Valkey (`REDIS_URL` in `.env`, as `manablox create` sets it up) that happens at once. Without Valkey it checks every 5 seconds (`CACHE_SYNC_INTERVAL`). You do not need to restart it.

## Settings

All in `.env` of your CMS project. Restart the public API after a change.

| Variable | Default | Meaning |
| --- | --- | --- |
| `MANABLOX_SPACE` | empty | The space to serve, by technical name. Set, it ignores API hosts |
| `MANABLOX_SPACE_ID` | empty | The same, by id |
| `PUBLIC_PORT` | `3100` | The port it listens on |
| `PUBLIC_API_URL` | `http://localhost:3100` | The address visitors reach it at. Image addresses are built from it, so on a server set it to the real domain |
| `PUBLIC_CACHE_TTL` | `300` | How many seconds answers are cached, see [Caching](./caching.md) |
| `PUBLIC_GRAPHQL_INTROSPECTION` | `false` | `true` lets GraphQL tools read the schema, see [GraphQL](./graphql.md#tools-to-try-queries) |
| `PUBLIC_DATABASE_URL` | set by `manablox create` | The read-only database user. Only with Postgres; with SQLite the public API uses `DATABASE_URL` |

The rest of `.env` is shared with the management API. See [The .env file](../your-project/environment.md) for all variables.

## Health checks

`GET /healthz` answers `{"status":"ok"}` while the server runs, and `GET /readyz` checks that it can also reach the database. Monitoring tools and container platforms use them to see whether the public API is up. See [Keeping it running](../going-live/operations.md).
