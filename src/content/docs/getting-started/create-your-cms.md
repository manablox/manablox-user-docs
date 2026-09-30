---
title: "Create your CMS"
description: "One command writes a complete, runnable Manablox project. This page walks through every question it asks, then starts the database and the CMS."
---

In this step you create your own Manablox project: a folder with a handful of configuration files, fresh secret passwords, and everything needed to run the CMS. One command does it by asking you a few questions. Afterwards you start the database and the CMS with three more commands.

Make sure the tools from [What you need](./before-you-begin.md) are installed and Docker is running.

## Run the command

Open a terminal in the folder where your projects should live (for example your home folder or a `projects` folder) and run:

```sh
pnpm dlx @manablox/cli create my-cms
```

What this does: `pnpm dlx` downloads the `manablox` command from npm just for this one run, without installing it on your computer. `create my-cms` tells it to create a new CMS in a new folder called `my-cms`. You can pick any folder name made of lowercase letters, digits, `-`, `_` and `.`.

If you prefer npm, `npx @manablox/cli create my-cms` does the same.

You should see the Manablox logo and then the first question. Answer each question and press Enter. For questions with a default (shown in grey), pressing Enter without typing accepts it. For choices, use the arrow keys and press Enter.

:::tip
To stop at any point, press Ctrl+C. The command then says that it was cancelled and nothing was written.
:::

## The questions, in order

The command only asks what it needs. The questions below are the ones you see for a project on your own computer. Recommended answers for learning are in the last column.

| Question | What it means | Answer for learning |
| --- | --- | --- |
| Project name | The name inside `package.json` and for the Docker containers | Press Enter (it takes the folder name) |
| Which database? | Postgres or SQLite, see below | Press Enter (Postgres) |
| How will this instance run? | Where the CMS runs, see below | Press Enter (Local development) |
| Add a public delivery instance? | Whether to add the separate, read-only public API your website reads from | Yes |
| Which features does this instance get? | A list of optional features: designed websites, AI assistance, workflows and webhooks, see below | Nothing ticked, or Designed websites to try the designer |
| Port of the admin and management API | The port of the admin in your browser | Press Enter (`3000`) |
| Port of the public delivery API | The port of the public API | Press Enter (`3100`) |
| Port to publish Postgres on | The port of the database on your computer. Not asked with SQLite | Press Enter (`5432`) |
| Port to publish Valkey on | The port of the cache on your computer | Press Enter (`6379`) |
| Where do uploads live? | Where images and files you upload are stored | On disk |
| How does this instance send mail? | How the CMS sends emails | Mailpit |
| Create the administrator account now? | Whether the command creates your first account, see below | No |
| Create a first space? | Whether the command creates a first space, see below | No |
| Port of the site process | The port designed websites are shown on. Only with designed websites | Press Enter (`3200`) |
| Install dependencies now with pnpm? | Download the packages right away | Yes |
| Initialise a git repository? | Start a Git history for the project | Yes (or No without Git) |
| Start Postgres and Valkey, migrate and run pnpm dev once everything is installed? (with SQLite it names only Valkey) | Do the next steps on this page for you | No, the first time |

If you ran the command without a folder name, the very first question is "Where should the instance be created?" instead.

### Which database?

The database is where the CMS keeps everything you create in the admin. **Postgres** is a database server that Docker runs for you; it is the default and fits every size. **SQLite** is a database that is a single file, run inside the CMS itself, so Docker has one service less to run. This guide follows Postgres; where SQLite differs, it says so. For learning, press Enter. [The database](../your-project/database.md) helps you choose.

### How will this instance run?

This is the most important choice. It offers four answers:

| Answer | What you get |
| --- | --- |
| Local development | Docker runs only the database and the cache (with SQLite only the cache); the CMS itself runs on your computer |
| Docker behind Caddy | Everything in containers, with a web server that gets HTTPS certificates automatically. For a server on the internet |
| Docker behind nginx | Everything in containers, behind nginx with certificates you provide |
| Docker, ports published | Everything in containers, for a server where you already run your own web server |

