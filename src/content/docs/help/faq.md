---
title: "Questions and answers"
description: "Short answers to the questions people ask most about Manablox: databases, Docker, several websites, previews, updates, backups, where content is stored and which frontend to use."
---

Short answers, each with a link to the page that explains more. If your question is about an error message, look in [Common problems](./troubleshooting.md).

## What do I need to run Manablox?

On your computer: Node.js 24 or newer, pnpm, and Docker for the database and the cache. On a server: Docker is enough, because everything runs in containers. See [What you need](../getting-started/before-you-begin.md).

## Which databases does it support?

Two: PostgreSQL (the default) and SQLite. A Postgres project made by `manablox create` runs Postgres 18 in Docker. SQLite is a database that is a single file, run inside the CMS itself, so there is no database server at all; pick it with `--database sqlite` or the "Which database?" question. A hosted libSQL database (Turso) works too. The admin and the APIs behave the same on all of them. See [The database](../your-project/database.md) for how to choose.

Next to the database runs Valkey, a Redis-compatible store that Manablox uses as a shared cache and a queue for background jobs. Your content never lives in Valkey, only in the database.

## Can I use it without Docker?

Yes. With SQLite the database needs no Docker at all. With Postgres, provide PostgreSQL yourself, for example one you installed on your computer or a database from a hosting provider. Put its address into `DATABASE_URL` in `.env`, run `pnpm migrate`, then `pnpm dev`; you then do not need `pnpm services:up`.

Valkey is optional. Without `REDIS_URL`, each Manablox process keeps its own cache in memory and runs background jobs right away. That is fine for trying things out, but if you also run the public API, both processes should share one Valkey (or any Redis), so that publishing clears the cache the public API serves from.

With Postgres, the public API normally connects with a read-only database user that Docker creates on the first start. Without Docker, create that user yourself, or leave `PUBLIC_DATABASE_URL` empty, and the public API uses `DATABASE_URL` instead (which works, but is less locked down). See [The .env file](../your-project/environment.md).

## Can I run several websites from one CMS?

Yes. Each website gets its own **space**, with its own content, languages, images, menus and members, all in one admin. See [Spaces and members](../admin/spaces.md).

The public API serves exactly one space per running process. For a second website, start a second public API process pinned to the other space, on its own port. On your computer, for example:

```sh
MANABLOX_SPACE=shop PUBLIC_PORT=3101 PUBLIC_API_URL=http://localhost:3101 pnpm start:public
```

Variables set in front of the command win over `.env`. See [The public API](../website/public-api.md).

## Where is my content stored?

| What | Where |
| --- | --- |
| Documents, content types built in the admin, users, settings, versions | In the database. Postgres: in a Docker volume (on your computer in a `local` project). SQLite: in the file `data/manablox.db` (`local`) or the `database` Docker volume (`docker`) |
| Uploaded images and files | With `STORAGE_DRIVER=local`: in `data/uploads` in your project folder (`local`), or in the `uploads` Docker volume (`docker`). With `s3`: in your bucket |
| Content types, plugins and field types written in code | In `content-model.ts` and the files it imports |
| Secrets and addresses | In `.env` |

See [Uploads and images](../your-project/storage-and-media.md).

## How do I back up my CMS?

In a `docker` project, `./scripts/backup.sh` saves the database and the uploaded files into `backups/`, and `./scripts/restore.sh backups/<folder>` brings them back. It works with Postgres and with SQLite. Run it regularly, for example every night. See [Backups](../going-live/backups.md).

In a `local` project with SQLite, `pnpm exec manablox backup backups/2026-01-31.db` copies the database into one file while the CMS runs; see [The database](../your-project/database.md#backing-up-a-sqlite-database). Back up `data/uploads` too.

Keep a copy of `.env` somewhere safe too: without the same `AUTH_SECRET`, stored credentials and AI provider keys cannot be decrypted and image addresses change.

## How do I update Manablox?

Raise the version of all `@manablox/*` packages in `package.json` together, install, and bring the database up to date with `pnpm migrate` (a `docker` project does that on start). Make a backup first. See [Updating Manablox](../going-live/updating.md).

## How do editors preview a page before it goes live?

In the admin, the **Visual** button of a document shows your real website with the unsaved changes, live, while you type. It needs a website with a `/preview` page (the starter website has one) and the space's **Website address** set under `Settings > General`. Unpublished drafts never reach the public API. See [Preview and the visual editor](../website/preview.md).

## Can I use my own frontend framework?

Yes. Your website reads content over normal web requests, with [REST](../website/rest.md) or [GraphQL](../website/graphql.md), so any language or framework works. For JavaScript and TypeScript there is an [SDK](../website/sdk.md) (`@manablox/public-sdk`) and a [Nuxt module](../website/nuxt.md). `manablox frontend` writes a ready starter website with plain Vite, Astro, React or Vue. See [How a website gets content](../website/index.md).

## Does my website need an API key?

Not for the public API: it only hands out published content, so anyone may read it. API keys are for programs that use the management API, for example to create content from a script. See [API keys](../admin/api-keys.md).

## Can several people edit at the same time?

Yes. Invite them as members of a space with a role that fits (see [Users and roles](../admin/users-and-roles.md)). If two people save the same document, the second one is told that someone else saved it in between, so no change is lost silently.

## Can I have my site in several languages?

Yes. Each space has a list of languages, and every document can have a translation per language. See [Languages and translations](../content-model/localisation.md).

## Can I move content to another Manablox?

Yes. A whole space, with its content types, documents, images and menus, can be exported to a file and imported into another instance. See [Moving a space](../admin/transfer.md). This is also how you move from Postgres to SQLite. From SQLite to Postgres, `manablox migrate-db` copies the whole database in one go; see [The database](../your-project/database.md#moving-a-cms-to-the-other-database).

## Can I change the admin's port or address?

Yes, in `.env`: `PORT` and `PUBLIC_URL` for the admin, `PUBLIC_PORT` and `PUBLIC_API_URL` for the public API. Change both of a pair, then restart. On a server, the domains are set in `.env` too. See [The .env file](../your-project/environment.md) and [Domains and HTTPS](../going-live/domains-and-https.md).

## Can I add features of my own?

Yes, with plugins: new field types, new workflow steps, and code that runs when content changes. See [Plugins](../extending/plugins.md). Many tasks need no code at all, thanks to [workflows](../admin/workflows.md) and [webhooks](../admin/webhooks.md).

## I forgot my password. What now?

If your CMS can send mail, click **Forgot password?** on the sign-in page and follow the link in the email; see [Your account](../admin/your-account.md#forgot-your-password). Otherwise ask an administrator of your CMS: they can set a new password for you under `Settings > Users`. If you are the only superadmin, see [Common problems](./troubleshooting.md#lost-the-superadmin-password).
