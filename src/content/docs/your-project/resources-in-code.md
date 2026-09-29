---
title: "Workflows and webhooks in code"
description: "Declaring workflows, webhooks, content templates and credential slots in manablox.config.ts, and writing them into the database with manablox sync."
---

Like content types, a few other things you normally click together in the admin can also be written down in code:

- [workflows](../admin/workflows.md), which do something automatically, for example send an email when a page is published,
- [webhooks](../admin/webhooks.md), which call another service when content changes, or let another service call your CMS,
- content templates, ready-made block layouts editors can start a page from,
- credential slots, named places for the passwords and API keys that workflows and webhooks use.

Writing them in code is useful when every installation of your CMS should have them (your laptop, a test server, the live server), or when you want them reviewed and versioned in Git. If you only need a workflow once, in one space, building it in the admin is simpler.

Workflows and webhooks in code need the workflows plugin and the webhooks plugin, which a project made with `manablox create` has when **Workflows** and **Webhooks** were picked (`manablox plugin install workflows webhooks` adds them later) (see [Workflows](../admin/workflows.md) and [Webhooks](../admin/webhooks.md)). Their helpers, `defineWorkflow` and `defineWebhook`, come from those plugins.

## How it works

Content types from code are simply read when the CMS starts. These four are different: they belong to a space, they have history (a workflow has runs, a webhook has a delivery log), and they are stored in the database. So you declare them in `manablox.config.ts`, and a separate command writes them into the database:

```sh
pnpm exec manablox sync
```

`sync` compares what the config declares with what is in the database, in every space, and creates or updates what is needed. Run it after you change a declaration. A space created later in the admin gets everything declared for it at the moment it is created, without a sync.

## A complete example

This example, for a company website with the `page` and `teaser` types from [Content types in code](./content-types-in-code.md), declares:

- a credential slot `site-deploy` for the token of your hosting service, left empty so someone fills it in the admin,
- an outgoing webhook `rebuild-site` that tells your hosting service to rebuild the website whenever content is published or unpublished,
- a workflow `tell-editors-on-publish` that emails the editors whenever a page goes live,
- a content template `landing-page` with one teaser block to start from.

In `manablox.config.ts`, first add `defineCredential`, `defineTemplate` and `ref` to the names imported from `@manablox/core` at the top, and import `defineWebhook` and `defineWorkflow` from the plugins:

```ts
import { defineWebhook } from '@manablox/plugin-webhooks/define';
import { defineWorkflow } from '@manablox/plugin-workflows/define';
import {
  cacheConfigFromEnv,
  databaseConfigFromEnv,
  defineConfig,
  defineCredential,
  defineTemplate,
  envBoolean,
  envList,
  envNumber,
  envOptional,
  envString,
  loggingConfigFromEnv,
  mailConfigFromEnv,
  mediaConfigFromEnv,
  ref,
  requireEnv,
  storageConfigFromEnv,
} from '@manablox/core';
```

Then add a `resources` section inside `defineConfig({ ... })`, for example right after `logging: loggingConfigFromEnv(),`:

```ts
  resources: {
    credentials: [
      // An empty slot: someone fills in the token in the admin.
      defineCredential({ slug: 'site-deploy', kind: 'bearer' }),
    ],

    plugins: {
      'webhooks.webhook': [
        defineWebhook({
          slug: 'rebuild-site',
          direction: 'outgoing',
          url: 'https://deploy.example.com/hooks/rebuild',
          events: ['content.published', 'content.unpublished'],
          auth: { mode: 'bearer', credential: 'site-deploy' },
        }),
      ],

      'workflows.workflow': [
        defineWorkflow({
          slug: 'tell-editors-on-publish',
          name: 'Tell the editors when a page goes live',
          enabled: true,
          trigger: {
            kind: 'event',
            events: ['content.published'],
            typeIds: [ref.contentType('page')],
          },
          steps: [
            {
              key: 'tell',
              action: 'email',
              config: {
                to: ['editors@example.com'],
                subject: 'Published: {{ content.title }}',
                body: '"{{ content.title }}" is live now.\n\n{{ url }}',
              },
            },
          ],
        }),
      ],
    },

    templates: [
      defineTemplate({
        slug: 'landing-page',
        title: 'Landing page',
        blocks: [
          {
            blockId: '6f1c2a4e-8b3d-4c5e-9f7a-1b2c3d4e5f60',
            type: ref.contentType('teaser'),
            fields: { headline: 'Your headline here', style: 'dark' },
          },
        ],
      }),
    ],
  },
```

