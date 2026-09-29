---
title: "Logs"
description: "What your CMS writes to its log, how to see more or less of it, and where to find it: in the pnpm dev terminal, in docker compose logs, in a file or at a log service."
---

While it runs, your CMS writes a log: short messages about what it is doing, such as "started", "public api pinned to the only space", or a warning when a workflow step fails. When something does not work, the log is the first place to look.

## Where you see the log

### In a local project

The log appears in the terminal where you ran `pnpm dev` (or `pnpm start`). After a start you should see a few lines like these (times and details differ):

```
[09:41:07] INFO (51234): manablox initialised
    fieldTypes: 13
    contentTypes: 2
[09:41:08] INFO (51234): manablox listening
    url: "http://0.0.0.0:3000"
    mode: "management"
```

Each entry starts with the time and a level (`INFO`, `WARN`, `ERROR` and so on), followed by the message and its details on the next lines. The public API started with `pnpm dev:public` writes to its own terminal.

Nothing is saved: once you close the terminal, the log is gone. If you want to keep it, write it to a file as shown below.

### In a docker project

Each container writes its log to Docker. To follow the log of the CMS and the public API:

```sh
docker compose logs -f api public
```

`-f` keeps following new lines; press Ctrl+C to stop watching (the containers keep running). Leave out `-f` to print what is there and return. `--tail 100` shows only the last 100 lines, and you can name one service or several (`api`, `public`, `caddy`, `postgres`, ...).

In a docker project the log is written as JSON, one line per entry, which is harder to read but easy for tools to process. `compose.yml` keeps up to five files of 20 MB per container, so old entries are deleted automatically. See [Keeping it running](../going-live/operations.md).

## How much is logged: LOG_LEVEL

Every entry has a level. From least to most important:

| Level | Used for |
| --- | --- |
| `trace` | Very fine details |
| `debug` | Details that help while hunting a problem, including one line per request the CMS answers |
| `info` | Normal events: started, stopped, a space was pinned |
| `warn` | Something went wrong but the CMS carries on, for example a failed workflow step |
| `error` | Something failed that should not have |
| `fatal` | The CMS cannot go on |

`LOG_LEVEL` in `.env` sets the lowest level that is written. The default `info` writes `info`, `warn`, `error` and `fatal`, and skips `debug` and `trace`.

To see every request while you look for a problem:

1. Set `LOG_LEVEL=debug` in `.env`.
2. Restart the CMS (Ctrl+C, then `pnpm dev`).
3. Use the admin or your website. Each request now shows up as a `request` entry with the method, the path, the status code and how long it took.
4. Set it back to `info` when you are done; `debug` is noisy.

A value the CMS does not know counts as `info`.

## Readable or JSON: LOG_PRETTY

By default the log is written in the readable, coloured form shown above, unless `NODE_ENV` is `production` (as in a docker project), where it is JSON. `LOG_PRETTY` overrides that:

- `LOG_PRETTY=false` writes JSON even on your computer, for example to feed it to a tool.
- `LOG_PRETTY=true` writes the readable form even in production.

## Writing the log to a file

To keep the log, add `LOG_FILE` to `.env` with the path of a file:

```sh
LOG_FILE=./data/logs/cms.log
```

After a restart the CMS appends every entry to that file, as one JSON line each, and still writes to the terminal. It creates the folder if it is missing. A relative path is relative to your project folder. Since `data/` is left out of Git, a log file there stays out too.

The file grows forever. On a server, let a tool like logrotate take care of old entries.

## Sending the log to a log service

Hosted log services collect logs from many machines in one place and let you search them. Most of them accept log entries sent over HTTP. To use one, add these variables:

| Variable | What it means |
| --- | --- |
| `LOG_HTTP_URL` | The address the service tells you to send logs to |
| `LOG_HTTP_HEADERS` | Headers the service needs, usually a key, written as `name: value` pairs separated by commas, for example `authorization: Bearer abc123` |
| `LOG_HTTP_BATCH_SIZE` | How many entries are sent per request. Default `100` |

The CMS sends the entries in batches in the background. If the service is down, it keeps entries in memory and tries again later; logging never slows down or breaks your CMS.

## A different level per destination

Each destination can have its own level. That way the terminal stays calm while the file keeps every detail:

| Variable | Default | What it means |
| --- | --- | --- |
| `LOG_CONSOLE_LEVEL` | `LOG_LEVEL` | Level for the terminal (or `docker compose logs`) |
| `LOG_FILE_LEVEL` | `LOG_LEVEL` | Level for the file |
| `LOG_HTTP_LEVEL` | `LOG_LEVEL` | Level for the log service |

For example, `LOG_LEVEL=debug`, `LOG_CONSOLE_LEVEL=info` and a `LOG_FILE` writes requests to the file only.

## Passwords stay out of the log

Before an entry is written anywhere, the CMS replaces passwords, secrets, login cookies and authorization headers with `[redacted]`. You can share a log to get help without leaking them, though it is still worth a quick look for anything private, like email addresses.

## In a docker project

Every `LOG_*` variable you set in `.env` reaches both the CMS and the public API container. After a change, run `docker compose up -d`. In a container, `docker compose logs` or a log service is a better fit than `LOG_FILE`, because the application folder inside the image cannot be written to.
