---
title: "The .env file"
description: "What the .env file is, how the CMS reads it, and every variable in it: what it means and when to change it."
---

The `.env` file holds everything that belongs to this one installation of your CMS: passwords, secrets, ports, addresses and a few switches. Everything else lives in the config files, which read their values from here. That split is why the same project can run on your laptop and on a server: only `.env` differs.

`manablox create` wrote a complete `.env` for you, with fresh random secrets. You can run the CMS without changing anything in it. This page explains what each line means, so you know what to change when the time comes.

## What the file looks like

`.env` is a plain text file with one setting per line, in the form `NAME=value`. Lines starting with `#` are comments. There are no spaces around the `=`, and values need no quotes. For example:

```sh
# The port of the admin
PORT=3000
MAIL_DRIVER=mailpit
MAIL_FROM=Manablox <no-reply@localhost>
```

These settings are called environment variables. An empty value (`S3_BUCKET=`) counts as not set.

`.env.example` is the same file with every secret left blank. It is safe to commit to Git and to share, so a teammate can copy it to `.env` and fill in their own secrets.

## Who reads it, and when

In a `local` project `.env` is read twice:

- by Docker Compose, when you run `pnpm services:up`: it takes the ports (and, with Postgres, the database passwords) from it,
- by the `manablox` command, every time you run `pnpm dev`, `pnpm migrate` or another `manablox` command: it loads `.env` from the project folder before it reads the config files.

A variable that is already set in your terminal wins over the file. So `PORT=3200 pnpm dev` (on macOS and Linux) starts the CMS on port 3200 for this one run, whatever `.env` says.

Changes to `.env` are not picked up while the CMS runs, not even by `pnpm dev`. After editing it, press Ctrl+C and start the CMS again. If you changed a Postgres or Valkey setting, also run `pnpm services:down` and `pnpm services:up`.

:::note
In a `docker` project Docker Compose reads the file and hands all of it to the `api` container (the CMS) and the `migrate` container, so every variable you add to `.env` reaches the CMS. The `public` container (the public API) gets only the variables `compose.yml` lists for it: every variable the public API reads, but never the main database password (with Postgres). After editing `.env` there, run `docker compose up -d` so the containers start again with the new values. [Put it on a server](../going-live/index.md) explains that setup.
:::

## Services and ports

Only in a `local` project. These say where Docker publishes the database and the cache, and how the CMS reaches them.

| Variable | Default | What it means |
| --- | --- | --- |
| `POSTGRES_PORT` | `5432` | The port the database is reachable on from your computer. Only with Postgres |
| `VALKEY_PORT` | `6379` | The port of Valkey, the cache and job queue |
| `DATABASE_URL` | `postgres://manablox_app:<password>@localhost:5432/manablox` | How the CMS connects to the database: user, password, host, port and database name. The user `manablox_app` may read and write content, but cannot change tables or delete activity log entries. With SQLite it is `file:./data/manablox.db`, the database file |
| `MIGRATION_DATABASE_URL` | the same with the user `manablox_owner` | How `pnpm migrate` connects: as the user that owns the tables and may change them. It gives `manablox_app` exactly the rights it needs. Only with Postgres |
| `PUBLIC_DATABASE_URL` | the same with the user `manablox_public` | How the public API (and the site process of designed websites) connects, as a user that may only read. Only with Postgres; with SQLite the public API uses `DATABASE_URL` |
| `REDIS_URL` | `redis://localhost:6379` | How the CMS connects to Valkey |
| `PORT` | `3000` | The port of the admin and the management API |
| `PUBLIC_URL` | `http://localhost:3000` | The address the admin is opened at in a browser. Used for links in emails, image addresses and login |
| `PUBLIC_PORT` | `3100` | The port of the public API |
| `PUBLIC_API_URL` | `http://localhost:3100` | The address the public API is reached at |

When to change them: when a port is already in use on your computer. Some values appear twice and must match:

- `POSTGRES_PORT` and the port inside `DATABASE_URL`, `MIGRATION_DATABASE_URL` and `PUBLIC_DATABASE_URL`,
- `VALKEY_PORT` and the port inside `REDIS_URL`,
- `PORT` and the port inside `PUBLIC_URL`,
- `PUBLIC_PORT` and the port inside `PUBLIC_API_URL`.

For example, if another Postgres already uses 5432, set `POSTGRES_PORT=5433` and change `localhost:5432` to `localhost:5433` in the three database URLs. Then run `pnpm services:down` and `pnpm services:up`.

`DATABASE_URL` also decides which database the CMS uses: `postgres://...` for Postgres, `file:...` for a SQLite file, `libsql://...` for a hosted SQLite database. See [The database](./database.md).

A `docker` project has domain and port settings here instead (`ADMIN_DOMAIN`, `PUBLIC_DOMAIN`, `ACME_EMAIL`, `ADMIN_PORT`, `UPLOAD_BODY_LIMIT` and the two URLs). They are explained in [Domains and HTTPS](../going-live/domains-and-https.md).

## Secrets

