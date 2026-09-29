---
title: "Plugins"
description: "A plugin is a small piece of code that adds field types, workflow actions, hooks or content types to your CMS. This page shows where plugins go in your project and how to write your first one."
---

A **plugin** adds something to Manablox that it cannot do out of the box: a new kind of field, a new step for workflows, some code that runs whenever a page is saved, or a set of content types you want to reuse. You write it in TypeScript inside your project, or you install one somebody else published on npm.

You already use a plugin without knowing it: all the built-in field types (text, rich text, images and so on) arrive as the plugin `manabloxFields()`.

:::note
This section is for developers. You need a project made with `manablox create` (see [Create your CMS](../getting-started/create-your-cms.md)) and a text editor. Everything you can do in the admin, like building content types, needs no plugin.
:::

## Where plugins go

Open `content-model.ts` in your project. It looks like this:

```ts
import type { ManabloxConfig } from '@manablox/core';
import { manabloxFields } from '@manablox/fields';

export const plugins: NonNullable<ManabloxConfig['plugins']> = [manabloxFields()];

export const contentTypes: NonNullable<ManabloxConfig['contentTypes']> = [];
```

The `plugins` list is where every plugin is switched on. The config files (`manablox.config.ts` for the admin, `manablox.public.config.ts` for the public API and, with designed websites, `manablox.site.config.ts` for the site process) import this file, so a plugin you add here is loaded by every Manablox process of your project. The features you picked (designed websites, AI, workflows, webhooks) are the exception: they live in `manablox.plugins.ts`, which lists what the admin loads (`plugins`) and what the public API loads (`publicPlugins`, only the website plugin), and which `manablox plugin install` and `uninstall` edit for you. Keep `manabloxFields()` in the list: without it, no content type can use the built-in fields.

## Your first plugin

This plugin does nothing useful yet. It only writes a line into the log, so you can see that plugins work.

1. In your project folder, next to `content-model.ts`, create a file called `hello-plugin.ts` with this content:

```ts
import { definePlugin, onHook } from '@manablox/core';

export const helloPlugin = definePlugin({
  name: 'hello',
  hooks: () => [
    onHook('after:init', (_payload, { manablox }) => {
      manablox.logger.info('Hello from my first plugin');
    }),
  ],
});
```

2. Open `content-model.ts`, import the plugin and add it to the list:

```ts
import type { ManabloxConfig } from '@manablox/core';
import { manabloxFields } from '@manablox/fields';
import { helloPlugin } from './hello-plugin.ts';

export const plugins: NonNullable<ManabloxConfig['plugins']> = [manabloxFields(), helloPlugin];

export const contentTypes: NonNullable<ManabloxConfig['contentTypes']> = [];
```

3. Save both files. If `pnpm dev` is running, it restarts by itself. Otherwise start it with `pnpm dev`.

You should see "Hello from my first plugin" in the terminal. Right below it, the start-up line `manablox initialised` lists the names of all loaded plugins: `@manablox/fields` and `hello`.

If the CMS stops with an error instead, check that the import ends in `.ts` (`'./hello-plugin.ts'`) and that the path matches where the file is.

`definePlugin` does nothing except check the shape of your plugin while you type. `name` is required and must be unique: if two plugins share a name, only the first one is loaded.

:::tip
With more than one or two plugins, a folder keeps them tidy: put the file at `plugins/hello-plugin.ts` and import it as `'./plugins/hello-plugin.ts'`. The `Dockerfile` of a `docker` project copies the whole project into the image (except what `.dockerignore` leaves out, such as `node_modules`, `data` and `.env`), so files in folders reach the server too.
:::

## What a plugin can contain

