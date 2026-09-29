---
title: "The manablox command"
description: "Complete reference of the manablox command: create, plugin, frontend, start, migrate, backup, migrate-db, sync, user, space, website, license, push-keys and docs, with every option, the options plugins add, the questions they ask, their defaults, how the config file and .env are found, and the exit codes."
---

`manablox` is the command line tool that creates, updates and starts your CMS. This page lists every command and every option. For a guided first run, start with [Create your CMS](../getting-started/create-your-cms.md) instead.

## How to run it

There are two ways, depending on whether you already have a project:

- To create something new, run it straight from npm without installing it: `pnpm dlx @manablox/cli create my-cms` or `pnpm dlx @manablox/cli frontend my-site` (`npx @manablox/cli ...` works the same).
- `create` lets you pick features: designed websites, AI assistance, workflows and webhooks, each a plugin. Nothing is picked unless you pick it. When a picked one is not installed next to the command, `create` downloads it (with npm, into `~/.cache/manablox/plugins/`). Without network access it stops and shows the command that brings the plugin along, for example `pnpm dlx --package @manablox/cli --package @manablox/plugin-website manablox create my-cms`. A feature you do not pick is never downloaded.
- Inside a project made by `manablox create`, the command is already installed. Use the scripts in `package.json` (`pnpm dev`, `pnpm migrate`) or `pnpm exec manablox <command>` for everything else.

Run the commands in your project folder: that is where `manablox` looks for the config file and `.env`.

| Command | What it does |
| --- | --- |
| `manablox create [dir]` | Creates a new CMS project in a folder |
| `manablox plugin ...` | Lists, adds, removes, switches on and off the features of a project |
| `manablox frontend [dir]` | Creates a starter website for a space |
| `manablox start` | Starts the CMS |
| `manablox migrate` | Brings the database up to date |
| `manablox backup <file>` | Copies a SQLite database into a file while the CMS runs |
| `manablox migrate-db --to <url>` | Moves a SQLite database into a Postgres database |
| `manablox sync` | Writes the workflows, webhooks, credentials and templates declared in code into the database |
| `manablox user create` | Creates an account, for example the first administrator |
| `manablox space create` | Creates a space, with starter content and a designed website if you like |
| `manablox website ...` | Publishes designs and manages site domains (the website plugin) |
| `manablox license ...` | Buys, adds and checks the license keys of the premium plugins |
| `manablox push-keys` | Prints a key pair for push notifications |
| `manablox docs generate --out <dir>` | Writes reference pages about your CMS and its plugins |

Plugins can add their own options to `space create` and `create`, and their own commands.
`manablox --help` lists them, grouped per plugin. The website plugin, if you pick designed
websites, is the one you meet first.

## Options in general

- An option with a value can be written as `--port 3000` or `--port=3000`.
- A yes or no option has two forms: `--install` and `--no-install`.
- An option the command does not know stops it with `manablox: unknown option '--xyz'; see manablox --help`. A typo never goes unnoticed.
- `-h` or `--help` prints the built-in help text for all commands.
- `manablox` without a command also prints the help text, but ends with an error code.

## The config file and .env

`start`, `migrate`, `backup`, `migrate-db`, `sync`, `user`, `space`, `license`, `docs` and plugin commands such as `website` read your configuration. They look for it like this:

1. First they load the file `.env` from the folder you run the command in, if it exists. A variable that is already set in your terminal wins over the value in `.env`.
2. Then they load the config file: the one given with `--config <file>` (relative to the current folder), or else the first of `manablox.config.ts`, `manablox.config.mts`, `manablox.config.js` or `manablox.config.mjs` in the current folder.

The config file must export its configuration as the default export (`export default defineConfig({ ... })`); a named export called `config` works too.

If no config file is found, you see `no manablox.config.ts in <folder>; create one or pass --config <file>`, or `config file not found: <path>` when the file given with `--config` does not exist. Both usually mean you are not in your project folder.

`create`, `frontend` and `push-keys` read neither file.

## manablox start

Starts the CMS and keeps running until you stop it with Ctrl+C.

```sh
pnpm exec manablox start
pnpm exec manablox start --watch
pnpm exec manablox start --config manablox.public.config.ts
```

In a project made by `manablox create`, the scripts do this for you: `pnpm dev` runs `manablox start --watch`, `pnpm start` runs `manablox start`, and `pnpm dev:public` and `pnpm start:public` do the same with `--config manablox.public.config.ts` for the public API.

| Option | Default | Meaning |
| --- | --- | --- |
| `--config <file>` | `manablox.config.ts` | The config file to load |
| `--watch` | off | Restart whenever the config file or any file it imports changes (for example `content-model.ts` or your plugins) |
| `--mode <mode>` | from the config, else `management` | `management` runs the admin and the management API, `public` runs the read-only public API, `website` (from the website plugin) shows the spaces designed in the admin as websites. Anything else stops with an error |
| `--port <port>` | from the config | The port to listen on |
| `--host <host>` | from the config | The network address to listen on, for example `0.0.0.0` for all |