Save the file, run `pnpm typecheck` to catch typos, and make sure the services are running (`pnpm services:up`). Then run the sync as shown below.

## Running the sync

1. Preview what would change, without writing anything:
```sh
pnpm exec manablox sync --dry-run
```
2. Read the report. For the example above, in a space called `website`, it looks like this:
```
manablox sync (dry run, nothing written): 1 space(s)
  + credential         site-deploy  [website] created  - no values declared; slot is empty
  + workflows.workflow tell-editors-on-publish  [website] created
  + webhooks.webhook   rebuild-site  [website] created  - its credential is empty, so it arrives off
  + template           landing-page  [website] created  - 1 locale(s)
```
3. If that is what you want, run it for real:
```sh
pnpm exec manablox sync
```
4. The same report appears without "(dry run, nothing written)". Reload the admin: the workflow is under Workflows, the webhook under Webhooks, the template under Templates and the credential under Settings > Credentials.

Each line of the report is one thing in one space. The sign at the start says what happens to it:

| Sign | Meaning |
| --- | --- |
| `+` | Created |
| `~` | Updated to match the config |
| `o` | Switched off (a declaration was removed) or handed back to the editors |
| `-` | Deleted (only with `--prune`) |
| `!` | Skipped; the text after it says why |

Things that are already up to date are only counted, in a last line like `4 unchanged`. With nothing to do the report says `nothing to do`.

### Options

| Option | What it does |
| --- | --- |
| `--dry-run` | Shows what would change and writes nothing. Ends with exit code 2 if anything would change, so a deploy script can stop and ask |
| `--space <name>` | Only this space, by its technical name, for example `--space website` |
| `--prune` | Deletes workflows and webhooks from code whose declaration you removed, instead of only switching them off |
| `--config <file>` | Another config file than `manablox.config.ts` |

### When to run it

- After you add, change or remove a declaration.
- After deploying a new version of your project to a server, right after the migration: first `migrate`, then `sync`.

In a `docker` project the config is part of the image, so rebuild first (`docker compose build`, then `docker compose up -d`), then run the sync inside a container:

```sh
docker compose run --rm api sync
```

If you would rather not think about it, add `apply: 'boot'` at the top of the `resources` section. The CMS then syncs by itself every time it starts. The default is `'manual'`, which waits for you to run the command.

## What sync will never do

`sync` is careful with what people changed in the admin:

- It never switches something back on. `enabled` only counts when a workflow or webhook is first created; after that, the on/off switch in the admin belongs to whoever runs the CMS.
- It never overwrites a stored secret with nothing. A credential slot declared without values keeps whatever someone filled in.
- It does not delete unless you ask. A declaration you remove only switches the workflow or webhook off (so its run history survives). `--prune` deletes them. Credentials and templates are never deleted; they are handed back to the admin as normal, editable entries.
- It does not take over names. If a workflow built in the admin already uses the same slug, the declaration is skipped and reported with `!`.

## In the admin

Everything written by `sync` carries a small "code" badge in the admin, and its editor is read-only. A few things stay in your hands there:

- the on/off switch of a workflow or webhook,
- filling in the secret of a credential slot,
- Clone on a workflow, which makes a normal, editable copy with no link to the config.

## Credential slots

The rule: the code declares the slot, the secret comes from somewhere else. There are two ways to fill a slot.

Leave it empty, as in the example, and fill it in the admin under Settings > Credentials. Until then, everything that uses the slot is created switched off; once the secret is filled in, switch it on yourself.

Or take the value from `.env` with `requireEnv`:

```ts
defineCredential({
  slug: 'search',
  kind: 'apiKey',
  values: { header: 'X-Api-Key', key: requireEnv('SEARCH_API_KEY') },
}),
```