| Variable | What it means |
| --- | --- |
| `POSTGRES_PASSWORD` | The password of the database's administrator `manablox`, for maintenance by hand only; the CMS never uses it. Only with Postgres |
| `DATABASE_OWNER_PASSWORD` | The password of `manablox_owner`, the user `pnpm migrate` connects as. The same as in `MIGRATION_DATABASE_URL`. Only with Postgres |
| `DATABASE_APP_PASSWORD` | The password of `manablox_app`, the user the CMS connects as. The same as in `DATABASE_URL`. Only with Postgres |
| `POSTGRES_PUBLIC_PASSWORD` | The password of the read-only user `manablox_public`, used by the public API. Only with Postgres |
| `AUTH_SECRET` | The main secret of your CMS. It signs logins and image addresses, and it encrypts the credentials and AI keys stored in the admin |
| `MEDIA_SIGNING_SECRET` | Optional. A separate secret just for image addresses. Empty means `AUTH_SECRET` is used |

`manablox create` filled these with long random values. Keep them secret, and keep them the same once the CMS is in use:

- Changing `AUTH_SECRET` signs everyone out, changes every image address (so caches and CDNs fetch them anew), and makes every credential and AI key stored in the admin unreadable: they have to be entered again.
- Changing `MEDIA_SIGNING_SECRET` only changes the image addresses. Setting it lets you change one secret without the other.
- Changing a database password (`POSTGRES_PASSWORD`, `DATABASE_OWNER_PASSWORD`, `DATABASE_APP_PASSWORD` or `POSTGRES_PUBLIC_PASSWORD`) in `.env` does not change the password inside an existing database. Docker only uses these values when it creates the database the first time. If you change them anyway, the CMS can no longer connect.

To make a new random secret, for example for a new server, run this in a terminal and paste the output into `.env`:

```sh
openssl rand -hex 32
```

This prints 64 random letters and digits (only `0` to `9` and `a` to `f`), so the value is also safe inside a database URL. The comment above the secrets in `.env` suggests the same command.

:::danger
Anyone with `AUTH_SECRET` can forge logins to your CMS. Never commit `.env`, paste it into a chat, or put it in a screenshot.
:::

## Public API

Only in a project with the public API.

| Variable | Default | What it means |
| --- | --- | --- |
| `MANABLOX_SPACE` | empty | The technical name of the one space the public API serves. With exactly one space it can stay empty; with several the public API refuses to start until you set it |
| `PUBLIC_CACHE_TTL` | `300` | How many seconds an answer of the public API may be reused by caches. See [Caching](../website/caching.md) |
| `PUBLIC_GRAPHQL_INTROSPECTION` | `false` | `true` lets GraphQL tools read the schema of the public API. Useful while building a website, off by default because the API is public |

## Browser clients of the management API

| Variable | Default | What it means |
| --- | --- | --- |
| `CORS_ORIGINS` | empty | Addresses of your own websites that call the management API from the browser, separated by commas, for example `http://localhost:3005`. The admin itself needs no entry |

You need this when your website shows previews or uses the visual editor, which talk to the management API. See [Preview and the visual editor](../website/preview.md). A website that only reads published content from the public API needs no entry.

## Storage, mail and logs

These groups have their own pages:

- `STORAGE_DRIVER`, `STORAGE_LOCAL_PATH`, `MEDIA_CACHE_PATH`, `PUBLIC_MEDIA_CACHE_PATH`, the `S3_*` variables and `FILE_MAX_SIZE_MB`: see [Uploads and images](./storage-and-media.md).
- `MAIL_DRIVER`, `MAIL_FROM` and the variables of each mail service: see [Sending email](./mail.md).
- `LOG_LEVEL` and the other `LOG_*` variables: see [Logs](./logging.md).

## AI and workflows

| Variable | Default | What it means |
| --- | --- | --- |
| `AI_ALLOWED_HOSTS` | empty | Addresses on your own network that a self-hosted AI model may be reached at, separated by commas, as `host` or `host:port`, for example `localhost:11434` for Ollama on your computer. Public AI providers need no entry |
| `NET_ALLOW_PRIVATE_NETWORK` | `false` | `true` lets workflow HTTP steps and webhooks reach addresses on your own network and on this computer (`localhost`). Only turn it on for an installation you trust that is not open to others |

`AI_ALLOWED_HOSTS` is read by the AI plugin's line in `manablox.plugins.ts`; a project without AI assistance has neither. Without an entry in `AI_ALLOWED_HOSTS`, the admin refuses to connect to a model on your own network and names the address you have to add. Restart the CMS after changing either variable. See [AI](../admin/ai.md). How long a workflow run may take and how many pages a crawl step may read are not variables but options of `workflowsPlugin(...)` in `manablox.config.ts` (see [Workflows](../admin/workflows.md)).

## Premium plugin licenses

The website and AI plugins need a license key in production; on your own computer they run without one. See [Premium plugins and licenses](./premium-plugins.md).

