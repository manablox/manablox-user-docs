---
title: "The database"
description: "What the database holds, Postgres or SQLite and how to choose, what a SQLite project looks like, and how to move an existing CMS to the other database, with manablox migrate-db from SQLite to Postgres."
---

The database is where your CMS keeps everything you create in the admin: spaces, content types built in the admin, documents and their versions, the details of your images and files, users, roles, menus, workflows and the activity log. The uploaded files themselves are not in the database; they live in the storage, see [Uploads and images](./storage-and-media.md).

Manablox works with two databases. You pick one when you create the project. The admin, the APIs, search and filters behave the same on both.

| Database | What it is |
| --- | --- |
| Postgres (the default) | A database server: a separate program the CMS connects to over the network. Your project runs it in Docker |
| SQLite | A database that is a single file. It runs inside the CMS process, so there is no database server to start or look after |

## Which one to choose

| Choose | When |
| --- | --- |
| SQLite | You are trying Manablox, developing on your computer, or running a small or medium site on one server. There is nothing else to run or maintain, and a backup is one file |
| Postgres | A bigger site, several CMS processes, or you want the public API to connect with its own read-only database user |

If you are unsure, keep Postgres: it is the default and fits every size. The rest of this guide shows Postgres and points out where SQLite differs.

## Picking it in manablox create

Right after the project name, `manablox create` asks "Which database?". Choose Postgres or SQLite with the arrow keys and press Enter. On the command line, `--database` answers the question in advance:

```sh
pnpm dlx @manablox/cli create my-cms --database sqlite
```

With SQLite the question "Port to publish Postgres on" is left out, because there is no Postgres. See [Create your CMS](../getting-started/create-your-cms.md) for all the questions.

The choice ends up in one line of `.env`, `DATABASE_URL`. How it starts decides which database the CMS uses:

