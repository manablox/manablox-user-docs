---
title: "Common problems"
description: "The problems people run into most often with Manablox, each with the message you see, what causes it and how to fix it: ports in use, Docker, the database, migrations, the public API, CORS, the visual editor, mail, uploads and passwords."
---

Something does not work? Find the message you see on this page. Each problem lists what you see, why it happens and what to do. Most messages from the `manablox` command start with `manablox:`, followed by the reason.

Commands on this page are for a `local` project (made with "Local development"); run them in your project folder. Where a `docker` project differs, it says so.

## Installing

### "Your Node version is incompatible" when installing

**What you see:** `pnpm install` stops with `Unsupported environment (bad pnpm and/or Node.js version)` and `Your Node version is incompatible with ...`, `Expected version: >=24`. Some pnpm versions show `Unsupported engine` instead.

**Why:** A project made by `manablox create` needs Node.js 24 or newer, and your computer has an older one.

**Fix:** Check your version with `node --version`. Install Node.js 24 or newer from [nodejs.org](https://nodejs.org), open a new terminal and run `pnpm install` again. See [What you need](../getting-started/before-you-begin.md).

### "could not run pnpm"

**What you see:** `manablox create` writes the files but then says `pnpm install did not finish; run it yourself in my-cms` with `could not run pnpm: spawn pnpm ENOENT`.

**Why:** pnpm is not installed, or the terminal cannot find it.

**Fix:** Install pnpm as described on [pnpm.io](https://pnpm.io/installation), open a new terminal, go into the project folder and run `pnpm install`. The files are already there; you do not need to create the project again.

### "Ignored build scripts"

**What you see:** `pnpm install` or `pnpm add` stops with `ERR_PNPM_IGNORED_BUILDS  Ignored build scripts: ...` (newer pnpm) or shows a yellow warning box with the same words (older pnpm).

**Why:** Some packages run a small program when they are installed, for example to download a prebuilt image library. pnpm only allows that for packages listed under `allowBuilds:` in `pnpm-workspace.yaml`. Your project lists the ones Manablox needs (`esbuild`, `sharp`, `@node-rs/argon2`, `msgpackr-extract`, `vue-demi`). A package you added yourself may need another one.

**Fix:** Add each package name from the message under `allowBuilds:` in `pnpm-workspace.yaml`, for example `some-package: true`, and run `pnpm install` again. Only do this for packages you trust. Do not remove the entries that are already there: without them, image processing and password checks do not work.

### "is not empty; pass --force"

**What you see:** `manablox create` stops with `... is not empty; pass --force to write into it anyway`.

**Why:** The folder you named already has files in it, maybe from an earlier try.

**Fix:** Pick a new folder name. Only use `--force` if you really want to write into that folder: it overwrites files with the same names.

## Starting

### Docker is not running

**What you see:** `pnpm services:up` fails with `Cannot connect to the Docker daemon ... Is the docker daemon running?` or a similar message that it cannot connect.

**Why:** Docker is installed but not started. On Windows and macOS, Docker Desktop has to be open.

**Fix:** Start Docker Desktop (or the Docker service on Linux), wait until it says it is running, then run `pnpm services:up` again. Check with `docker compose ps`: `postgres` and `valkey` should be listed as running (with SQLite only `valkey`).

### A port is already in use

**What you see:** `pnpm dev` stops with `Error: listen EADDRINUSE: address already in use 0.0.0.0:3000`. Or `pnpm services:up` fails with `port is already allocated` or `address already in use` for 5432 (Postgres) or 6379 (Valkey).

**Why:** Another program already uses that port. Often it is a second `pnpm dev` in another terminal window, or a Postgres that was installed on your computer earlier.

**Fix:** Stop the other program if you can. Otherwise give Manablox another port in `.env`. Always change both lines of a pair, because each port also appears in an address:

| Port | Change in `.env` |
| --- | --- |
| The admin, 3000 | `PORT` and the port in `PUBLIC_URL` |
| The public API, 3100 | `PUBLIC_PORT` and the port in `PUBLIC_API_URL` |
| Postgres, 5432 (not with SQLite) | `POSTGRES_PORT` and the port in `DATABASE_URL`, `MIGRATION_DATABASE_URL` and `PUBLIC_DATABASE_URL` |
| Valkey, 6379 | `VALKEY_PORT` and the port in `REDIS_URL` |

Then run `pnpm services:up` (for Postgres and Valkey) and `pnpm dev` again. See [The .env file](../your-project/environment.md).

### The database refuses the connection

**What you see:** `pnpm migrate` or `pnpm dev` stops with an error that contains `ECONNREFUSED`, for example `connect ECONNREFUSED 127.0.0.1:5432`.

**Why:** Nothing answers on the database port. Postgres is not running, usually because Docker was restarted or `pnpm services:up` was not run. With SQLite this cannot happen, because there is no database server; the same message for port 6379 means Valkey is not running.

**Fix:** Run `pnpm services:up` and wait a few seconds. `docker compose ps` should show `postgres` as running (healthy). Then try again.

### "password authentication failed"

**What you see:** `pnpm migrate` or `pnpm dev` stops with `password authentication failed for user "manablox_app"` (`"manablox_owner"` for `pnpm migrate`, `"manablox_public"` for `pnpm dev:public`).

**Why:** Only with Postgres; SQLite has no passwords. Postgres keeps its data in a Docker volume named after your project. The passwords are set only when that volume is created. If you created the project again with the same name, or changed the passwords in `.env`, the volume still expects the old ones.

**Fix:** If the database holds nothing you need, remove the volume and start fresh:

```sh
docker compose down -v
pnpm services:up
pnpm migrate
```

:::danger
`docker compose down -v` deletes the database and everything in it: your content, users and settings. Never run it on a CMS whose content you want to keep. In that case, put the old passwords back into `.env` instead.
:::

### "Failed query" or "relation does not exist"

**What you see:** `pnpm dev` stops right away with a long `manablox: Failed query: select ...` message, or an error that says `relation "..." does not exist` (with SQLite: `no such table`).

**Why:** The database has no tables yet, or is not up to date. `pnpm migrate` was not run, or not after an update of Manablox.

**Fix:** Run `pnpm migrate`. It prints `manablox: migrations applied`. Then start `pnpm dev` again. In a `docker` project, the `migrate` service does this on every start; check it with `docker compose logs migrate`.

### "Missing required environment variable"

**What you see:** A command stops with `manablox: Missing required environment variable: DATABASE_URL` (or `AUTH_SECRET`, or a mail variable like `SMTP_HOST`).

**Why:** The config file needs that variable and could not find it. Either you ran the command outside the project folder, `.env` is missing, or the variable in `.env` is empty. For mail, the chosen `MAIL_DRIVER` needs its settings filled in, and the message names the first missing one.

**Fix:** Go into the project folder (the one with `manablox.config.ts`) and run the command there. Check that `.env` exists and the variable has a value. `.env.example` lists every variable, but its secrets are empty on purpose: copying it does not give you working passwords. See [The .env file](../your-project/environment.md) and [Sending email](../your-project/mail.md).

### "no manablox.config.ts in ..."

**What you see:** `manablox: no manablox.config.ts in /some/folder; create one or pass --config <file>`.

**Why:** The command runs in a folder that is not your project.

**Fix:** Change into your project folder (`cd my-cms`) and try again.

### "the configuration is invalid"

**What you see:** `manablox: the configuration is invalid`, followed by lines with a setting and a reason, for example `server.port  config.port.invalid`.

**Why:** A value in the config, usually coming from `.env`, is not allowed. `config.database.urlMissing` and `config.auth.secretMissing` mean the database address or the secret is empty; `config.port.invalid` means a port is not a number from 0 to 65535.

**Fix:** Correct the named setting (most of them come from `.env`) and start again.

### "config.database.urlUnsupported"

**What you see:** `manablox: the configuration is invalid`, followed by `database.url  config.database.urlUnsupported`.

**Why:** `DATABASE_URL` in `.env` starts with something the CMS does not know. It accepts `postgres://` (Postgres), `file:` or `sqlite:` (a SQLite file) and `libsql://` (a hosted SQLite database). A typo such as `postgress://`, or an address for another database, stops it at start.

**Fix:** Correct `DATABASE_URL`, for example `file:./data/manablox.db` for SQLite, and start again. See [The database](../your-project/database.md).

### "contentType.field.type.notFound"

**What you see:** The CMS refuses to start with `manablox: contentType.field.type.notFound`. In the admin, you may see "That field type is not installed on this instance."

**Why:** A content type uses a field type that no plugin provides any more, usually after a plugin was removed from `content-model.ts`.

**Fix:** Add the plugin back to the `plugins` list. See [Custom field types](../extending/custom-field-types.md#keep-it-installed).

### "database is locked" (SQLITE_BUSY)

**What you see:** With SQLite, saving or importing fails, and the log of `pnpm dev` (or `docker compose logs api`) shows an error with `SQLITE_BUSY` or "database is locked".

**Why:** SQLite lets one process write at a time. A write waits up to 15 seconds for the one before it, then gives up. A large import is the usual cause. A second management CMS on the same file (two `pnpm dev`, or several `api` containers), or a database file on a network drive, makes it happen much more often.

**Fix:** Wait until the import is done and try again; the problem clears by itself. Make sure only one management CMS runs on the file (a public API next to it is fine), and keep the file on a local disk. See [The database](../your-project/database.md#one-writer-at-a-time).

## The public API

### The public API answers "publicApi.space.unresolved"

**What you see:** Every request to the public API answers status 503 with the error `publicApi.space.unresolved`, and its log shows the warning "public api has no space to serve". In a `docker` project, the `public` container shows as unhealthy.

**Why:** The public API serves exactly one space. With no space at all, or with several and none chosen, it does not know which one to serve.

**Fix:** With no space yet, sign in to the admin and create a space (see [Spaces and members](../admin/spaces.md)); the public API picks it up within ten seconds. With several spaces, set `MANABLOX_SPACE` in `.env` to the technical name of the one to serve and start it again. In a `docker` project, run `docker compose up -d public` after changing `.env`.

### A page shows its title but none of its fields

**What you see:** Your website shows the page's title, but no blocks or fields. The REST answer of the public API has `"type": "unknown"` and `"fields": {}`, and GraphQL answers "Unexpected error".

**Why:** The page's content type was created after the public API started, and the public API has not picked it up yet. It checks for new content types every 5 seconds without Valkey, and at once with Valkey.

**Fix:** Wait a few seconds and reload. If it stays like this, restart the public API (`pnpm dev:public`, or `docker compose restart public` in a `docker` project).

### "publicApi.space.notFound"

**What you see:** `pnpm dev:public` stops with `manablox: publicApi.space.notFound`.

**Why:** `MANABLOX_SPACE` (or `MANABLOX_SPACE_ID`) in `.env` names a space that does not exist. The technical name is not the display name: a space called "Main Website" may have the technical name `main-website`.

**Fix:** Look up the space's technical name in the admin under `Settings > Spaces`, put it into `.env` and start again.

### Everything answers 404 with "space.notFound"

**What you see:** Every page of your website is missing. The public API answers every request with status 404 and the error `space.notFound`, although the space exists in the admin.

**Why:** The space is being imported, or its import stopped partway. Until an import has finished, the website does not see the space at all.

**Fix:** Open the space in the admin under `Settings > Spaces`. While it shows **importing**, wait. If it shows **failed**, choose **Resume import**, or delete it and import the file again. See [Moving a space](../admin/transfer.md#if-the-import-stops-partway).

### "Too many requests"

**What you see:** The website gets answers with status 429 from the public API, with the key `rateLimit.exceeded`.

**Why:** The public API allows 300 requests per minute from one address. A website that renders on the server sends all its requests from one address, so a build or a load test can hit the limit. Where several copies of the public API run behind one address and share a Redis, they count together, so the limit is 300 in total rather than 300 each.

**Fix:** Cache on your website (see [Caching](../website/caching.md)). For a local test, `RATE_LIMIT=off` in `.env` switches the limit off for the public API.

### GraphQL tools cannot load the schema

**What you see:** A GraphQL tool or editor pointed at the public API cannot show the schema or offer completion. A query for the schema answers with the error key `graphql.introspection.disabled`.

**Why:** "Introspection" (asking the API for its schema) is switched off on the public API by default.

**Fix:** Set `PUBLIC_GRAPHQL_INTROSPECTION=true` in `.env` and restart the public API. See [GraphQL](../website/graphql.md).

## Your website

### CORS errors in the browser

**What you see:** The browser's developer console shows a message like `blocked by CORS policy: No 'Access-Control-Allow-Origin' header` when your website's browser code calls the CMS.

**Why:** Browsers only let a web page call another address if that address allows it (this is called CORS). The public API allows every website. The management API (the one at `http://localhost:3000`) only allows the admin itself and the addresses listed in `CORS_ORIGINS`.

**Fix:** Let your website read from the public API, which needs no setting. If your browser code really must call the management API, add your website's address to `CORS_ORIGINS` in `.env` (for example `CORS_ORIGINS=http://localhost:3005`, several separated by commas) and restart `pnpm dev`.

### The visual editor keeps waiting

**What you see:** In the admin, the **Visual** view of a document shows "Waiting for the site..." instead of "Live preview connected". Or it says "This space has no frontend URL configured."

**Why:** The admin shows your website's `/preview` page and talks to it. That needs two things: the space must know where the website runs, and the website must accept messages from the admin's address. If the admin's address in the website's `.env` differs from the one in your browser's address bar (another port, `http` instead of `https`), the website ignores the admin.

**Fix:**

1. In the admin, switch to the space, go to `Settings > General`, open the **Name and website** card and set its **Website address** to your website's address, for example `http://localhost:3005`.
2. In the website's `.env`, set `MANABLOX_ADMIN_ORIGIN` (`VITE_MANABLOX_ADMIN_ORIGIN` for a `plain` website) to the admin's address: `http://localhost:3000` for a `local` project, your admin's domain on a server.
3. Restart the website's `pnpm dev` and reload the admin.

See [Preview and the visual editor](../website/preview.md).

## In the admin

### "Sign-up is closed"

**What you see:** Creating an account shows "Sign-up is closed. Ask an instance administrator to create an account for you."

**Why:** Only the very first account can sign up by itself; it becomes the superadmin. After that, sign-up is closed.

**Fix:** Ask an administrator to create your account under `Settings > Users`. See [Users and roles](../admin/users-and-roles.md).

### Lost the superadmin password

**What you see:** You cannot sign in any more.

**Why:** The **Forgot password?** link on the sign-in page only shows when the CMS can send mail. Without mail there is no password email.

**Fix:** If the CMS can send mail, click **Forgot password?** and follow the link in the email (see [Your account](../admin/your-account.md#forgot-your-password)). Otherwise another administrator can set a new password for you: `Settings > Users`, open your account, **Reset password**. Without mail there is no other built-in way to recover an administrator account, so set up [sending email](../your-project/mail.md) and make a second person an administrator early on.

### Everyone was signed out, images are broken

**What you see:** After a change to `.env`, every user has to sign in again, and image addresses that worked before now fail.

**Why:** `AUTH_SECRET` signs the sign-in sessions and the image addresses, and encrypts stored credentials and AI provider keys. Changing it makes all of them invalid.

**Fix:** Put the old `AUTH_SECRET` back if you still have it. Otherwise sign in again, let your website fetch fresh image addresses (a CDN may have to be cleared), and enter the credentials and AI provider keys again. Change the secret only on purpose.

### Emails do not arrive

**What you see:** A workflow sends an email, but nobody receives it. Or a workflow step fails with "This instance has no mail transport configured (MAIL_DRIVER)."

**Why:** It depends on `MAIL_DRIVER` in `.env`:

| `MAIL_DRIVER` | Where the mail goes |
| --- | --- |
| `mailpit` | Nowhere real: Mailpit catches every mail for testing. Open its inbox at `http://localhost:8025` |
| `none` | Mail is switched off; email steps fail with the message above |
| a real driver | To the recipients, if the driver's settings are right |

**Fix:** For testing, open `http://localhost:8025` (Mailpit runs with `pnpm services:up`). For real mail, set `MAIL_DRIVER` and that driver's variables in `.env`, set a `MAIL_FROM` address your provider lets you send from, and restart `pnpm dev` (in a `docker` project, run `docker compose up -d`). See [Sending email](../your-project/mail.md).

### An upload is too large

**What you see:** Uploading a file shows "That file is larger than this instance allows." On a server behind Caddy or nginx, a large upload may also fail without that message, with status 413 in the browser's network tab.

**Why:** Three limits apply: `FILE_MAX_SIZE_MB` in `.env` for the whole CMS (25 MB by default), an optional lower limit per space, and on a `docker` server with Caddy or nginx, `UPLOAD_BODY_LIMIT` for the web server in front.

**Fix:** Raise `FILE_MAX_SIZE_MB` in `.env` and restart. On a server, also raise `UPLOAD_BODY_LIMIT` so it stays above it (for example `64MB` for Caddy, `64m` for nginx) and run `docker compose up -d`. If only one space refuses, check that space's upload settings (see [Images and files](../admin/assets.md)).

### "No editor registered for field type"

**What you see:** A field in the document editor shows `No editor registered for field type "..."` instead of an input.

**Why:** A custom field type names an editor in `admin.input` that the admin does not have.

**Fix:** Use one of the built-in editors. See [Custom field types](../extending/custom-field-types.md#the-editor-in-the-admin).

### "Someone else saved this document while you were editing"

**What you see:** Saving a document shows this message.

**Why:** Another person (or a workflow) saved the same document after you opened it. Manablox refuses to overwrite their changes silently.

**Fix:** Copy what you changed, reload the document, and apply your changes again.

## Still stuck?

Look at the terminal where `pnpm dev` runs (or `docker compose logs -f api` on a server): the CMS writes every error there, often with more detail than the admin shows. See [Logs](../your-project/logging.md).

If the logs do not help, look for your problem among the [issues on GitHub](https://github.com/manablox/manablox-cms/issues), or open a new one with the message you see, the command you ran and the version of your `@manablox/*` packages (in `package.json`).