Then put `SEARCH_API_KEY=...` in `.env`. The value is encrypted when `sync` stores it, just like a value typed into the admin. Note that `requireEnv` stops the CMS at start when the variable is missing, on every machine that uses this config.

:::danger
Never write a secret itself into the config file. The file goes into Git; `.env` does not.
:::

The kinds of credential and their values:

| `kind` | Values |
| --- | --- |
| `apiKey` | `header` (the header name; `X-Api-Key` when empty), `key`, optional `prefix` |
| `bearer` | `token` |
| `basic` | `username`, `password` |
| `oauth2` | `tokenUrl`, `clientId`, `clientSecret`, `refreshToken`, optional `scope` |
| `smtp` | `url` (for example `smtps://user:pass@smtp.example.com:465`), `from` |
| `signing` | `secret`, a shared secret for signed webhooks |
| `custom` | Any named values, for plugins |

## Workflows

`defineWorkflow`, from `@manablox/plugin-workflows/define`, takes:

| Key | What it means |
| --- | --- |
| `slug` | The technical name. The workflow is found by it, so renaming the slug creates a new workflow and leaves the old one behind |
| `name` | What the admin shows |
| `enabled` | Whether it starts switched on. Default `false`. Only read when the workflow is first created |
| `spaces` | `'*'` (the default) for every space, including future ones, or a list of technical names such as `['website']` |
| `trigger` | When it runs: `kind: 'event'` with a list of `events` (`content.created`, `content.updated`, `content.saved`, `content.published`, `content.unpublished`, `content.deleted`), `kind: 'schedule'` with a `cron` time, `webhookTrigger('from-github')` (from `@manablox/plugin-webhooks/define`) with the slug of an incoming webhook, or `kind: 'manual'` for a workflow you start with **Run**, with the `parameters` it asks for |
| `steps` | What it does, in order |

Each step has a `key` (lowercase letters, digits and `_`), which later steps use to read its result, for example `{{ nodes.tell.messageId }}`. A step normally runs after the one above it. The simplest step runs an action: `action` names it (`email` sends an email through [your mail settings](./mail.md), `http` calls a web address), and `config` holds its settings, with the same names as the fields in the admin's workflow editor. Steps can also branch on a condition, wait, or repeat for a list of items; build such a workflow in the admin first and use the admin's config download (see [Content types in code](./content-types-in-code.md#from-the-admin-to-code)) to get it as code.

Texts like `{{ content.title }}` are placeholders the workflow fills in when it runs. `{{ url }}` is a link to the document in the admin.

## Webhooks

`defineWebhook`, from `@manablox/plugin-webhooks/define`, takes a `slug`, a `direction` and, depending on the direction:

- Outgoing (`direction: 'outgoing'`): the `url` to call and the `events` to call it for (empty means all).
- Incoming (`direction: 'incoming'`): the `methods` it accepts (default `POST`). Its address is made from the slug, so it is the same on every installation; the admin shows it under Webhooks.

`auth` protects the call, with a `mode` (`hmac`, `token`, `basic`, `bearer`, and for outgoing also `oauth2`) and the slug of the `credential` that holds the secret.

## Content templates

`defineTemplate` writes a template document with a list of blocks.

- `slug` and `title` name it.
- `blocks` is a list of blocks. Each has a `blockId`, which must be a unique id in UUID format (make one with `node -e "console.log(crypto.randomUUID())"`), the block `type`, and the `fields` to fill in.
- `manage: 'seed'` (the default) writes the template once; after that it belongs to the editors and `sync` leaves it alone. `manage: 'managed'` rewrites it on every sync when the declaration changed, and the admin does not allow editing it.

A space that does not have the block types a template uses skips it.

## Referring to things by name: ref

The config cannot know the id a content type has in a space. `ref` writes a placeholder that `sync` turns into the right id in each space:

- `ref.contentType('page')` for a content type,
- `ref.credential('site-deploy')` and `ref.template('landing-page')` for the other declarations, by slug,
- `ref.of('webhooks.webhook', 'from-github')` for a webhook; in a workflow's trigger, `webhookTrigger('from-github')` does this for you.

If a space has nothing by that name, that one declaration is skipped for that space and reported with `!`; the rest of the sync carries on.
