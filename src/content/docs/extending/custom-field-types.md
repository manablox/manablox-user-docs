---
title: "Custom field types"
description: "Write a field type of your own, for example a colour field that only accepts hex codes, and add it to the admin's Add field menu with a plugin."
---

A **field type** decides what a field can hold and how it is checked: text, a number, a date, an image. Manablox brings a good set of them (see [Field types](../content-model/field-types.md)), and most projects never need more. When you want a field that follows your own rules, for example a colour that must be a hex code like `#ff6600`, you can write your own field type and add it with a [plugin](./plugins.md).

After that, your field type appears in the admin's **Add field** menu next to the built-in ones, the CMS checks every value against your rules, and websites can read it through the [REST](../website/rest.md) and [GraphQL](../website/graphql.md) APIs.

## Before you start

A field type describes its rules with a **schema**: a small object that says what a valid value looks like. Manablox accepts any schema library that follows the "Standard Schema" convention. This page uses Zod, the most common one. Install it in your project folder:

```sh
pnpm add zod
```

You should see `zod` appear under `dependencies` in `package.json`.

## A colour field

1. Create a file called `color-field.ts` next to `content-model.ts`:

```ts
import { defineFieldType, definePlugin } from '@manablox/core';
import { z } from 'zod';

// What an editor or developer can configure per field.
const colorSettings = z.object({
  allowAlpha: z.boolean().default(false),
});

type ColorSettings = z.infer<typeof colorSettings>;

export const colorField = defineFieldType<ColorSettings, string>({
  name: 'color',
  label: 'Colour',
  description: 'A colour as a hex code, like #ff6600.',

  settingsSchema: colorSettings,

  // What a valid value looks like, depending on the settings.
  valueSchema: (settings) =>
    z
      .string()
      .regex(
        settings.allowAlpha ? /^#[0-9a-f]{6}([0-9a-f]{2})?$/i : /^#[0-9a-f]{6}$/i,
        'Use a hex colour like #ff6600',
      ),

  // A new document starts with an empty field.
  defaultValue: () => null,

  storage: { kind: 'jsonb', index: 'btree' },
  filters: ['eq', 'neq', 'in', 'isNull', 'isNotNull'],
  graphql: { type: { kind: 'scalar', name: 'String' } },

  // Reuse the admin's built-in text box as the editor.
  admin: { input: 'string' },
});

export const colorPlugin = definePlugin({
  name: 'color-field',
  fieldTypes: [colorField],
});
```

2. Add the plugin to the `plugins` list in `content-model.ts`:

```ts
import type { ManabloxConfig } from '@manablox/core';
import { manabloxFields } from '@manablox/fields';
import { colorPlugin } from './color-field.ts';

export const plugins: NonNullable<ManabloxConfig['plugins']> = [manabloxFields(), colorPlugin];

export const contentTypes: NonNullable<ManabloxConfig['contentTypes']> = [];
```

3. Save. `pnpm dev` restarts by itself (start it if it is not running).
4. In the admin, open a content type and click **Add field**. The menu now lists **Colour** with its technical name `color`. Add it and save the content type.
5. Open a document of that type. The colour field is a text box. Type `red` and save: the field is marked with "Use a hex colour like #ff6600" and nothing is saved. Type `#ff6600` and the save goes through.

If **Colour** is missing from the menu, check the terminal: the line `manablox initialised` should list `color-field` among the plugins.

## The pieces

| Key | What it does |
| --- | --- |
| `name` | The technical name, used as `type` in a field. Lowercase letters, digits and `-`, starting with a letter. Must be unique. Never change it once content uses it |
| `label` | The name the **Add field** menu shows |
| `description` | An optional sentence about the field type |
| `settingsSchema` | The settings a field of this type can have, with their defaults. Checked when a content type is saved |
| `valueSchema(settings)` | The rules for a value, built from the field's settings. So `allowAlpha: true` on one field does not affect another. The message you give a rule is what the editor sees |
| `defaultValue(settings)` | What a new document starts with. `null` means empty, and an empty field is only an error when the field is marked required |
| `storage` | How the value is saved. `{ kind: 'jsonb', index: 'btree' }` works for simple values and needs no database change. `index` can also be `'gin'` or `false` |
| `filters` | The filter operators websites may use on this field, for example `eq` (equals) or `in` (one of). Anything not listed is refused with `query.operator.unsupported` |
| `graphql` | How the field looks in GraphQL: a scalar (`String`, `Int`, `Float`, `Boolean`, `DateTime`, `JSON`, `ID`), optionally with `list: true` for a list |
| `search(value)` | Optional. Text this field adds to the document's full-text search, or `null` |
| `references(value)` | Optional. Only for values that store ids of images, documents or users: returns them as `{ target, id }`, so Manablox knows which images are in use |
| `admin` | Which built-in editor the admin shows, below |

The possible filter operators are `eq`, `neq`, `lt`, `lte`, `gt`, `gte`, `in`, `notIn`, `contains`, `startsWith`, `endsWith`, `isNull` and `isNotNull`. List only the ones that make sense for your values.

## The editor in the admin

`admin.input` names the editor component the admin shows for your field. The admin that comes with your project is already built and cannot load new components (see [Plugins](./plugins.md#admin-screens)), so `admin.input` must name one of its built-in editors. The ones that suit your own field types:

| `admin.input` | What the editor shows | Settings it reads |
| --- | --- | --- |
| `string` | A text box | `editor` (`input`, `textarea` or `code`), `max` (shows a character counter) |
| `number` | A number box | `min`, `max`, `step`, `integer` |
| `boolean` | A switch | none |
| `date` | A date picker | `mode`, `min`, `max` |
| `select` | A dropdown | `options` (a list of `{ value, label }`), `multiple` |

The editor sends its value in the same shape as the built-in field type of that name: `string` sends text, `number` a number, `boolean` true or false. Pick the editor whose value your `valueSchema` expects.

If `admin.input` names an editor the admin does not have, the document editor shows "No editor registered for field type" instead of an input.

### Settings

When you add your field in the admin, the settings panel shows the general options every field has, but no controls for your own settings like `allowAlpha`. The field then gets the defaults from `settingsSchema`. To set them, declare the content type in code (see [Content types in code](../your-project/content-types-in-code.md)):

```ts
export const contentTypes: NonNullable<ManabloxConfig['contentTypes']> = [
  {
    name: 'product',
    label: 'Product',
    fields: [
      { name: 'name', type: 'string', required: true },
      { name: 'brand_colour', type: 'color', settings: { allowAlpha: true } },
    ],
  },
];
```

This `brand_colour` field accepts `#ff660080` (with transparency) as well as `#ff6600`.

## Keep it installed

Once a content type uses your field type, the plugin has to stay in the `plugins` list. If you remove it, the CMS refuses to start with `contentType.field.type.notFound` and names the content type and field. Put the plugin back, or first remove the field from the content type in the admin.

## Checklist

- `name` is final once content uses it.
- `defaultValue` is either `null` or a value that `valueSchema` accepts.
- Every rule in `valueSchema` has a message an editor understands.
- `filters` lists only operators that make sense for your values.
- A field type that stores ids of images or documents declares `references`.
- `admin.input` names a built-in editor that sends the kind of value you expect.
- On a server, rebuild after changes, as described in [Plugins](./plugins.md#plugins-on-the-server).
