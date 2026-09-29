---
title: "Backups"
description: "Back up the database and the uploads with one script, run it every night, keep copies elsewhere and practise a restore."
---

A backup is a copy of your content that you can bring back when something goes wrong: a broken server, a failed update, or an editor who deleted the wrong thing. Your docker project comes with two scripts for it, `scripts/backup.sh` and `scripts/restore.sh`. This page shows how to use them, how to run them automatically and how to check that a backup really works.

## What needs a backup

| What | Where it lives | In the backup |
| --- | --- | --- |
| Everything you create in the admin: spaces, content types, entries, versions, users, roles, menus, workflows | The database (`postgres`, or with SQLite the `database` volume) | Yes, `database.dump` (SQLite: `database.db`) |
| Uploaded images and files | The `uploads` volume | Yes, `uploads.tar.gz` |
| Resized images the public API has cached | A cache volume | No, they are created again when needed |
| Your project files and `.env` | The project folder | No, keep them yourself (see below) |

## Make a backup

Run the script in your project folder on the server. The stack has to be running:

```sh
./scripts/backup.sh
```

It writes a new folder named after the date and time, for example `backups/2026-09-11_03-00-00/`, and prints `backup written to backups/...` when it is done. The folder holds two files:

- `database.dump`: a complete copy of the database, made with the Postgres tool `pg_dump`. With SQLite the file is `database.db` instead, a copy made with `manablox backup` while `api` runs.
- `uploads.tar.gz`: a compressed archive of the uploads volume.

The script keeps the 14 newest backup folders and deletes older ones, so the disk does not fill up. The CMS keeps running while it works.

:::caution
The backup does not contain `.env`. Keep a copy of it somewhere safe, for example in a password manager. `AUTH_SECRET` in it encrypts the secrets the CMS stores, such as AI provider keys and credentials. If you restore a backup with a different `AUTH_SECRET`, everyone has to sign in again and those stored secrets cannot be read any more; you would have to enter them again.
:::

### A local project with SQLite

The scripts only come with a `docker` project. In a `local` project with SQLite, copy the database with `manablox backup` while the CMS runs, and keep `data/uploads` too:

```sh
pnpm exec manablox backup backups/2026-01-31.db
```

It never overwrites an existing file, so use a new name each time. [The database](../your-project/database.md#backing-up-a-sqlite-database) shows how to restore such a copy.

## Run it every night

Cron is the Linux service that runs commands on a schedule. Open your list of scheduled commands:

```sh
crontab -e
```

Add this line at the end. It runs the backup every night at 3:00 (server time) and appends what the script prints to a log file. Replace `/srv/my-cms` with your project folder:

```sh
0 3 * * * cd /srv/my-cms && ./scripts/backup.sh >> backups/backup.log 2>&1
```

Save and close the editor. The five fields at the start mean minute, hour, day of month, month and day of week, so `0 3 * * *` is "at 3:00, every day".

The user whose crontab this is must be allowed to run Docker (it is `root`, or a member of the `docker` group). The next morning, check that it worked:

```sh
ls backups/
tail backups/backup.log
```

You should see a new folder and a line `backup written to ...` in the log.

## Keep copies off the server

A backup on the same server does not help if the server itself is lost. Copy the backups to somewhere else regularly: your own computer, a second server, or a storage service your hosting company offers.

For example, from your own computer, this copies all backup folders from the server into a local folder `cms-backups` (only new files are transferred on later runs):

```sh
rsync -av root@203.0.113.10:/srv/my-cms/backups/ ./cms-backups/
```

Many hosting companies also offer snapshots of the whole server. They are a good extra, but not a replacement: a snapshot lives with the same company and restores only the whole server, while the files from `backup.sh` can be restored on any machine.

## Uploads in S3 storage

If your project stores uploads in an S3 bucket (`STORAGE_DRIVER=s3`), the files are not on the server, and `uploads.tar.gz` stays almost empty. The database dump is still essential. For the files, use what your storage provider offers, for example versioning on the bucket, so a deleted or overwritten file can be brought back. See [Uploads and images](../your-project/storage-and-media.md).

## Restore a backup

The restore script brings the database and the uploads back to the state of one backup:

```sh
./scripts/restore.sh backups/2026-09-11_03-00-00
```

It stops `api` and `public`, replaces the whole database with the one from the backup, replaces the uploads with the ones in the archive, and starts the CMS again. It prints `restored from ...` when it is done. With SQLite it replaces the database file and deletes the stale `manablox.db-wal` and `manablox.db-shm` files beside it, which belong to the old database.

:::danger
A restore replaces everything. Every change made after the backup was taken is gone. If you only need a single space back, or want to copy one space to another installation, [Moving a space](../admin/transfer.md) is the gentler tool.
:::

To restore onto a new server, set it up as described in [Put it on a server](./index.md) with your saved project folder and `.env`, start the stack once, copy the backup folder into `backups/`, and run the restore script there.

## Practise a restore

A backup you have never restored is a hope, not a backup. Try it once, and again every few months, on a machine that is not your live server. Your own computer with Docker is enough:

1. Copy your project folder (with `.env`) and one backup folder from the server to your computer.
2. In the copied `.env`, switch to the plain-http trial domains: `ADMIN_DOMAIN=http://cms.localhost`, `PUBLIC_DOMAIN=http://content.localhost`, `PUBLIC_URL=http://cms.localhost` and `PUBLIC_API_URL=http://content.localhost` (see [Domains and HTTPS](./domains-and-https.md#a-trial-without-https)).
3. Build and start the stack:

```sh
docker compose build
docker compose up -d
```

4. Put the backup folder into `backups/` inside the project and restore it:

```sh
./scripts/restore.sh backups/2026-09-11_03-00-00
```

5. Open `http://cms.localhost`, sign in with your normal account and check that your spaces, entries and images are there.
6. When you are done, remove the test stack and its data with `docker compose down -v`.

:::caution
Do not run the test on your live server in a second copy of the folder. The compose project name is written in `compose.yml`, so both copies would control the same containers and volumes, and `docker compose down -v` would delete your live data.
:::