| Variable | Default | What it means |
| --- | --- | --- |
| `MANABLOX_LICENSE_KEYS` | empty | Your license keys, separated by commas. `manablox license buy` and `manablox license add` write them here. Keep them secret. Empty is fine on a development installation |
| `MANABLOX_LICENSE_SERVER` | `https://licenses.manablox.io/api` | The license server. The CMS needs to reach it over HTTPS about once a day |
| `MANABLOX_LICENSE_KIND` | `auto` | `auto` decides between development and production from `NODE_ENV` and the addresses of the CMS. `development` makes the CMS a development installation whatever `NODE_ENV` says, but its addresses still have to be private, and it still serves private addresses only. `production` makes it a production installation always, so the premium plugins need a key |
| `MANABLOX_LICENSE_DEV_HOSTS` | empty | Preview servers with a public name that should count as private, so the premium plugins run there without a key, separated by commas, as `preview.example.com` or `*.preview.example.com` |

## Push notifications

| Variable | Default | What it means |
| --- | --- | --- |
| `PUSH_VAPID_PUBLIC_KEY` | empty | The public half of the key pair for browser push notifications |
| `PUSH_VAPID_PRIVATE_KEY` | empty | The private half. Keep it secret |
| `PUSH_VAPID_SUBJECT` | `mailto:admin@localhost` | A contact address that push services may use. Put your own address here |

While the keys are empty, notifications reach people in the admin (and by email, if mail is set up), but not as browser push. `pnpm push-keys` prints a pair; see [Everyday commands](./everyday-commands.md#pnpm-push-keys). Set them once and never change them: new keys break every browser that already subscribed.

## Designed sites

Used by the site process that shows [designed sites](../design/index.md). A project made with `manablox create` has these lines when designed websites were picked, and `manablox plugin install website` adds them later.

| Variable | Example | What it means |
| --- | --- | --- |
| `SITE_URL` | `http://localhost:3200` | Where the site process is reached. The admin needs it to show the design canvas. On a server, one of your site's addresses |
| `SITE_PORT` | `3200` | The port of the site process |
| `SITE_EDITOR_ORIGIN` | the admin's address | The admin address that may show the design canvas. Usually left out; it defaults to `PUBLIC_URL` |
| `SITE_CACHE_TTL` | `300` | How many seconds finished pages are kept in the cache. Publishing clears them earlier |
| `SITE_FORMS_SECRET` | a long random text | Switches forms on. `manablox create` fills it in for you. See [Forms](../design/forms.md#switch-forms-on) |
| `SITE_FORMS_API_URL` | `http://localhost:3000` | Where the site process sends form entries: the CMS |

## Tuning

| Variable | Default | What it means |
| --- | --- | --- |
| `LOG_LEVEL` | `info` | How much the CMS writes to its log. See [Logs](./logging.md) |
| `DB_POOL_MAX` | `10` | How many database connections one CMS process may hold at once. The default is fine for most sites |

## More variables the config understands

Your config files read a few more variables that are not in `.env` by default. Add a line to `.env` when you need one.

| Variable | Default | What it means |
| --- | --- | --- |
| `HOST` | `0.0.0.0` | The network address the CMS listens on. `0.0.0.0` means every address of the machine; `127.0.0.1` means only this computer |
| `ADMIN_URL` | the value of `PUBLIC_URL` | Where links in workflow emails and notifications point. Only needed if the admin is reached at another address than the API |
| `DATABASE_SSL` | `false` | `true` connects to the database over an encrypted connection, which many hosted Postgres services require |
| `DATABASE_AUTH_TOKEN` | empty | Only for a hosted SQLite (libSQL) database such as Turso: the access token your provider gives you. See [The database](./database.md#a-hosted-sqlite-database) |
| `CACHE_ENABLED` | `true` | `false` turns the response cache off completely |
| `CACHE_TTL` | `60` | Seconds an answer stays in the response cache of the CMS process. The public API uses `PUBLIC_CACHE_TTL` instead |
| `CACHE_SYNC_INTERVAL` | `5` | Only without Valkey: how many seconds the CMS and the public API wait between checks for content types the other one saved. `0` turns the check off |
| `GRAPHQL_MAX_DEPTH` | `12` | How deeply nested a GraphQL query to the management API may be |
| `NODE_ENV` | empty | `production` switches the CMS to production behaviour: GraphQL introspection off, error details hidden, logs as JSON |
| `ALLOWED_MIME_TYPES` | images, video, audio, text, PDF, office files and web fonts | Which kinds of files may be uploaded. See [Uploads and images](./storage-and-media.md#what-may-be-uploaded) |
| `MANABLOX_SPACE_ID` | empty | Like `MANABLOX_SPACE`, but by the space's id. Wins over `MANABLOX_SPACE` |
| `PUBLIC_GRAPHQL_MAX_DEPTH` | `8` | How deeply nested a query to the public API may be |
| `PUBLIC_GRAPHQL_MAX_COMPLEXITY` | `1000` | How expensive a single query to the public API may be |
| `RATE_LIMIT` | on | `off` turns off the limit of 300 requests per minute per visitor on the public API |
