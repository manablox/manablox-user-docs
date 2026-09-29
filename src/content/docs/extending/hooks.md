---
title: "Hooks"
description: "Run your own code when something happens in the CMS: before a document is saved, after it is published, when a file is uploaded. With the most useful hooks and two complete examples."
---

A **hook** is a named moment in the CMS, like "a document is about to be saved" or "a document was just published". Your code can listen to a hook and runs every time that moment comes. You register hooks in a [plugin](./plugins.md).

There are two kinds of hooks:

- **before** hooks run before the change is made. They can adjust the data (fill in a field, clean up a title) or stop the change.
- **after** hooks run once the change is saved in the database. They react to it: call another service, write a log line. If the save fails, they do not run at all.

:::tip
Many "when X happens, do Y" tasks need no code at all. [Workflows](../admin/workflows.md) send emails, call web addresses and change content when documents are created or published, and [webhooks](../admin/webhooks.md) notify other services. Reach for hooks when you need your own logic inside the save itself.
:::

## How to register a hook

Return the plugin's hooks from its `hooks` function, each made with `onHook`, the hook's name and a function:

```ts
import { definePlugin, onHook } from '@manablox/core';

export const myHooks = definePlugin({
  name: 'my-hooks',
  hooks: () => [
    onHook('content:afterPublish', (record, context) => {
      context.manablox.logger.info({ title: record.title }, 'published');
    }),
  ],
});
```

Your function gets two arguments:

- The **payload**: the data the hook is about, for example the document.
- The **context**: `context.manablox` (with `logger` for log lines), `context.spaceId`, `context.actor` (who did it, or `null` for the system), and for content hooks `context.contentType` (the content type, with its technical `name`). Hooks on content changes also get `context.services`, see [Changing other content from a hook](#changing-other-content-from-a-hook).

Save the file in your project folder, add the plugin to the `plugins` list in `content-model.ts`, and `pnpm dev` restarts with your hook active.

## The most useful hooks

| Hook | When it runs | Payload |
| --- | --- | --- |
| `content:beforeValidate` | A document is about to be checked and saved (new or existing). Return a changed payload to adjust fields; your changes are checked like an editor's | The save: `title`, `slug`, `locale`, `fields`, `spaceId` |
| `content:beforeCreate` | A new document passed the checks and is about to be written | The save, with checked `fields` |
| `content:afterCreate` | A new document was saved | The saved document |
| `content:beforeUpdate` | A changed document passed the checks and is about to be written | The save, with checked `fields` |
| `content:afterUpdate` | A changed document was saved | The saved document |
| `content:beforePublish` | A document is about to be published. Throw to stop it | The document |
| `content:afterPublish` | A document was published | The published document |
| `content:afterUnpublish` | A document was taken offline | `{ id }` |
| `content:beforeDelete` | A document is about to be deleted. Throw to stop it | `{ id }` |
| `content:afterDelete` | A document was deleted | `{ id, record }` |
| `contentType:afterCreate` | A content type was created | The content type |
| `contentType:afterUpdate` | A content type was changed | The content type |
| `asset:afterUpload` | A file was uploaded | `{ id }` |
| `menu:afterWrite` | A menu was saved | `{ id, spaceId }` |
| `member:afterGrant` | Someone got a role in a space, or their role changed | `{ spaceId, userId, role, previous }` |
| `workflows:afterRun` | A workflow run finished (with the workflows plugin; import `@manablox/plugin-workflows` for its types) | `{ runId, workflowId, spaceId, status, trigger, test }` |
| `after:start` | The CMS has started | none |
| `before:stop` | The CMS is shutting down | none |

A saved document has, among others, `id`, `title`, `slug`, `locale`, `status`, `fields` (your field values by technical name) and `permalink` (its web address path).

## Hooks on reading

Two hooks run before content is read, and let you refuse the read by throwing an error:

| Hook | When it runs | Payload |
| --- | --- | --- |
| `content:beforeRead` | One document is about to be read by its id, or on the website by its web address | `{ id }` |
| `content:beforeList` | A list of documents is about to be read: a page of a list, the children of a document, the content tree, the documents a query field shows, or a menu | What is asked for: `kind` (`list`, `children`, `tree`, `relation` or `menu`), `typeIds` (the content types it is limited to, empty for any), `locale`, and `parentId`, `fieldId` or `menu` depending on the kind |

Their context has `context.published`: `true` when the public website reads, `false` in the admin and in preview. Unlike the other hooks, read hooks also run in the public API. On the website a refused document answers "not found", a refused list comes back empty and a refused menu is missing.

After reading, `content:afterRead` runs for each document and `content:afterReadMany` once for the documents of a read. `content:afterReadMany` returns the documents to keep; one it leaves out reads as missing, on the website too. Documents read for the website have `searchText` set to `null`: the text the search looks at is not handed out.

## Example: fill in a summary

Editors often forget the summary of an article. This hook copies the title into an empty `summary` field before the document is checked. It assumes a content type with the technical name `article` and a text field `summary`.

1. Create `summary-hook.ts` next to `content-model.ts`:

```ts
import { definePlugin, onHook } from '@manablox/core';

export const summaryHook = definePlugin({
  name: 'summary-hook',
  hooks: () => [
    onHook('content:beforeValidate', (input, context) => {
      if (context.contentType.name !== 'article') return;
      if (input.fields.summary) return;
      return { ...input, fields: { ...input.fields, summary: input.title } };
    }),
  ],
});
```

2. Add `summaryHook` to the `plugins` list in `content-model.ts` (import it from `'./summary-hook.ts'`).
3. In the admin, save an article with an empty summary.

After saving, the summary field holds the title. Returning nothing (`return;`) leaves the document as it is, which is why the hook returns early for other content types and for articles that already have a summary.

## Example: rebuild the website after publishing

Some website hosts give you a "deploy hook", a secret web address that starts a new build of your site when something calls it. This hook calls it whenever a document is published.

1. Add the address to `.env`:

```sh
DEPLOY_HOOK_URL=https://example.com/your-secret-build-hook
```

2. Create `deploy-hook.ts` next to `content-model.ts`:

```ts
import { definePlugin, onHook } from '@manablox/core';

export const deployHook = definePlugin({
  name: 'deploy-hook',
  hooks: () => [
    onHook('content:afterPublish', async (record, context) => {
      const url = process.env.DEPLOY_HOOK_URL;
      if (!url) return;
      try {
        await fetch(url, { method: 'POST' });
        context.manablox.logger.info({ title: record.title }, 'deploy hook called');
      } catch (error) {
        context.manablox.logger.warn({ err: error }, 'deploy hook failed');
      }
    }),
  ],
});
```

3. Add `deployHook` to the `plugins` list in `content-model.ts` and restart `pnpm dev` (a change to `.env` needs a restart).
4. Publish a document.

The terminal shows "deploy hook called" with the document's title. The `try` and `catch` matter: see the rules below.

In a `docker` project, Compose hands every variable in `.env` to the `api` container, where hooks run, so `DEPLOY_HOOK_URL` needs no extra step. Rebuild the image for the new plugin file as described in [Plugins](./plugins.md#plugins-on-the-server).

:::note
The admin's [webhooks](../admin/webhooks.md) can call an address on every publish without any code. A hook like this one is worth it when you need a condition, for example only for some content types.
:::

## Changing other content from a hook

Most hooks only look at the change or call another service. If yours also has to write content, for example to update a parent page whenever a child is saved, write through `context.services.content` (the same content service the admin uses) instead of any service you keep yourself.

Some saves change several documents at once, for example duplicating a page with everything below it. Such a save runs in one database transaction, and its before hooks run inside it. `context.services` writes through that transaction, so what your hook writes is saved together with the change, or not at all. Services kept elsewhere would have to wait for the transaction to end: with SQLite the save hangs, and with Postgres other saves wait. In after hooks, `context.services` are the normal ones.

## The rules

- Hooks run one after another and are awaited, so an `async` function finishes before the next one starts. Keep them quick: the editor waits for them when saving.
- A `before` hook may return a changed copy of the payload, which the next hook and the save then use. Returning nothing keeps the payload as it is.
- Throwing an error in a `before` hook stops the change, and the editor sees an error message.
- Throwing in an `after` hook does not undo the change (it has already happened), but the editor still gets an error, and the work that would have come after your hook is skipped. That includes the CMS's own follow-up work, like starting workflows, sending webhooks and clearing the cache. So always catch errors in `after` hooks, as the deploy example does.
- The CMS's own bookkeeping for a change (which images a document uses, open approval requests, and the menu entries, tags and home page setting of deleted documents) is done inside the save, before any `after` hook. A failing `after` hook cannot skip it.
- The order follows the priority, lower first; the default is 100: `onHook('content:afterPublish', handler, 50)`.
- Hooks on changes run in every process that changes content: the admin's process, and `manablox sync` when it writes templates. The public API never changes content, so they do not run there. Hooks on reading run there too.
- Hooks also run for changes made by workflows and API keys, not only by people in the admin. `context.actor` tells you who it was.