When the CMS is ready, the log shows `manablox listening` (or `manablox public api listening`) with its address. If the config is not valid, it prints `manablox: the configuration is invalid` followed by one line per problem, and stops.

## manablox migrate

Creates the database tables, or brings them up to date after an update of Manablox. Run it once for a new database and after every update. It is safe to run it again: it only does what is missing.

```sh
pnpm migrate
```

| Option | Default | Meaning |
| --- | --- | --- |
| `--config <file>` | `manablox.config.ts` | The config file whose database address is used |

When it is done, it prints `manablox: migrations applied`. If the config has no database address, it stops with `manablox: database.url is not set in the config`.

In a `docker` project, the `migrate` service does this automatically before the CMS starts. To run it by hand there: `docker compose run --rm migrate`.

## manablox backup

Writes a consistent copy of the database into a new file, while the CMS keeps running. It works for SQLite (a database that is a single file, see [The database](../your-project/database.md)) only; for Postgres it stops with an error, use `pg_dump` there. It never overwrites a file: if the file exists, it stops. Missing folders are created.

```sh
pnpm exec manablox backup backups/2026-01-31.db
```

| Option | Default | Meaning |
| --- | --- | --- |
| `--config <file>` | `manablox.config.ts` | The config file that holds the database address |

When it is done, it prints `manablox: database copied to <file>`. The messages it can stop with:

| Message | Cause |
| --- | --- |
| `backup needs a file to write, e.g. manablox backup backups/cms.db` | No file name was given |
| `<file> exists; backup never overwrites` | The file is already there. Pick a new name |
| `backup copies SQLite databases; back Postgres up with pg_dump` | The project uses Postgres |

To restore, stop the CMS, replace the database file with the copy (and delete the `-wal` and `-shm` files next to it), then start the CMS again. In a `docker` project, `./scripts/backup.sh` and `./scripts/restore.sh` do this for you; see [Backups](../going-live/backups.md).

## manablox migrate-db

Moves everything from the SQLite database of your config into a Postgres database, for when the CMS outgrows one file. It creates the tables in Postgres, copies every row, then checks the copy: the number of rows in each table, the activity log's chain, and a random sample of rows field by field. At the end it prints the settings to change. [The database](../your-project/database.md#from-sqlite-to-postgres) walks through a move.

```sh
pnpm exec manablox migrate-db --to postgres://manablox:secret@db.example.com:5432/manablox --force-offline
```