For learning, pick **Local development**. It is the first entry and already highlighted, so just press Enter. The CMS then runs directly on your machine, restarts by itself when you change a file, and shows its messages right in your terminal. The Docker answers are for going live and are explained in [Put it on a server](../going-live/index.md). The Caddy and nginx answers ask for domain names instead of ports (Caddy also for an email address); you do not see those questions with Local development.

### The public API

Answer **Yes**. The public API is what your website will read from in [Show it on a website](./first-website.md). It only serves published content of one space and cannot change anything, which makes it safe to expose. You can read more in [The public API](../website/public-api.md).

### Features

Next comes a list of features. Nothing is ticked: a project without any is the core CMS, with spaces, content types, content, media, users and roles, publishing and the delivery APIs. Move with the arrow keys, tick with the space bar, confirm with Enter.

| Feature | What it adds |
| --- | --- |
| Designed websites | The website plugin: [design a website in the admin](../design/index.md) and have Manablox show it, with no separate website project. It brings a small extra program, the **site process**, that shows the designed sites |
| AI assistance | The AI plugin: magic wands, **Describe it** buttons and AI settings. Nothing is sent to an AI provider until someone adds a provider key under **Settings > AI**. See [AI](../admin/ai.md) |
| Workflows | The workflows plugin: automations built in the admin. See [Workflows](../admin/workflows.md) |
| Webhooks | The webhooks plugin: calls to other systems when content changes, and addresses other systems call. With workflows, those calls can start workflows. See [Webhooks](../admin/webhooks.md) |

Designed websites and AI assistance are premium features. On your own computer they run without a license key; at the end, `manablox create` asks whether to license them now, and **Continue without a key (development)** is fine. Production needs a subscription (see [Premium plugins and licenses](../your-project/premium-plugins.md)).