| Key | What it adds | More |
| --- | --- | --- |
| `name` | The plugin's unique name. Required | |
| `fieldTypes` | New kinds of fields for the admin's **Add field** menu | [Custom field types](./custom-field-types.md) |
| `contributions` | Additions to other plugins, for example new steps for the workflow editor under `contributions: { workflows: { actions } }` | [Workflow actions](./workflow-actions.md) |
| `hooks` | Code that runs at a named moment, such as a save or the start of the CMS, each made with `onHook` | [Hooks](./hooks.md) |
| `contentTypes` | Content types written in code, the same shape as in `content-model.ts` | [Content types in code](../your-project/content-types-in-code.md) |
| `extend` | Extra fields for content types written in code elsewhere: in `content-model.ts` or in another plugin | [below](#fields-for-several-content-types) |
| `credentials`, `templates` | Credential slots and content templates, written into your spaces by `manablox sync` | [Workflows and webhooks in code](../your-project/resources-in-code.md) |
| `resources` | Workflows and webhook endpoints, under `'workflows.workflow'` and `'webhooks.webhook'`, written into your spaces by `manablox sync` | [Workflows and webhooks in code](../your-project/resources-in-code.md) |
| `version`, `description` | Optional information about the plugin | |

Plugins can do much more: bring their own database tables, permissions, admin screens, API procedures, commands for `manablox` and even a whole extra process. The website plugin, which shows the sites you [design in the admin](../design/index.md), is built that way, and so are the AI plugin and the workflows plugin. Those parts are for plugin authors and need a build step; see [Admin screens](#admin-screens) below.

## Fields for several content types

A group of fields you want on several types, like search engine fields, can get there in two ways. Pick the first when your own `content-model.ts` declares the types, the second when the fields should come with a plugin.

**A shared list.** Write the fields once and add them to each type in `content-model.ts`:

```ts
const seoFields = [
  { name: 'meta_title', type: 'string', settings: { max: 60 }, admin: { zone: 'sidebar' } },
  { name: 'meta_description', type: 'string', settings: { editor: 'textarea', max: 160 } },
];

export const contentTypes: NonNullable<ManabloxConfig['contentTypes']> = [
  { name: 'article', label: 'Article', fields: [{ name: 'body', type: 'richtext' }, ...seoFields] },
];
```

**A plugin with `extend`.** The plugin adds fields to a content type that is declared somewhere else in code: in `content-model.ts` or in another plugin. This plugin (in `seo-plugin.ts`) adds the same two fields to `article`, shown in the side column of the editor:

```ts
import { definePlugin } from '@manablox/core';

export const seoPlugin = definePlugin({
  name: 'seo',
  extend: [
    {
      name: 'article',
      fields: [
        { name: 'meta_title', type: 'string', settings: { max: 60 }, admin: { zone: 'sidebar' } },
        {
          name: 'meta_description',
          type: 'string',
          settings: { editor: 'textarea', max: 160 },
          admin: { zone: 'sidebar' },
        },
      ],
    },
  ],
});
```

Add `seoPlugin` to the `plugins` list the same way. When you open an article in the admin, you see the two new fields, in every space: switching the plugin off for a space does not take them away. If two plugins add the same field, their settings are combined.

`extend` only reaches content types written in code. A type you built in the admin lives in the database, and the plugin cannot see it when the CMS starts. If the type does not exist in code, the CMS refuses to start with `plugin.extend.contentType.notFound`.

## A plugin from npm

A plugin somebody else published is an npm package. Its README tells you its package name and what to import. The steps are always the same:

1. Install the package in your project folder (replace the name with the real one):

```sh
pnpm add some-manablox-plugin
```

2. Import it in `content-model.ts` and add it to the `plugins` list, exactly as with your own plugin.
3. Restart `pnpm dev` if it does not restart by itself.

If `pnpm add` stops with (or warns about) `Ignored build scripts`, the package (or one of its dependencies) wants to run an install script, and pnpm blocks that unless you allow it. Add the package name under `allowBuilds:` in `pnpm-workspace.yaml` (for example `some-package: true`) and run `pnpm install` again. Only allow packages you trust.

## Plugins on the server

In a `docker` project, the image is built from your project folder, so a plugin reaches the server only when you rebuild:

1. If you changed `package.json` (for example with `pnpm add`), write the lockfile again:

```sh
./scripts/lockfile.sh
```

2. Build the image and start the new version:

```sh
docker compose build
docker compose up -d
```

Remember that your plugin is loaded by the public API process too. A `setup` function runs in both processes, so with `pnpm dev` and `pnpm dev:public` running you see the hello message twice. Hooks on content changes only fire in the admin's process, because the public API never changes content.

## Admin screens

The admin that comes with your project (the `@manablox/admin` package) is already built, and it stays that way. A plugin that wants its own admin pages, menu entries, field editors or panels ships them as a small, ready-built bundle of its own, and the admin loads that bundle when it starts. So installing a plugin from npm that has admin screens needs nothing more than the steps above: its screens appear after the restart. Leave `admin: true` in `manablox.config.ts`.

Writing such a bundle yourself is work for a plugin author: it is built with `@manablox/admin-plugin` and uses the building blocks of `@manablox/admin-sdk`. The developer documentation describes it: [admin plugins](https://dev.manablox.io/extending/admin-plugins/), [admin slots](https://dev.manablox.io/extending/admin-slots/) and [the admin SDK](https://dev.manablox.io/extending/admin-sdk/).

For a plugin in your project folder, two things work without any admin bundle:

- A custom field type can reuse one of the admin's built-in editors. See [Custom field types](./custom-field-types.md#the-editor-in-the-admin).
- A workflow action draws its settings form from its own description, so it appears in the workflow editor without any admin build. See [Workflow actions](./workflow-actions.md).

## When something goes wrong

The CMS checks all plugins when it starts and stops with a short message if something does not fit. The message starts with `manablox:` and names the problem:

| Message | Cause |
| --- | --- |
| `plugin.extend.contentType.notFound` | `extend` names a content type that is not declared in code |
| `contentType.name.duplicate` | A plugin declares a content type whose name is already taken |
| `fieldType.name.duplicate` | Two field types use the same `name` |
| `fieldType.name.invalid` | A field type's `name` is not lowercase letters, digits and `-`, starting with a letter |
| `codeResource.duplicate` | Two workflows, webhooks, credentials or templates share a slug |
| `contentType.field.type.notFound` | A content type uses a field type that no plugin provides any more, for example after you removed a plugin |

More problems and their fixes are in [Common problems](../help/troubleshooting.md).
