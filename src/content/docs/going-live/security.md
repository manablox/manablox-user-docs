---
title: "Security checklist"
description: "The things to check before and after your CMS goes live: secrets, accounts, API keys, updates, backups and the server's firewall."
---

A docker project made by `manablox create` is set up carefully from the start: random secrets, only the web server reachable from the internet, a read-only database account for the public API (with Postgres), containers that do not run as the administrator. This checklist tells you what is already done for you and what is up to you. Go through it once before real content goes in, and look at it again from time to time.

## Secrets

- [ ] Keep the generated secrets. `manablox create` wrote long random values for `POSTGRES_PASSWORD`, `DATABASE_OWNER_PASSWORD`, `DATABASE_APP_PASSWORD`, `POSTGRES_PUBLIC_PASSWORD` and `AUTH_SECRET` into `.env` (with SQLite only `AUTH_SECRET`, as there are no database passwords). Do not replace them with something shorter or easier to remember.
- [ ] Never commit `.env`. The project's `.gitignore` already leaves it out of Git, and `.dockerignore` keeps it out of the image. Do not remove those lines, and never paste `.env` into a chat or a ticket.
- [ ] Make `.env` readable only for you on the server: `chmod 600 .env`.
- [ ] Keep a copy of `.env` in a safe place, such as a password manager. `AUTH_SECRET` signs sign-in sessions and image URLs, and it encrypts the AI keys and credentials the CMS stores. Without it those stored secrets are lost.

If you ever have to change `AUTH_SECRET` (for example because it leaked), everyone is signed out, image URLs cached elsewhere stop working, and stored AI keys and credentials have to be entered again.

More about every variable: [The .env file](../your-project/environment.md).

## What is reachable from the internet

- [ ] Only the web server publishes ports. In a Caddy or nginx project, only ports 80 and 443 are open to the outside. The CMS, the database and the cache talk to each other on a private Docker network that the internet cannot reach. Do not add `ports` to `postgres` or `valkey` in `compose.yml`. With SQLite there is no database service at all; the database is a file in the `database` volume.
- [ ] Serve everything over HTTPS. See [Domains and HTTPS](./domains-and-https.md).
- [ ] Your website reads from the public API (`content.example.com`), never from the management API. The public API can only read published content, and it is anonymous, so there is no password to steal.
- [ ] The public API connects to the database with its own read-only account (`manablox_public`), which may only read. Even if something went wrong in the public API, it could not change your data. The account is created automatically the first time the database starts.
- [ ] With SQLite there are no database accounts: the public API opens the same database file as the admin. Its protection is the public mode itself (read-only APIs, no login, no uploads, no drafts, one pinned space). If you need the read-only account, use Postgres. See [The database](../your-project/database.md#the-public-api-on-sqlite).
- [ ] `CORS_ORIGINS` in `.env` lists only your own websites that call the management API from the browser (for example for preview). Leave it empty if there are none. See [Preview and the visual editor](../website/preview.md).
- [ ] GraphQL introspection stays off. Introspection lets anyone download the full description of your API. It is switched off automatically in a docker project, on both APIs. Only turn it on for the public API (`PUBLIC_GRAPHQL_INTROSPECTION=true`) if you really need it.

## Accounts

- [ ] Create the superadmin account right after the first start. The first person to sign up becomes superadmin, and sign-up closes after it. See [Put it on a server](./index.md#sign-in-for-the-first-time).
- [ ] Give the superadmin a strong password. The CMS requires at least 12 characters; use a password manager and make it longer.
- [ ] Do not share the superadmin account. Create a personal account for every person, and give them the smallest role that lets them do their work, for example an editor role instead of admin. See [Users and roles](../admin/users-and-roles.md) and [Spaces and members](../admin/spaces.md).
- [ ] Remove accounts of people who leave.
- [ ] Look at the activity log now and then. It records sign-ins, failed sign-ins and every change. See [Activity](../admin/activity.md).

The CMS slows down repeated failed sign-in attempts on its own, both per visitor address and per account.

## API keys

- [ ] Create one API key per website or tool, not one for everything. Then you can revoke a single key without breaking the others.
- [ ] Give each key only the spaces and permissions it needs. A key that only reads content should not be able to write.
- [ ] Never put a management API key into code that runs in the browser. Anyone can read it there.
- [ ] Revoke keys you no longer use.

See [API keys](../admin/api-keys.md).

## Staying up to date

- [ ] Update Manablox when new versions come out. They include security fixes. See [Updating Manablox](./updating.md).
- [ ] Keep the server's operating system updated. On Ubuntu or Debian, run `sudo apt update && sudo apt upgrade` regularly, or turn on automatic security updates (the `unattended-upgrades` package).
- [ ] Rebuild now and then even without a Manablox update (`docker compose build --pull`, then `docker compose up -d`), so the Node.js base image gets its latest fixes. For the other services, `docker compose pull postgres valkey caddy` (with nginx: `nginx` instead of `caddy`; with SQLite leave out `postgres`) fetches newer images within their version; `docker compose up -d` then starts them.

## Backups

- [ ] Backups run every night.
- [ ] Copies are kept somewhere other than the server.
- [ ] You have restored a backup at least once to check it works.

See [Backups](./backups.md).

## The server

- [ ] Log in to the server with an SSH key instead of a password. Your hosting company explains how to add one.
- [ ] Turn on a firewall that only allows SSH and the web ports. On Ubuntu, `ufw` does this:

```sh
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp
sudo ufw enable
```

Allow SSH before you run `ufw enable`, or you lock yourself out. Port 443 over UDP is used by Caddy for the faster HTTP/3; you can leave that line out with nginx.

:::caution
Ports that Docker publishes are not blocked by `ufw`. That is fine in a Caddy or nginx project, where only 80 and 443 are published. If you created the project with `--proxy none`, ports 3000 and 3100 are open to the internet unless you bind them to `127.0.0.1`, as described in [Domains and HTTPS](./domains-and-https.md#no-proxy-behind-your-own-web-server).
:::

- [ ] If your project was created with Mailpit as mail driver, remember it catches every mail and delivers none. Its inbox is only reachable from the server itself. Switch to a real mail provider before editors rely on email. See [Sending email](../your-project/mail.md).
