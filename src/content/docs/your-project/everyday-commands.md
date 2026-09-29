---
title: "Everyday commands"
description: "The short commands in your project's package.json: starting and stopping the CMS, updating the database, and starting over."
---

Your project comes with a set of short commands, called scripts, in `package.json`. You run each one with `pnpm` followed by its name, in a terminal opened in your project folder. This page explains what each one does and when you need it.

All commands on this page are for a `local` project, the one you use while learning and building. A `docker` project on a server is run with `docker compose` instead; see [Keeping it running](../going-live/operations.md).

## The scripts at a glance

| Command | What it does |
| --- | --- |
| `pnpm services:up` | Starts Postgres and Valkey (and Mailpit, if you chose it) in Docker, in the background. With SQLite there is no Postgres to start |
| `pnpm services:down` | Stops them again. Your data is kept |
| `pnpm migrate` | Creates or updates the tables in the database |
| `pnpm dev` | Starts the CMS at `http://localhost:3000` and restarts it when you change a config file |
| `pnpm start` | Starts the CMS once, without watching for changes |
| `pnpm dev:public` | Starts the public API at `http://localhost:3100`, restarting on changes |
| `pnpm start:public` | Starts the public API once |
| `pnpm dev:site` | Starts the site process for [designed sites](../design/index.md) at `http://localhost:3200`, restarting on changes |
| `pnpm start:site` | Starts the site process once |
| `pnpm push-keys` | Prints a key pair for browser push notifications |
| `pnpm typecheck` | Checks your `.ts` config files for mistakes |

`dev:public` and `start:public` only exist if your project has the public API. A `docker` project has `start`, `start:public`, `dev`, `migrate`, `push-keys` and `typecheck`, but no `services:*` or `dev:public`.

## A normal working day

When you sit down to work on your CMS:

1. Make sure Docker Desktop (or Docker on Linux) is running.
2. Open a terminal in your project folder and start the services:
```sh
pnpm services:up
```
3. You should see Docker report that the containers are `Started` or `Running`. Now start the CMS:
```sh
pnpm dev
```
4. After a few seconds the log shows a line with `manablox listening`. Open `http://localhost:3000` in your browser.

The terminal with `pnpm dev` now belongs to the CMS: its log messages appear there, see [Logs](./logging.md). Keep it open while you work. If you also run the public API, open a second terminal and run `pnpm dev:public` there.

When you are done:

1. Press Ctrl+C in the terminal with `pnpm dev` (and in the one with `pnpm dev:public`). The CMS says `shutting down` and stops.
2. Stop the services:
```sh
pnpm services:down
```
3. Docker reports the containers as `Removed`. That sounds scary, but only the containers are removed. The database and cache live in Docker volumes (with SQLite, the database is the file `data/manablox.db`) and are still there next time.

Leaving the services running is fine too. They use little memory, and `restart: unless-stopped` in `compose.yml` even starts them again after a reboot, as long as Docker runs.

## pnpm services:up and services:down

These two are short for `docker compose up -d` and `docker compose down`. They start and stop the helper services listed in `compose.yml`. The ports they use (5432 for Postgres and 6379 for Valkey by default) come from `.env`.

With SQLite as the database, `compose.yml` has no Postgres: `services:up` starts only Valkey (and Mailpit), and the database is the file `data/manablox.db`, which the CMS opens itself. You still run `services:up` for the cache. See [The database](./database.md).

