---
title: "What you need"
description: "Install Node.js 24, pnpm, Docker, a terminal and a code editor, and check each one with a single command."
---

Manablox needs a few tools on your computer before you can create a CMS. This page lists them, says why each one is needed, and shows how to check that it is installed. If a check already works, skip that tool.

| Tool | What it does for you |
| --- | --- |
| A terminal | The text window where you type commands |
| A code editor | Opens and edits the project's files |
| Node.js 24 | Runs the Manablox server and the `manablox` command |
| pnpm | Downloads the packages Manablox is made of |
| Docker | Runs the database (Postgres) and the cache (Valkey) without installing them by hand. With SQLite as the database, only the cache |

## A terminal

You type every command in this guide into a terminal and press Enter to run it.

- On macOS: open the app called Terminal (press Cmd+Space and type "Terminal").
- On Windows: open Windows Terminal or PowerShell from the Start menu.
- On Linux: open your distribution's terminal app, often with Ctrl+Alt+T.

When this guide shows a command in a grey box, type it (or copy it) exactly, then press Enter.

## A code editor

You will open a few files, for example the `.env` settings file. Any editor that can open a folder works. If you do not have one, Visual Studio Code is free and runs everywhere.

## Node.js 24

Node.js runs JavaScript outside the browser. The Manablox server is written in it, and a created project requires version 24 or newer.

Check whether you have it:

```sh
node --version
```

You should see a version that starts with `v24` (or a higher number), for example `v24.4.0`. If you see "command not found" or a lower number, download the version marked LTS or 24 from [nodejs.org](https://nodejs.org/) and install it. Close the terminal and open a new one afterwards, so it finds the new `node`.

## pnpm

pnpm is a package manager: it downloads the libraries a project depends on. Manablox projects use it for installing and for their commands (`pnpm dev`, `pnpm migrate`).

Node.js comes with a helper called Corepack that can install pnpm for you. Turn it on for pnpm and fetch the current version:

```sh
corepack enable pnpm
corepack install --global pnpm@latest
```

Then check:

```sh
pnpm --version
```

You should see a version number, `11` or higher. If `corepack enable` fails with a permission error on macOS or Linux, run it again with `sudo` in front (`sudo corepack enable pnpm`) and enter your computer password. Other ways to install pnpm are listed on [pnpm.io](https://pnpm.io/installation).

## Docker

Docker runs programs in containers: small, isolated boxes that come with everything they need. Your CMS uses it to run its database (Postgres) and its cache (Valkey), so you do not have to install and configure them yourself.

If you choose SQLite as the database instead (a database that is a single file, run inside the CMS itself; see [The database](../your-project/database.md)), Docker only runs the cache. You still need it.

- On Windows and macOS: install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and start it. It must be running (look for the whale icon) whenever you work on your CMS.
- On Linux: install [Docker Engine](https://docs.docker.com/engine/install/) together with the Compose plugin, following the page for your distribution.

Check both parts:

```sh
docker --version
docker compose version
```

Each should print a version. Note that the second command is `docker compose` with a space. If the first works but the second says "compose is not a docker command", the Compose plugin is missing; install it from the same Docker page.

Now check that Docker is actually running:

```sh
docker info
```

A long list of details means everything is fine. An error that mentions "Cannot connect to the Docker daemon" means Docker is installed but not started: open Docker Desktop, or on Linux start the Docker service.

## Git (optional)

Git keeps the history of your project's files. `manablox create` sets up a Git repository for you if Git is installed; if it is not, the command only prints a warning and carries on. Check with `git --version`, and get it from your system's package manager if you want it.

## Ports

Your CMS uses a few network ports on your computer: 3000 (admin), 3100 (public API), 5432 (Postgres, not with SQLite), 6379 (Valkey) and, for the test inbox, 1025 and 8025. If another program already uses one of them, for example a Postgres you installed earlier, you can pick different numbers while creating the project. The next page shows where.

## Ready?

When `node --version`, `pnpm --version` and `docker compose version` all print versions and `docker info` shows no error, go on to [Create your CMS](./create-your-cms.md).
