---
title: "Keeping it running"
description: "Everyday server tasks for a docker project: checking health, reading logs, restarting, disk space, and running manablox commands in a container."
---

Once your CMS is live, it mostly looks after itself. Docker restarts a service that crashes, and after a server reboot the whole stack comes back on its own. This page collects the few things you still do by hand now and then. Run every command in your project folder on the server (for example `/srv/my-cms`).

## Is it healthy?

Every Manablox process answers two addresses that tell you whether it is working:

| Address | Answer | Meaning |
| --- | --- | --- |
| `/healthz` | `{"status":"ok"}` | The process is running. It checks nothing else. |
| `/readyz` | `{"status":"ready", ...}` | The process is running and can reach the database. It also reports the number of content types and the schema version. |

If the database cannot be reached, `/readyz` answers with status 503 and `{"status":"unavailable"}`.

Try them from anywhere:

```sh
curl https://cms.example.com/readyz
curl https://content.example.com/readyz
```

Docker checks `/readyz` inside every CMS container every 15 seconds and marks the container `healthy` or `unhealthy`. You can also point an uptime monitoring service at `https://cms.example.com/readyz`, so you get a message when your CMS is down.

## What is running

This lists the services, their state and whether they are healthy:

```sh
docker compose ps
```

A healthy stack shows `postgres` (not with SQLite), `valkey`, `api`, `public` and your proxy (`caddy` or `nginx`) as `Up`, and the CMS services with `(healthy)`. `migrate` is missing on purpose: it only runs at start and then stops. To see it too, add `-a`.

## Reading logs

Every service writes its log to Docker. Show the latest lines of the admin and API service:

```sh
docker compose logs --tail 100 api
```

Follow the logs live (press Ctrl+C to stop watching; the services keep running):

```sh
docker compose logs -f api public
```

Name any service you want to look at: `migrate`, `caddy`, `nginx`, `postgres`. The CMS writes one line per request and more for errors. `LOG_LEVEL` in `.env` controls how much it writes (`info` by default). [Logs](../your-project/logging.md) explains the format and other destinations.

## Restarting

| You want to | Command |
| --- | --- |
| Restart one service, for example after it got stuck | `docker compose restart api` |
| Apply a change in `.env` | `docker compose up -d` |
| Apply a change in your config files or `package.json` | `docker compose build`, then `docker compose up -d` |
| Stop everything | `docker compose down` |
| Start everything again | `docker compose up -d` |

`docker compose restart` does not read `.env` again. After you change `.env`, always use `docker compose up -d`: it recreates exactly the services whose settings changed.

`docker compose down` stops and removes the containers, but keeps your data in the volumes.

:::danger
Never add `-v` to `docker compose down` on your live server. `docker compose down -v` also deletes the volumes, and with them your database and all uploads.
:::

## Disk space

Check how full the disk is:

```sh
df -h
```

Show how much Docker uses for images, containers and volumes:

```sh
docker system df
```

What grows over time:

- Logs. The compose file limits them: each service keeps at most 5 log files of 20 MB, so no more than 100 MB per service. You do not need to clean them.
- Old images. Every `docker compose build` leaves the previous image behind. Remove images no container uses any more with `docker image prune`, and old build steps with `docker builder prune`.
- Backups. `backup.sh` keeps the 14 newest; their size grows with your content. See [Backups](./backups.md).
- Uploads. They grow with what editors upload.
- The media cache (see below).

The cache in `valkey` does not grow without end: it is limited to 256 MB and drops the least used entries when it is full.

## The media cache

When your website asks for an image in a certain size or format, the public API creates that version once and keeps it in a cache volume, so the next request is fast. When an editor changes an image, a new version is made and the old one stays in the cache. On a site with many images this cache can slowly grow.

Emptying it is safe; every version is created again the next time it is requested:

```sh
docker compose run --rm --no-deps --user root --entrypoint sh public -c 'rm -rf /data/media-cache/*'
```

Right after this, images load a little slower until the cache has filled up again.

## Running a manablox command in a container

In a docker project there is no Node.js on the server, so you run `manablox` commands in a temporary container made from your CMS image. It has the same settings as the running service. The general form is `docker compose run --rm` followed by the service and the command; `--rm` removes the temporary container afterwards.

Run the database update on its own (it also runs on every `docker compose up -d`):

```sh
docker compose run --rm migrate
```

Create keys for push notifications:

```sh
docker compose run --rm --no-deps api push-keys
```

`--no-deps` means "do not start other services first"; the stack is already running. [The manablox command](../help/cli.md) lists every command.

### Push notification keys

Workflows can send push notifications to the browsers of your editors. That needs a key pair, created once. Run the `push-keys` command above; it prints two keys. Put them into `.env`:

```sh
PUSH_VAPID_PUBLIC_KEY=the-public-key
PUSH_VAPID_PRIVATE_KEY=the-private-key
PUSH_VAPID_SUBJECT=mailto:you@example.com
```

Then apply the change:

```sh
docker compose up -d api
```

:::caution
Never change the keys once browsers have subscribed to notifications. New keys break every existing subscription, and every editor would have to allow notifications again.
:::

### Sync workflows and webhooks from code

If your config declares workflows, webhooks or templates in code (see [Workflows and webhooks in code](../your-project/resources-in-code.md)), they reach the database only when you run `manablox sync`. After every deploy that changes them, rebuild, start, and then sync:

```sh
docker compose build
docker compose up -d
docker compose run --rm --no-deps api sync
```

It prints one line per change. To see what would change without writing anything, add `--dry-run`:

```sh
docker compose run --rm --no-deps api sync --dry-run
```

If you prefer the CMS to do this by itself every time `api` starts, set `resources: { apply: 'boot' }` in `manablox.config.ts` (next to the workflows and webhooks you declare there), then rebuild and start.
