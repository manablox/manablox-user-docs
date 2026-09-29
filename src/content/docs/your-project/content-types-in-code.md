---
title: "Content types in code"
description: "Defining content types and block types in content-model.ts instead of the admin: when that is the better choice, a complete example, and what you see in the admin afterwards."
---

A [content type](../concepts.md#content-type) describes one kind of content, such as a page or a blog post, and the fields it has. You can build content types by clicking in the admin, or write them down in `content-model.ts`. Both end up as the same thing: editors fill them in the same way, and your website reads them through the same API.

This page shows how to write them in code.

## Code or admin?

| | Built in the admin | Written in `content-model.ts` |
| --- | --- | --- |
| Who changes it | Anyone with the right role, at any time | A developer, by editing the file |
| Where it is stored | In the database, in one space | In your project files, in Git |
| Which spaces have it | The one space it was built in | Every space (unless you limit it) |
| Can editors change it | Yes | No, the admin shows it read-only |
| Reaches the server | Immediately | With your next deploy |

Rules of thumb:

- Use the admin while you are exploring, and for types editors should be able to adapt without a developer. See [Building content types](../admin/content-types.md).
- Use code for the types your website's code depends on. If a component expects a `headline` field, nobody should be able to rename it with a click. Code is also reviewed and versioned with the rest of your project, and the same types arrive on every installation.

You can mix both: some types in code, others in the admin.

## Where it goes

A new project has an empty `content-model.ts`:

```ts
import type { ManabloxConfig } from '@manablox/core';
import { manabloxFields } from '@manablox/fields';

export const plugins: NonNullable<ManabloxConfig['plugins']> = [manabloxFields()];

export const contentTypes: NonNullable<ManabloxConfig['contentTypes']> = [];
```

`plugins` lists the plugins of your CMS. `manabloxFields()` is the one that provides the built-in field types (text, rich text, images, and so on); leave it in. `contentTypes` is the list you fill. Both config files import this file, so the admin and the public API always know the same types.

## A complete example

This example defines two types for a company website:

- `teaser`, a block type: a small, reusable piece (headline, text, image, link) that editors can place inside a page as often as they like,
- `page`, a content type: pages with their own address, a summary, a header image and a list of teaser blocks.

Replace the whole content of `content-model.ts` with this:

```ts
import { defineContentType, type ManabloxConfig } from '@manablox/core';
import { manabloxFields } from '@manablox/fields';

export const plugins: NonNullable<ManabloxConfig['plugins']> = [manabloxFields()];

// A block type: a reusable piece that editors place inside a page.
const teaser = defineContentType({
  name: 'teaser',
  label: 'Teaser',
  kind: 'block',
  icon: 'layout-grid',
  fields: [
    { name: 'headline', type: 'string', required: true, settings: { max: 80 } },
    { name: 'text', type: 'richtext' },
    { name: 'image', type: 'asset', settings: { accept: ['image/'] } },
    { name: 'link', type: 'link' },
    {
      name: 'style',
      type: 'select',
      settings: {
        options: [
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ],
        default: 'light',
      },
    },
  ],
});

// A content type: pages with their own address on the website.
const page = defineContentType({
  name: 'page',
  label: 'Page',
  icon: 'doc',
  fields: [
    {
      name: 'summary',
      type: 'string',
      localized: true,
      settings: { editor: 'textarea', max: 300 },
      admin: { help: 'One or two sentences for search results and link previews.' },
    },
    { name: 'hero', type: 'asset', settings: { accept: ['image/'] } },
    {
      name: 'components',
      label: 'Page content',
      type: 'blocks',
      settings: { types: [teaser.id] },
    },
    {
      name: 'meta_title',
      label: 'Title for search engines',
      type: 'string',
      settings: { max: 60 },
      admin: { zone: 'sidebar' },
    },
  ],
});

export const contentTypes: NonNullable<ManabloxConfig['contentTypes']> = [teaser, page];
```

What the pieces mean:

- `defineContentType({ ... })` describes one type. `name` is its technical name; `label` is what editors see.
- `kind: 'block'` makes `teaser` a block type. Without it, a type is a normal content type that lives in the content tree.
- Each entry in `fields` is one field. `type` says which kind of field it is, `settings` configures it. The field types and their settings are described in [Field types](../content-model/field-types.md).
- `required: true` means the document cannot be saved while the field is empty (blank text counts as empty).
- `localized: true` gives each language its own value. Without it, all translations share one value. See [Languages and translations](../content-model/localisation.md).
- `settings: { types: [teaser.id] }` on the blocks field says which block types editors may add there. It takes the type's id, which is why `teaser` is defined first and given a name (`const teaser`).
- `admin: { zone: 'sidebar' }` puts a field in the right-hand column of the editor, `admin: { help: '...' }` shows a hint under it.

Every document also gets the built-in fields (title, slug, permalink, status, dates and a few more) automatically. Do not add fields with those names.

## Seeing it in the admin

Save the file. What happens next depends on how the CMS runs:

- With `pnpm dev`, the CMS notices the change and restarts by itself. Watch the terminal: after a few seconds it says `manablox listening` again.
- With `pnpm start`, press Ctrl+C and run `pnpm start` again.
- In a `docker` project, rebuild and restart: `docker compose build` and then `docker compose up -d`.

No `pnpm migrate` is needed; content types never need one. If the terminal shows an error instead, read it: it names the type and field that has a problem. `pnpm typecheck` finds most typos before you even restart.

Then reload the admin in your browser:

1. Open Content types in the sidebar. `Page` and `Teaser` are in the list, each with a small "code" badge.
2. Click `Page`. The editor shows its fields with a "read only" badge: types from code can only be changed in code.
3. Open Content and create a new document. `Page` is offered as a type. The editor shows Summary, Hero, Page content (where Teaser blocks can be added) and, in the sidebar, Title for search engines.

Types from code are available in every space, including spaces created later.

## Other options

Some options you may want on a type, all optional:

| Option | Default | What it does |
| --- | --- | --- |
| `description` | none | A short explanation shown in the admin |
| `icon` | a page or block symbol | The symbol the admin shows for the type. Use a name the admin's icon picker offers, such as `doc`, `folder`, `book-open`, `calendar-days`, `map-pin` or `shopping-bag` |
| `hasSlug` | `true` | Documents get a slug and a web address. Turn it off for things that are not pages, like a list of team members |
| `isPublishable` | `true` | Documents have a draft and a published version. Turned off, they are live as soon as they are saved |
| `isVisibleInTree` | `true` | Documents appear in the content tree and can be created from there |
| `canBeVisibleInMenu` | `true` | Documents can be added to a [menu](../admin/menus.md) |
| `requiresApproval` | `false` | Changes need approval before they go live. See [Notifications and approvals](../admin/notifications.md) |

A block type may not set any of the last five; the CMS refuses to start if it does.

Some options on a field:

| Option | Default | What it does |
| --- | --- | --- |
| `label` | made from `name` | What the editor sees |
| `required` | `false` | A value must be filled in. See [Required and unique](../content-model/field-types.md#required-and-unique) |
| `localized` | `false` | Each language keeps its own value |
| `unique` | `false` | No two documents of the type may hold the same value. See [Required and unique](../content-model/field-types.md#required-and-unique) |
| `admin.zone` | `main` | `main` or `sidebar`: which column of the editor |
| `admin.width` | `100` | How much of the column the field takes, in percent. Two fields at `50` sit side by side |
| `admin.help` | none | A hint shown under the field |
| `admin.placeholder` | none | Grey example text inside an empty input |

## Choosing names

`name` of a type and of each field must start with a lowercase letter and may contain lowercase letters and digits, with single `-` or `_` between words (`meta_title`, `blog-post`), at most 64 characters. Your website sees these names, and GraphQL turns a type name into a type (`page` becomes `Page`, `blog-post` becomes `BlogPost`).

Treat names as permanent. The type's id is made from its name, so renaming `page` to `site-page` in code creates a new, empty type, and existing documents no longer match it. Change `label` freely instead; it is only what editors see.

## From the admin to code

You do not have to type everything by hand. Build and try a type in the admin, then let the admin write the code: switch to the space, go to `Settings > Export and transfer`, open the card "Export as code" and click Download config. You get a file with `defineContentType` calls for the types built in that space, ready to move into `content-model.ts`. [Moving a space](../admin/transfer.md) explains the export and what to watch out for when you switch.

Workflows, webhooks and content templates can be written in code as well; see [Workflows and webhooks in code](./resources-in-code.md).