| `DATABASE_URL` | Database |
| --- | --- |
| `postgres://manablox_app:<password>@localhost:5432/manablox` | Postgres |
| `file:./data/manablox.db` (or `sqlite:./data/manablox.db`) | A SQLite file |
| `libsql://your-db.turso.io` | A hosted SQLite database, see [below](#a-hosted-sqlite-database) |

A relative file path such as `./data/manablox.db` is relative to your project folder, and the folder is created on first start. Any other beginning stops the CMS at start with `config.database.urlUnsupported`.

## What a SQLite project looks like

### A local project

A `local` project with SQLite differs from the Postgres one in a few places:

- The database is the file `data/manablox.db` in your project folder. `pnpm migrate` creates it the first time.
- While the CMS runs, two more files sit beside it, `manablox.db-wal` and `manablox.db-shm`. They are part of the database; leave them alone.
- `compose.yml` runs only Valkey (and Mailpit, if you chose it). `pnpm services:up` starts no database, but you still run it for the cache.
- `.env` has `DATABASE_URL=file:./data/manablox.db`, no `POSTGRES_*` variables and no database passwords.
- There is no `postgres/init/` folder.
- `data/` is already in `.gitignore`, so the database never ends up in Git.
- The public API (`pnpm dev:public`) opens the same file.

The first steps are the same as with Postgres: `pnpm services:up`, `pnpm migrate`, `pnpm dev`. After `pnpm migrate` you should see `manablox: migrations applied` and a new file `data/manablox.db`.

### A docker project

A `docker` project with SQLite has no `postgres` service. The database file lives in a Docker volume called `database`, which `compose.yml` mounts at `/data/db` into the `migrate`, `api` and `public` services, with `DATABASE_URL=file:/data/db/manablox.db`. A volume is a folder Docker manages for you; it survives when containers are rebuilt. `./scripts/backup.sh` and `./scripts/restore.sh` handle it for you, see [Backups](../going-live/backups.md).

## Backing up a SQLite database

`manablox backup` writes a consistent copy of the database into a new file while the CMS keeps running. In a local project:

```sh
pnpm exec manablox backup backups/2026-01-31.db
```

You should see `manablox: database copied to` followed by the full path of the new file. Missing folders are created, and `backups/` is already in `.gitignore`. The command never overwrites: if the file exists, it stops. Pick a new name for every backup.

Do not copy `data/manablox.db` by hand while the CMS runs; the copy can be broken. A plain copy is only safe when `pnpm dev` and `pnpm dev:public` are stopped.

To bring a backup back, stop `pnpm dev` and `pnpm dev:public` with Ctrl+C, then replace the database with the copy and delete the two helper files, which belong to the old database:

```sh
rm -f data/manablox.db-wal data/manablox.db-shm
cp backups/2026-01-31.db data/manablox.db
```

Start `pnpm dev` again. Everything changed after the backup is gone.

`manablox backup` only works for SQLite. On Postgres it stops with `back Postgres up with pg_dump`; a `docker` project's `./scripts/backup.sh` does that for you.

## One writer at a time

SQLite lets only one process write at a time; the others wait their turn. That gives three rules:

- Run only one management CMS (`pnpm dev`, `pnpm start`, or the `api` service) on a SQLite database. Never two, and never several copies of `api`.
- A public API on the same file is fine. It mostly reads.
- Keep the file on a local disk of the computer or server, not on a network drive. Network drives break the way SQLite keeps writers apart.

A write waits up to 15 seconds for the one before it. If it has to wait longer, it fails with `SQLITE_BUSY` (database is locked). That usually happens only during a large import, and it clears once the import is done. See [Common problems](../help/troubleshooting.md#database-is-locked-sqlite_busy).

## The public API on SQLite

On Postgres the public API connects with its own database user, `manablox_public`, which may only read. SQLite has no users, so the public API opens the same file as the admin. Its protection is the public mode itself: only read-only APIs, no login, no uploads, no drafts, and one pinned space. See [The public API](../website/public-api.md).

## Moving a CMS to the other database

### From SQLite to Postgres

When a SQLite CMS outgrows its file, `manablox migrate-db` copies the whole database into an empty Postgres database: every table, including the users, the activity log and the history. It then checks the copy (the number of rows in each table, the activity log's chain and a sample of rows field by field) and prints the settings to change.

1. Create an empty Postgres database and note its address, for example `postgres://manablox:secret@db.example.com:5432/manablox`.
2. Stop the CMS (`pnpm dev` and `pnpm dev:public`, or the containers), so no edit gets lost while the copy runs.
3. In the project folder, run the copy. `--force-offline` tells the command that you stopped the CMS yourself:

```sh
pnpm exec manablox migrate-db --to postgres://manablox:secret@db.example.com:5432/manablox --force-offline
```

You should see a line that starts with `manablox: verified`, then "Next steps".

4. Set `DATABASE_URL` in `.env` to the Postgres address, remove `DATABASE_AUTH_TOKEN` if it is there, and start the CMS again.
5. Keep the SQLite file until the CMS runs well on Postgres.

If the copy stops halfway, run the command again. If the check finds a difference, the command lists it and ends with code `2`. The SQLite file is never changed. [The manablox command](../help/cli.md#manablox-migrate-db) lists every option.

### Space by space

From Postgres to SQLite there is no command. You move the content space by space instead (this works in both directions):

1. Create a new project with the other database (`--database sqlite` or `--database postgres`), start it and create the superadmin account.
2. On the old CMS, export each space as an archive: switch to it with the space switcher, open `Settings > Export and transfer`, leave **Zip archive** as the file type and click **Download export**.
3. On the new CMS, import each file with **Import** next to **New space** under `Settings > Spaces`.

A few things do not travel with a space:

- Users and the activity log. Create the accounts again on the new CMS and add them to the spaces.
- Credential secrets and AI provider keys. Enter them again under `Settings > Credentials` and `Settings > AI`.

[Moving a space](../admin/transfer.md) walks through every step.

## A hosted SQLite database

libSQL is a database that works like SQLite but can also run as a service, for example at Turso. To use one, set `DATABASE_URL=libsql://your-db.turso.io` (the address your provider shows) and put the access token it gives you into `DATABASE_AUTH_TOKEN` in `.env`. As with a file, run only one management CMS on it, and back it up with the tools of your provider.