The CMS must not change anything while the copy runs: stop it and pass `--force-offline`, or set the whole installation read-only through the [control API](https://dev.manablox.io/deployment/control-layer/) first, the way a hosting provider does (see [Messages, read-only and suspended](../admin/messages.md)). While the CMS is in its normal state and `--force-offline` is missing, the command stops with an error. The Postgres database must be empty.

| Option | Default | Meaning |
| --- | --- | --- |
| `--to <url>` | none, required | The Postgres database to fill |
| `--replace` | off | Delete everything in the Postgres database first, when it is not empty |
| `--force-offline` | off | Skip the read-only check, because you stopped the CMS yourself |
| `--app-role <role>` | the accounts that had rights before | The database account the CMS will use, when `--to` is the owner account; it gets the same rights `migrate` gives it |
| `--config <file>` | `manablox.config.ts` | The config file that holds the SQLite address |

If the copy fails halfway, Postgres keeps the empty tables and you can run the command again. If the check finds a difference, the command lists it and ends with code `2`. The SQLite file is never changed.

## manablox sync

Your config and plugins can declare workflows, webhook endpoints, credential slots and content templates in code (see [Workflows and webhooks in code](../your-project/resources-in-code.md)). `sync` writes them into every space they target, so they appear in the admin.

```sh
pnpm exec manablox sync --dry-run
pnpm exec manablox sync
pnpm exec manablox sync --space blog
```

| Option | Default | Meaning |
| --- | --- | --- |
| `--config <file>` | `manablox.config.ts` | The config file to load |
| `--space <name>` | all spaces | Only this space, by its technical name. An unknown name stops with `no space with the machine name '<name>'` |
| `--dry-run` | off | Only show what would change, write nothing |
| `--prune` | off | Delete what is no longer declared. Without it, such things are only switched off |

It prints one line per change, and a count of the unchanged ones at the end. The sign at the start of each line says what happened:

| Sign | Meaning |
| --- | --- |
| `+` | created |
| `~` | updated |
| `-` | deleted (only with `--prune`) |
| `o` | switched off, or handed back to the editors |
| `!` | skipped, with the reason after it |

If there is nothing to do, it says `nothing to do`.

## manablox push-keys

Prints a new key pair for web push notifications (the kind a browser shows even when the admin is closed).

```sh
pnpm push-keys
```

It prints four lines, ready to paste into `.env`: `PUSH_VAPID_PUBLIC_KEY`, `PUSH_VAPID_PRIVATE_KEY` and an example `PUSH_VAPID_SUBJECT` (change the address to yours). Create the keys once and keep them: new keys break the subscriptions browsers already have. It has no options. In a `docker` project, run it as `docker compose run --rm --no-deps api push-keys`.

## manablox docs generate

Writes reference pages about your CMS into a folder, as Markdown files: every error message key, every API endpoint, and every hook with what it receives, including those of the plugins in your config. The [developer documentation](https://dev.manablox.io) is made this way. It only reads the config and needs no database.

```sh
pnpm exec manablox docs generate --out reference-docs
```

It writes `reference/errors.md`, `reference/http-api.md` and `extending/hooks.md` into the folder; files already there are replaced.

| Option | Default | Meaning |
| --- | --- | --- |
| `--out <dir>` | none, required | The folder to write into |
| `--config <file>` | `manablox.config.ts` | The config whose plugins the pages list |

## manablox user create

Creates an account that signs in to the admin with its email and password. Run it after the database is up to date (`pnpm migrate`). `manablox create` runs it for you when you let it create the administrator.

```sh
pnpm exec manablox user create --email you@example.com --name "Your Name"
MANABLOX_USER_PASSWORD='a long secret password' pnpm exec manablox user create --email ci@example.com
```

In a `docker` project, run it in the migrate container: `docker compose run --rm migrate user create --email you@example.com`.

The first account is always a **superadmin**: it may do everything, in every space, and it becomes the owner of every space that exists already. Once it exists, the admin shows its sign-in page instead of the setup assistant, and nobody can sign up there any more. Later accounts are created here or under `Settings > Users`.

The password is not an option, so it never lands in your shell history. The command reads it from the `MANABLOX_USER_PASSWORD` environment variable, or asks for it twice in the terminal ("Password" and "Repeat the password"). It needs 12 to 200 characters. If an account with the email exists already, the command changes nothing, says so and still succeeds.

| Option | Default | Meaning |
| --- | --- | --- |
| `--email <email>` | required | The email to sign in with. Stored in lowercase |
| `--name <name>` | `Administrator` | The name shown in the admin |
| `--role <role>` | `superadmin` | `superadmin` or `editor`. The first account is a superadmin either way |
| `--config <file>` | see above | The config file to read |

| Message | Cause |
| --- | --- |
| `no password; set MANABLOX_USER_PASSWORD or run this in a terminal to be asked` | No environment variable and no terminal to ask in, for example in a script |
| `the password needs 12 to 200 characters` | The password is too short or too long |

## manablox space create

Creates a space the same way the admin does, in the database of your project. Run it after the database is up to date (`pnpm migrate`). `manablox create` runs it for you when you let it create a first space.

```sh
pnpm exec manablox space create --name "My site"
pnpm exec manablox space create --name "Acme Blog" --template blog --website designed --theme editorial --design journal
pnpm exec manablox space create --name Docs --locales en,de --url https://docs.example.com
```

In a `docker` project, run it in the migrate container: `docker compose run --rm migrate space create --name "My site"`.

With `--owner`, that account owns the space. Without it, the space has no owner yet, and the first account you create becomes the owner of every space. If a space with the same technical name exists already, the command changes nothing, says so and still succeeds, so a setup script can run it twice.

| Option | Default | Meaning |
| --- | --- | --- |
| `--name <name>` | required | The name of the space, 1 to 200 characters |
| `--machine-name <name>` | made from the name | The technical name: a lowercase letter first, then letters, digits, `-` or `_`. `Acme Blog` becomes `acme-blog` |
| `--url <url>` | `http://localhost:3200` | The address of the website |
| `--locales <list>` | `en` | The languages, comma separated, for example `en,de`. The first one is the default language |
| `--template <id>` | none | Fill the space as a website type: `business` (company website with services, a team, testimonials, questions and a contact form), `landing` (product or landing page with features, numbers, pricing and questions), `portfolio` (projects, a project grid, a gallery and a contact form), `blog` (posts, pages and a blogroll), `basic` (Page and Article types with a Teaser block) or `custom` (the sections from `--blocks`). Every type adds published example pages and a main menu; see [Spaces](../admin/spaces.md#type-of-website) |
| `--blocks <list>` | `hero,text,media-text,gallery,quote,call-to-action` | The sections of the `custom` type, comma separated, and implies it: `hero`, `text`, `media-text`, `image`, `gallery`, `quote`, `features`, `stats`, `faq`, `pricing`, `testimonials`, `team`, `contact`, `call-to-action`. The site designs have a design for each |
| `--starter` / `--no-starter` | `--no-starter` | The same as `--template basic`, or an empty space |
| `--plan <file>` | none | A JSON file with content types to add after the template: `{ "types": [...] }`, with types that reference each other by name, the way the admin's AI designer proposes them. The file is checked first; if a type cannot be created, no space is made |
| `--owner <email>` | none | The account that owns the space. An unknown email stops with `no account with the email ...` |
| `--plugin-data <id>=<json>` | none | Data for a plugin that takes part in creating spaces, for example `--plugin-data 'hello={"greeting":"Hi"}'`. Give it once per plugin. It cannot be combined with that plugin's own options, such as `--website designed` |
| `--config <file>` | see above | The config file to read |

The website plugin adds these options:

| Option | Default | Meaning |
| --- | --- | --- |
| `--website <kind>` | `external` | `designed`: apply the theme from `--theme`, switch the space to a designed site and use the host of `--url` as its domain (see [A website without code](../design/index.md)). `external`: you build the website yourself on the public API |
| `--theme <id>` | `neutral` | With `--website designed`. Professional: `neutral`, `corporate`, `minimal`, `practice`. Creative: `bold`, `studio`, `playful`, `noir`. Personal: `editorial`, `journal`, `blossom`, `terminal` |
| `--design <id>` | the theme group's first | With `--website designed`: a complete site design (layout, menus, sections and page layouts), published at once. Any design works with any theme. Professional: `atlas`, `harbor`, `ledger`, `summit`. Creative: `spotlight`, `gallery`, `poster`, `stage`. Personal: `journal`, `sunny`, `readme`, `postcard`. `none` keeps only the theme |

If the host of `--url` belongs to another space already, the space is still created and the message tells you to add a domain under Settings, API hosts. `--website designed` needs the website plugin in the config, as in every project made with `manablox create`.

## manablox create [dir]

Writes a complete, runnable CMS project into a new folder: config files, a `.env` with freshly generated secrets, and a Docker Compose file. See [Create your CMS](../getting-started/create-your-cms.md) for a walk-through and [A tour of your project](../your-project/index.md) for the files it writes.

```sh
pnpm dlx @manablox/cli create my-cms
pnpm dlx @manablox/cli create my-cms --yes
pnpm dlx @manablox/cli create my-cms --preset docker --proxy caddy --admin-domain cms.example.com --public-domain content.example.com --acme-email you@example.com
```

Every option you do not give is asked in the terminal. With `--yes`, or when there is no terminal (for example in a script), nothing is asked and the defaults are used.

:::note
The default preset is `local`, for a CMS on your own computer (also with `--yes`). For a server, answer the question with one of the Docker answers or pass `--preset docker`. Giving `--proxy` without `--preset` also means `docker`.
:::

### The questions

They come in this order. Questions that do not apply to your earlier answers are left out.

| Question | Asked when | Default |
| --- | --- | --- |
| Where should the instance be created? | No folder was given | `my-cms` |
| Project name | Always | The folder name |
| Which database? | No `--database` given | Postgres |
| How will this instance run? | No `--preset` or `--proxy` given, or `--preset docker` without `--proxy` | Local development (Docker behind Caddy with `--preset docker`) |
| Add a public delivery instance? | Always | Yes |
| Which features does this instance get? | No `--features` given, and not every feature named with `--website`, `--no-ai` and the like | None (only the features you name with a switch are left out of the list or picked in it) |
| Domain of the admin and management API | Docker with Caddy or nginx | `cms.example.com` |
| Domain of the public delivery API | Docker with Caddy or nginx, with the public API | `content.example.com` |
| Email for TLS certificate notices | Docker with Caddy | `ops@example.com` |
| Port of the admin and management API | Local, or Docker with ports published | `3000` |
| Port of the public delivery API | Same, with the public API | `3100` |
| Port to publish Postgres on | Local, with Postgres | `5432` |
| Port to publish Valkey on | Local | `6379` |
| Where do uploads live? | Always | On disk |
| How does this instance send mail? | Always | Mailpit for local, No mail for Docker |
| Create the administrator account now? | No `--admin`, `--no-admin`, `--admin-email` or `--admin-name` given | Yes |
| Email of the administrator | Creating the administrator | `admin@example.com` |
| Name of the administrator | Creating the administrator | `Administrator` |
| Create a first space? | No `--space`, `--no-space` or other `--space-...` option given | Yes |
| Name of the first space | Creating a space | `My site` |
| Port of the site process | With designed websites, local or Docker with ports published | `3200` |
| How is its website built? | Creating a space, with designed websites | Designed site |
| Which theme does the site start with? | A designed site | Neutral |
| Which design does the site start with? | A designed site | The theme group's first |
| Address of the website | Creating a space | The site process (`http://localhost:3200`), `https://www.example.com` behind Caddy or nginx, or `http://localhost:3005` for your own frontend |
| What does the space start with? | Creating a space | Preconfigured (or Empty space) |
| What kind of website is it? | A preconfigured space | Basic setup (or Company website, Product or landing page, Portfolio, Personal blog, Pick your blocks) |
| Which sections are the pages built from? | Pick your blocks | Hero, text, media and text, gallery, quote and call to action |
| Install dependencies now with pnpm? | Always | Yes |
| Initialise a git repository? | Always | Yes |
| Start Postgres and Valkey, migrate and run pnpm dev once everything is installed? (local; with SQLite it names only Valkey) or Build and start the Docker stack once everything is installed? (docker) | When installing | No |
| Password of the administrator, then Repeat the password | Creating the administrator and starting, without `MANABLOX_USER_PASSWORD` | none |

The answers to "Which database?" are Postgres and SQLite. The answers to "How will this instance run?" are Local development, Docker behind Caddy, Docker behind nginx, and Docker, ports published.

"Which features does this instance get?" is a list you tick with the space bar and confirm with Enter: Designed websites, AI assistance, Workflows and Webhooks. Picking none gives the core CMS: spaces, content types, content, media, users and roles, environments, publishing, approvals, notifications and the delivery APIs. Some features work together when both are picked (the hint says which): AI adds a step to workflows and designs to websites, webhooks start workflows. You can add or remove any of them later with [`manablox plugin`](#manablox-plugin).

### Options

| Option | Default | Meaning |
| --- | --- | --- |
| `[dir]` or `--dir <dir>` | asked, else `my-cms` | The folder to create. It must be empty or not exist yet |
| `--name <name>` | the folder name | The name in `package.json` and of the Docker Compose project. Lowercase letters, digits, `-`, `_` and `.` |
| `--preset <preset>` | `local` | `local`: Docker runs only Postgres and Valkey (with SQLite only Valkey), the CMS runs on your computer. `docker`: every part in containers, for a server |
| `--proxy <proxy>` | `caddy` | Docker only; giving it without `--preset` picks `docker`. `caddy`: a web server with automatic HTTPS certificates. `nginx`: a web server with certificates you provide. `none`: no web server, the ports are published for one you run yourself |
| `--database <database>` | `postgres` | `postgres`: a Postgres server, run by Docker in both presets; the public API connects with its own read-only database user. `sqlite`: the whole database is one file (`data/manablox.db`, or the `database` volume in the docker preset), so no database server runs at all. SQLite allows one writer, so run only one management instance. The backup scripts use `manablox backup` |
| `--public` / `--no-public` | `--public` | Add the separate, read-only public API for your websites, or leave it out |
| `--features <list>` | asked, else none | The features, exactly these, comma separated: `website`, `ai`, `workflows`, `webhooks`, or `none` for the core alone. Cannot be combined with the switches below |
| `--admin-domain <host>` | `cms.example.com` | Caddy and nginx: the domain of the admin. A prefix `http://` means no HTTPS, for a trial |
| `--public-domain <host>` | `content.example.com` | Caddy and nginx: the domain of the public API, same rules |
| `--acme-email <email>` | `ops@example.com` | Caddy: where certificate notices are sent |
| `--admin-port <port>` | `3000` | Without a web server: the port of the admin and the management API |
| `--public-port <port>` | `3100` | Without a web server: the port of the public API |
| `--postgres-port <port>` | `5432` | Local with Postgres: the port Postgres is reachable on from your computer |
| `--valkey-port <port>` | `6379` | Local: the port Valkey is reachable on |
| `--storage <driver>` | `local` | `local`: uploads are saved on disk. `s3`: in an S3-compatible bucket, whose keys go into `.env` |
| `--mail <driver>` | `mailpit` (local), `none` (docker) | `smtp`, `mailpit`, `gmail`, `microsoft`, `resend`, `sendgrid`, `postmark`, `mailgun` or `none`. See [Sending email](../your-project/mail.md) |
| `--admin` / `--no-admin` | `--admin` | Create the first account, a superadmin, which then owns the first space. With `--start` it is created as soon as the database is ready. Otherwise "Next steps" shows the `manablox user create` command, which asks for the password |
| `--admin-email <email>` | `admin@example.com` | The email of the administrator. Giving `--admin-email` or `--admin-name` means `--admin` |
| `--admin-name <name>` | `Administrator` | The name of the administrator. With `--start` the password is asked in the terminal or read from `MANABLOX_USER_PASSWORD`. With `--yes` and neither, a random password is generated and shown once, under "Administrator", at the end. The password is never written to a file |
| `--space` / `--no-space` | `--space` | Create a first space. With `--start` it is created as soon as the database is ready. Otherwise "Next steps" shows the `manablox space create` command to run after `pnpm migrate` (docker: after `docker compose up -d`) |
| `--space-name <name>` | `My site` | The name of the first space. Giving any `--space-...` option means `--space`. With `--admin` the administrator owns it |
| `--space-url <url>` | see the question above | The address of the website. A designed site answers on its host |
| `--space-locales <list>` | `en` | The languages, comma separated. The first one is the default. Never asked |
| `--space-template <id>` | `basic` | The first space's website type: `business`, `landing`, `portfolio`, `blog`, `basic` or `custom` |
| `--space-blocks <list>` | none | The sections of the `custom` type, as `--blocks` of `manablox space create` |
| `--space-starter` / `--no-space-starter` | `--space-starter` | The basic template, or an empty space |
| `--manablox-version <range>` | the version of this command | The version range of the `@manablox/*` packages. Never asked |
| `--install` / `--no-install` | `--install` | Run `pnpm install` after writing the files |
| `--git` / `--no-git` | `--git` | Run `git init` after writing the files |
| `--start` / `--no-start` | `--no-start` | Start right away. Local: starts Postgres (not with SQLite) and Valkey, migrates, creates the administrator and the first space and runs `pnpm dev`. Docker: builds the image, starts every container and creates the administrator and the first space |
| `--force` | off | Write into a folder that is not empty |
| `--yes` | off | Ask nothing and use the defaults for everything not given |

Each feature has a switch of its own, and the website plugin also has options. A feature's options only work when the feature is picked.

The website plugin adds these:

| Option | Default | Meaning |
| --- | --- | --- |
| `--website` / `--no-website` | not picked | Include the website plugin: the designer in the admin and the site process that shows the spaces you design as websites (see [A website without code](../design/index.md)) |
| `--site-port <port>` | `3200` | Without a web server, and in a local project: the port of the site process |
| `--space-website <kind>` | `designed` | `designed`: a website you design in the admin. `external`: your own website on the public API |
| `--space-theme <id>` | `neutral` | With a designed site: any `--theme` id of `manablox space create` |
| `--space-design <id>` | the theme group's first | With a designed site: any `--design` id of `manablox space create`, or `none` |

The AI plugin adds this:

| Option | Default | Meaning |
| --- | --- | --- |
| `--ai` / `--no-ai` | not picked | Include the AI plugin: the AI settings, the magic wands and the designing from a description (see [AI](../admin/ai.md)): the package, its line in `manablox.plugins.ts` and `AI_ALLOWED_HOSTS` in `.env` |

The workflows plugin adds this:

| Option | Default | Meaning |
| --- | --- | --- |
| `--workflows` / `--no-workflows` | not picked | Include the workflows plugin: the Workflows section (see [Workflows](../admin/workflows.md)) |

The webhooks plugin adds this:

| Option | Default | Meaning |
| --- | --- | --- |
| `--webhooks` / `--no-webhooks` | not picked | Include the webhooks plugin: the Webhooks section, and with workflows, workflows started by incoming webhooks (see [Webhooks](../admin/webhooks.md)) |

### Checks and messages

Values are checked before anything is written. In the questions, a wrong answer shows the problem and asks again; on the command line it stops the command.

| Message | Cause |
| --- | --- |
| `--name '...' is not a valid package name` | Uppercase letters, spaces or other characters in the name |
| `--preset must be one of local, docker, not '...'` | A value that is not in the list (the same for `--proxy`, `--database`, `--storage` and `--mail`) |
| `--admin-port '...' is not a port` | A port must be a whole number from 1 to 65535 |
| `--admin-domain '...' is not a host name` | A domain like `cms.example.com`, optionally with `http://` in front |
| `--acme-email '...' is not an email address` | Not an email address |
| `--start needs the dependencies installed; drop --no-install` | `--start` and `--no-install` together |
| `--space-theme belongs to the website plugin, which is left out; pick it with --website` | A website option (here `--space-theme`) without the website picked. With `--no-website` or `--features` the message says to drop `--no-website` or add `website` to `--features` |
| `--features: 'shop' is not one of website, ai, workflows, webhooks (or none for the core alone)` | An unknown feature in `--features` |
| `--features and --no-website both pick the features; use one` | `--features` together with a feature switch |
| `the password needs 12 to 200 characters` | `MANABLOX_USER_PASSWORD` holds a password that is too short or too long |
| `--space-url '...' is not a URL` | The address must start with `http://` or `https://` |
| `... is not empty; pass --force to write into it anyway` | The folder already has files in it |

If `pnpm install`, `git init` or a start step fails, the files stay written and the command tells you what to run yourself. At the end it prints "Next steps" with the commands for your setup. With `--start` on a local project, it hands over to `pnpm dev` in the same terminal.

## manablox plugin

Adds, removes, switches on and off the features of an existing project. Run it in the project folder.

```sh
pnpm exec manablox plugin list
pnpm exec manablox plugin install ai
pnpm exec manablox plugin install website workflows
pnpm exec manablox plugin uninstall webhooks
pnpm exec manablox plugin disable ai --space blog
```

| Command | What it does |
| --- | --- |
| `plugin list` | Shows every feature you can add, the plugins the project has installed and configured, and, when the database answers, whether their database changes are applied, whether they are switched on for the whole CMS and, for the premium ones, their license state |
| `plugin install <name>...` | Adds features: `website`, `ai`, `workflows`, `webhooks`, or the npm package of another Manablox plugin. It asks the plugin's own questions (the website asks for the site port), adds the package, writes the plugin's parts into your project files, installs the packages and updates the database. Adding a feature that is there already changes nothing |
| `plugin uninstall <name>...` | Removes features again, after asking you to confirm. What the feature stored stays in the database: installing it again brings it all back. A feature another one needs cannot be removed first |
| `plugin enable <name>`, `plugin disable <name>` | Switches a feature on or off for the whole CMS, or with `--space <name>` for one space. The feature stays installed; switched off, it is hidden and does nothing |

| Option | Default | Meaning |
| --- | --- | --- |
| `--yes` | off | Ask nothing: install takes the defaults, uninstall does not ask to confirm (needed without a terminal) |
| `--install` / `--no-install` | `--install` | Run the project's package manager (pnpm, npm, Yarn or Bun, whichever the project uses) |
| `--migrate` / `--no-migrate` | `--migrate` | Update the database after installing, when it is reachable. In a `docker` project the `migrate` service does it on the next `docker compose up` |
| `--strict` | off | Stop with an error when a file lacks its place for a part (see below) |
| `--space <name>` | none | `enable`, `disable`: one space, by its technical name |
| `--config <file>` | `manablox.config.ts` | The config file |

The command changes only the parts it marked: every place a feature can add to has a comment such as `# manablox:slot env` in the file, and each feature's part sits between `manablox:plugin <name> >>>` and `<<<` comments. Edit around them as you like. Where one of these comments is missing, the command writes nothing into that file and shows the part and the file it belongs in, so you can add it yourself.

After installing or removing a feature, restart the CMS (`pnpm dev` restarts on its own). In a `docker` project run `./scripts/lockfile.sh` and `docker compose up -d --build`.

Designed websites and AI assistance are premium features: they need a license. When you install one and no license covers it yet, the command asks once what to do: start a 14-day trial, buy a subscription, enter a key you already have, or later. It installs the feature either way; without a license it stays locked. With `--yes` or without a terminal it shows the commands to run instead. `manablox create` asks the same question once at the end, when you picked a premium feature.

## manablox website

Commands of the website plugin, for a project whose config includes it (made with designed websites, or after `manablox plugin install website`). They work on the database of your config, like the admin.

```sh
pnpm exec manablox website publish-all --space blog
pnpm exec manablox website domains list --space blog
pnpm exec manablox website domains add www.example.com --space blog --primary
pnpm exec manablox website domains verify www.example.com --space blog
pnpm exec manablox website domains remove www.example.com --space blog
```

| Command | What it does |
| --- | --- |
| `publish-all` | Publishes every design draft of the space at once, like Publish all in the admin |
| `domains list` | Lists the space's site domains, which one is primary and whether each is verified |
| `domains add <hostname>` | Adds a site domain and prints the DNS TXT record that verifies it |
| `domains verify <hostname>` | Checks the domain's DNS records now. Ends with code `2` while it is not verified |
| `domains remove <hostname>` | Removes the site domain |

| Option | Default | Meaning |
| --- | --- | --- |
| `--space <name>` | the only space | The space, by technical name or id. Needed when there are several |
| `--primary` / `--no-primary` | `--no-primary` | `domains add`: make it the primary domain |
| `--config <file>` | see above | The config file to read |

`pnpm exec manablox website --help` prints the same list.

## manablox license

License keys for the premium features, designed websites and AI assistance. You buy a subscription in the license portal, and the key lands in your project's `.env` as `MANABLOX_LICENSE_KEYS`. Keys are secrets: never put them in `manablox.config.ts`.

```sh
pnpm exec manablox license buy
pnpm exec manablox license buy --plugins ai,website --yearly
pnpm exec manablox license buy --plugins ai --trial --monthly
pnpm exec manablox license add MBX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
pnpm exec manablox license status
pnpm exec manablox license remove XXXXX
```

| Command | What it does |
| --- | --- |
| `buy` | Asks which premium features you want (both together are the bundle) and whether to pay monthly or yearly, with the prices. It then opens the portal in your browser and shows a code: check that the portal shows the same one, and pay there. The command waits until you are done, for up to 30 minutes, then saves and activates the key by itself. You can close the browser tab after paying. Whether a free trial applies, the portal decides. Ctrl+C stops waiting |
| `add <key>` | Saves a key you already have in `.env` and activates it. Without a `.env` it asks whether to create one, or shows the line to add to your server's settings. When all the subscription's production places are taken, it lists the other installations using them and offers to switch one off, to use this installation as a development one, or to stop |
| `status` | Shows every key with its features, kind, state, when the paid or trial period ends and when the license was last checked, then the state of each premium feature. Ends with code `1` while a premium feature is locked |
| `activate [<key id>]` | Activates the keys again, for example after restoring a backup on another server |
| `refresh` | Checks every license with the license server now |
| `remove <key id>` | Switches the key off on the license server and takes it out of `.env` (a key added in the admin is removed there) |
| `open [billing]` | Opens your subscriptions in the portal, or with `billing` your account |

| Option | Default | Meaning |
| --- | --- | --- |
| `--plugins <list>` | asked | `buy`: `ai`, `website`, or `ai,website` (also written `bundle`). Needed without a terminal |
| `--yearly`, `--monthly` | asked | `buy`: how often you pay. Needed without a terminal |
| `--trial` | off | `buy`: go straight to the free 14-day trial. The portal still checks that the trial is unused |
| `--dev`, `--production` | decided by the addresses | `add`, `activate`: a development installation takes no production place but only works on local addresses such as `localhost` |
| `--name <name>` | the admin's address and the start of the instance id | `add`: the name the portal shows for this installation |
| `--no-activate` | activate | `buy`, `add`: only save the key in `.env`; the CMS activates it when it starts |
| `--no-browser` | open the browser | `buy`, `open`: only show the address. Also the default without a terminal and over SSH |
| `--json` | off | `status`: the details as JSON |
| `--yes` | off | Ask nothing |
| `--config <file>` | see above | The config file to read |

The key id is the first group of a key, `XXXXX` in `MBX-XXXXX-...`. `status`, `activate`, `refresh` and `remove` need the database of your config, like the admin.

## manablox frontend [dir]

Writes a starter website that reads your content from the public API: it finds pages by their web address, draws blocks with one component each, and has a `/preview` page for the admin's visual editor. See [The starter website](../website/starter-website.md) for what you get.

```sh
pnpm dlx @manablox/cli frontend my-site
pnpm dlx @manablox/cli frontend my-site --framework astro --yes
pnpm dlx @manablox/cli frontend my-site --url https://content.example.com --editor-origin https://cms.example.com
```

As with `create`, missing options are asked, and `--yes` or a missing terminal uses the defaults.

:::tip
The defaults fit a `local` project made by `manablox create`: the public API at `http://localhost:3100` and the admin at `http://localhost:3000`. When your CMS runs on a server, pass its addresses with `--url` and `--editor-origin`, or the visual editor cannot talk to your website.
:::

### The questions

| Question | Asked when | Default |
| --- | --- | --- |
| What should the frontend be built with? | No `--framework` given | Astro |
| Where should the frontend be created? | No folder given | `my-site` |
| Project name | Always | The folder name |
| URL of the delivery API | Always | `http://localhost:3100` |
| The admin's origin, for the visual editor's preview channel | Always | `http://localhost:3000` |
| Write components for a space's content and block types? | No `--model` or related option given | Yes, from the management API |
| URL of the management API, API key | Components from the management API | `http://localhost:3000` |
| Which space should the components be written for? | The key can read several spaces | the first |
| Which types should get a component? | Components are written | All types |
| Space id | Always | empty, or the space picked above |
| Port of the dev server | Always | depends on the framework |
| Install dependencies now with pnpm? | Always | Yes |
| Initialise a git repository? | Always | Yes |

If the content model cannot be read (wrong address, wrong key), you can try again or go on without it; you then get an example "teaser" block instead. For the "delivery API" answer, the public API must be running; for the management API you need an API key from `Settings > API keys` in the admin (see [API keys](../admin/api-keys.md)).

### Options

| Option | Default | Meaning |
| --- | --- | --- |
| `[dir]` or `--dir <dir>` | asked, else `my-site` | The folder to create |
| `--framework <name>` | `astro` | `plain` (Vite and TypeScript, rendered in the browser), `astro` (Astro, rendered on the server), `react-ssr` (React, rendered on the server), `vue-ssr` (Vue, rendered on the server) |
| `--name <name>` | the folder name | The name in `package.json` |
| `--url <url>` | `http://localhost:3100` | The public API the website reads from |
| `--editor-origin <url>` | `http://localhost:3000` | The address of the admin. The preview page only accepts messages from there |
| `--space-id <id>` | empty | Leave empty for the public API, which serves exactly one space |
| `--port <port>` | `3003` plain, `3005` astro, `3006` vue-ssr, `3007` react-ssr | The port of the website's dev server |
| `--model <source>` | asked; `none` with `--yes` or without a terminal | Where to read your content types from: `management` (with an API key), `delivery` (the public API at `--url`, no key) or `none` (just the example block) |
| `--api-url <url>` | `http://localhost:3000` | The management API, for `--model management` |
| `--api-key <key>` | none | An API key that may read the space. Implies `--model management`; required for it with `--yes` or without a terminal |
| `--space <name>` | the only one | The space by technical name or id. Needed when the key can read several spaces |
| `--types <list>` | `all` | The content and block types to write components for, as `all` or a comma-separated list like `page,teaser` |
| `--manablox-version <range>` | the version of this command | The version range of the `@manablox/*` packages |
| `--install` / `--no-install` | `--install` | Run `pnpm install` afterwards |
| `--git` / `--no-git` | `--git` | Run `git init` afterwards |
| `--force` | off | Write into a folder that is not empty |
| `--yes` | off | Ask nothing and use the defaults |

URLs must start with `http://` or `https://`; a slash at the end is removed. Giving `--api-key`, `--api-url` or `--space` without `--model` means `management`; giving only `--types` means `delivery`.

The addresses end up in the website's `.env` (`MANABLOX_URL`, `MANABLOX_ADMIN_ORIGIN`, `MANABLOX_SPACE_ID`, with a `VITE_` prefix for `plain`), where you can change them later.

## Exit codes

When a command ends, it reports a number to the terminal or script that ran it. `0` means success.

| Code | Meaning |
| --- | --- |
| `0` | Success, or the help text was asked for |
| `1` | Something went wrong: an unknown command or option, a wrong value, an invalid config, or an error while running. The message starts with `manablox:`. `license status`: a premium feature is locked |
| `2` | `sync --dry-run`: there is something to change. `migrate-db`: the check found a difference in the copy. `website domains verify`: the domain is not verified yet. A script can stop on this |
| `130` | `create` or `frontend` was cancelled with Ctrl+C during the questions. It prints `manablox: cancelled, nothing was written`. `license buy` was stopped with Ctrl+C while it waited |

`create --start` on a local project ends with the exit code of `pnpm dev`, which it runs at the end.