For this guide, tick **Designed websites** if you want to try the designer; the rest of the guide builds its own website and needs none of them. You can add any feature later with `pnpm exec manablox plugin install website` (or `ai`, `workflows`, `webhooks`) and remove it with `manablox plugin uninstall`; see [The manablox command](../help/cli.md#manablox-plugin). On the command line, `--features website,ai` picks features without the list.

### Uploads and mail

**On disk** keeps uploaded files in a `data/uploads` folder inside your project. The other choice, an S3-compatible bucket, stores them with a cloud storage service; see [Uploads and images](../your-project/storage-and-media.md).

**Mailpit** is a small test mail server that runs in Docker next to the database. It catches every email the CMS sends and shows it in a web inbox at `http://localhost:8025`, so nothing reaches real people while you experiment. The other choices (an SMTP server, Gmail, Microsoft 365, Resend, SendGrid, Postmark, Mailgun, or no mail) send real emails and need account details; see [Sending email](../your-project/mail.md).

### The administrator and a first space

The command offers to create the administrator account for you: its email and name, and, when it starts the CMS for you, its password. Answer **No** for this guide: on the next page the admin's setup assistant creates the account with you. Later, answering Yes saves that step; the command then runs `manablox user create` (see [The manablox command](../help/cli.md#manablox-user-create)) and the admin opens straight to its sign-in page.

Next it offers to create a first space for you: its name, how its website is built (designed in the admin, or your own frontend), a theme, the website address and the basic setup with example pages. Answer **No** for this guide: you create the space in the admin on the next page, where you see every setting. Later, answering Yes is a quick way to get a ready space; the command then runs `manablox space create` for you (see [The manablox command](../help/cli.md#manablox-space-create)).

### Installing and starting

When you answer Yes to installing, the command runs `pnpm install` in the new folder. This downloads a few hundred megabytes the first time and can take a few minutes. You see "Dependencies installed" when it is done.

The last question offers to start everything for you. Answer **No** the first time, so you run each step yourself below and know what it does. Later, answering Yes is a handy shortcut.

## What the command wrote

When it finishes, the command lists the files it wrote and prints the next steps. Your `my-cms` folder now contains:

| File or folder | What it is |
| --- | --- |
| `package.json` | The project's packages (`@manablox/...`) and its commands, such as `pnpm dev` |
| `pnpm-workspace.yaml` | Tells pnpm which packages may run install scripts |
| `tsconfig.json` | Settings for TypeScript, the language the config files are written in |
| `content-model.ts` | Plugins every process loads and content types defined in code; empty to begin with |
| `manablox.config.ts` | The settings of the CMS itself (admin and management API) |
| `manablox.plugins.ts` | The features you picked, as plugins; `manablox plugin` adds and removes them here |
| `manablox.public.config.ts` | The settings of the public API |
| `manablox.site.config.ts` | The settings of the site process, which shows designed websites. Not there without designed websites |
| `.env` | Addresses, ports and the secret passwords the command generated. Keep it private |
| `.env.example` | The same settings without the secrets, as a reference |
| `compose.yml` | Tells Docker which services to run: Postgres, Valkey and Mailpit (with SQLite no Postgres) |
| `postgres/init/` | Creates the database users on first start: one that owns the tables, one the CMS connects as, and a read-only one for the public API. Not there with SQLite |
| `README.md` | A short explanation of the project and its commands |
| `.gitignore` | Files Git should ignore, such as `.env` and `node_modules` |
| `node_modules/`, `pnpm-lock.yaml` | The downloaded packages and their exact versions |

A `data/` folder for uploads appears later, the first time you need it. You do not have to understand these files now. [A tour of your project](../your-project/index.md) explains each one, and [The .env file](../your-project/environment.md) explains every setting.

## Start the database

Go into the new folder:

```sh
cd my-cms
```

Start Postgres (the database), Valkey (the cache) and Mailpit (the test inbox) in Docker:

```sh
pnpm services:up
```

The first time, Docker downloads these programs, which takes a minute or two. You should see lines ending in "Started" or "Running" for each service. They keep running in the background, even after you close the terminal, until you stop them.

With SQLite, this starts only Valkey and Mailpit: the database is a file the CMS creates itself in the next step.

## Create the database tables

The database is empty. This command creates the tables Manablox stores its content in:

```sh
pnpm migrate
```

You should see `manablox: migrations applied`. If you see an error about connecting to the database instead, Postgres is probably still starting. Wait ten seconds and run `pnpm migrate` again. With SQLite, the database file `data/manablox.db` now exists in your project folder.

You run this command once now, and again after every update of Manablox. Running it twice does no harm.

## Start the CMS

```sh
pnpm dev
```

This starts the CMS: the admin and the management API, together in one process. It keeps running and prints its messages in this terminal, so leave the terminal open. After a few seconds you should see a line that contains the word `listening`.

Open `http://localhost:3000` in your browser. You should see a page titled "Create the administrator". That is the next step.

:::note
The log line may say `http://0.0.0.0:3000`. That means "every network address of this computer". In your browser, use `http://localhost:3000`.
:::

## Stopping and starting again

- To stop the CMS, click into its terminal and press Ctrl+C.
- To stop the database and the other services, run `pnpm services:down`. Your content is kept.
- To continue another day, open a terminal in `my-cms`, run `pnpm services:up`, then `pnpm dev`.

All the everyday commands are listed in [Everyday commands](../your-project/everyday-commands.md).

## If something goes wrong

| You see | Try this |
| --- | --- |
| `pnpm: command not found` | Go back to [What you need](./before-you-begin.md#pnpm) |
| `Cannot connect to the Docker daemon` | Start Docker Desktop, or the Docker service on Linux |
| `port is already allocated` or `address already in use` | Another program uses that port. Create the project again in a new folder and choose other port numbers, or stop the other program |
| `... is not empty; pass --force to write into it anyway` | The folder already exists. Choose another name |
| `pnpm install did not finish` | Check your internet connection, then run `pnpm install` inside the folder yourself |

More problems and their fixes are in [Common problems](../help/troubleshooting.md).

## Next step

Keep `pnpm dev` running and go on to [Sign in and create a space](./first-sign-in.md).