If `services:up` fails with a message that a port is already allocated, another program on your computer uses it, often a Postgres you installed earlier. Change the port in `.env` as described in [The .env file](./environment.md#services-and-ports).

## pnpm migrate

`pnpm migrate` brings the database up to date. It creates the tables the CMS needs, and later adds or changes tables when a new version of Manablox needs them. When it is done it prints:

```
manablox: migrations applied
```

Run it:

- once, after creating the project (before the first `pnpm dev`),
- after every update of the `@manablox/*` packages, see [Updating Manablox](../going-live/updating.md),
- after starting fresh with an empty database (see below).

Running it when nothing is left to do is harmless: it only applies what is missing. The services must be running, since it talks to the database. If you forget it, the CMS fails with database errors that say a relation (a table) does not exist; run `pnpm migrate` and start it again.

You do not need `migrate` when you add content types, in the admin or in code. Content types never need a migration.

## pnpm dev and pnpm start

Both start the management instance: the admin and its API, on the port from `PORT` in `.env` (3000 by default).

`pnpm dev` also watches your config files. When you save `manablox.config.ts`, `content-model.ts` or anything they import, the CMS restarts by itself, which takes a few seconds. It does not watch `.env`: after changing `.env`, press Ctrl+C and run `pnpm dev` again.

`pnpm start` starts the CMS once and does not restart on changes. Use it when you want the CMS to run without surprises, for example while you test your website against it.

## pnpm dev:public and start:public

These start the public API with `manablox.public.config.ts`, at `http://localhost:3100`. It is the read-only API your website reads published content from; see [The public API](../website/public-api.md).

The public API serves exactly one space. With exactly one space it picks that one on its own. With no space yet, or with several, it keeps running but answers every request with the error `publicApi.space.unresolved` (status 503). Create a space in the admin, or, with several, set `MANABLOX_SPACE` in `.env` to the technical name of the space it should serve and start it again.

## pnpm dev:site and start:site

These start the site process with `manablox.site.config.ts`, at `http://localhost:3200`. It shows every space you switched to a designed site, picked by the web address a visitor opens. You only need it once you use the designer; see [A website without code](../design/index.md).

## pnpm push-keys

Prints a new key pair for push notifications (the notifications a browser shows even when the admin is not open):

```
# Add these to the environment (and keep the private key private):
PUSH_VAPID_PUBLIC_KEY=...
PUSH_VAPID_PRIVATE_KEY=...
PUSH_VAPID_SUBJECT=mailto:admin@example.com
```

Copy the three lines into `.env`, replacing the empty ones there, and change the address in `PUSH_VAPID_SUBJECT` to yours. Then restart `pnpm dev`. Do this once: new keys later break every browser that already subscribed. See [The .env file](./environment.md#push-notifications).

## pnpm typecheck

Checks `content-model.ts` and the two config files for type errors, for example a misspelled option or a field setting of the wrong kind. It prints nothing when all is well, and a list of problems with file and line otherwise. Run it after bigger changes to your content types in code; it is quicker than waiting for the CMS to complain.

## More commands with pnpm exec manablox

The scripts above cover the everyday work. The `manablox` command has a few more things it can do, and you run those with `pnpm exec manablox` inside your project folder. To see all commands and options:

```sh
pnpm exec manablox --help
```

The one you are most likely to need is `pnpm exec manablox sync`, which writes workflows and webhooks from your config into the database; see [Workflows and webhooks in code](./resources-in-code.md). With SQLite, `pnpm exec manablox backup backups/2026-01-31.db` copies the database into a file while the CMS runs; see [The database](./database.md#backing-up-a-sqlite-database). You can also start the CMS on another port for one run, without touching `.env`:

```sh
pnpm exec manablox start --port 3300
```

[The manablox command](../help/cli.md) lists every command and option.

## Starting fresh

Sometimes you want a clean slate: an empty database, no users, no uploads. For example after trying things out, before you start building for real.

:::danger
This deletes all content, all users, all spaces and all uploaded files of this project. There is no undo. Make a copy first if anything in it matters.
:::

1. Stop `pnpm dev` and `pnpm dev:public` with Ctrl+C.
2. Stop the services and delete their volumes (the `-v` means: also delete the stored data):
```sh
docker compose down -v
```
3. Delete the `data` folder in your project (uploads and image caches). With SQLite it also holds the database, `data/manablox.db` with its `manablox.db-wal` and `manablox.db-shm` files; to empty only the database and keep the uploads, delete just those three files.
4. Start again as on the first day:
```sh
pnpm services:up
pnpm migrate
pnpm dev
```
5. Open `http://localhost:3000`. You see the sign-up form again, and the first account you create becomes the superadmin.

A brand-new Postgres database needs a few seconds to set itself up. If `pnpm migrate` fails with a connection error right after `pnpm services:up`, wait a moment and run it again.

Your config files, `.env` and content types in code stay as they are. Only the stored data is gone.
