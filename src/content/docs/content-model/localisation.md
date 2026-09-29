---
title: "Languages and translations"
description: "How a space chooses its languages, how you translate a document in the admin, which fields are translated and which are shared, and what the website sees when a translation is missing."
---

A website in several languages needs every page in every language, but some things, such as a product's price or a team member's photo, should be the same everywhere. Manablox handles both: each document exists once per language, and each field decides whether it is translated or shared.

## Languages belong to a space

Each space chooses its own languages. A company could run its website in English and German and a second space for an app in English only.

In Manablox a language is called a **locale** and is written as a short code: `en` for English, `de` for German, `pt-BR` for Brazilian Portuguese. You pick languages by name; the admin shows the codes.

One of the space's languages is the **default locale**. It is the language a website gets when it does not ask for a particular one. The settings show it as **Main language**; the **New space** dialog calls it **Default locale**.

### Choosing the languages

You need to be allowed to change the space's settings (owners and admins can).

1. Make sure you are working in the space (check the space switcher at the top of the sidebar).
2. In the sidebar, click **Settings**, then **General**.
3. Click the **Languages** card to open it. In the **Languages** field, type the name of a language into **Search languages...**, for example `German`.
4. Tick the language in the list. It appears above the list with its code; the small x next to it removes it again.
5. Under **Main language**, choose the main language. This is the default locale.
6. Click **Save changes** in the **Languages** card.

You should see the message "Languages saved". From now on the top bar shows a **Language** switch.

:::caution
Removing a language from a space does not delete the documents written in it, but the admin no longer offers that language, so you cannot switch to them any more. Remove a language only when you are sure.
:::

## Working in one language at a time

The admin always shows one language at a time. The **Language** switch in the top bar (it appears as soon as a space has more than one language) chooses which one. The content tree, the lists and the dashboard's **Recently updated** follow it. The dashboard's **Languages** card has the same switch.

When you switch to a language nobody has written in yet, the content tree is empty. That is expected: the documents exist only in the languages they were written or translated in.

## Translating a document

Each translation is a document of its own, linked to the others. You start one from the document editor.

1. Open the document in the language you wrote it in.
2. In the editor's header, find the row of language codes next to the globe icon. Existing translations are shown as normal buttons; a star after the code means that translation is published.
3. Click the dashed button for the language you want, for example **+ de**.

You should see the message "Started the de translation", and the editor opens the new German document. It starts as a copy: the same title, slug and field values, in the same place in the tree. Now translate the title and the texts, and save.

:::tip
Change the slug too, so the German page gets a German address: `about` can become `ueber-uns`. Each translation has its own address.
:::

To jump between translations, click their codes in the same row. The admin switches the whole screen to that language.

### What each translation has of its own

Because each translation is its own document, it also has its own:

- title and slug, and so its own web address,
- draft and published state: publishing the English page does not publish the German one,
- publish schedule,
- version history.

## Translated and shared fields

Every field of a content type is either **translated** or **shared**. This is the **Translated** switch in the field's settings when you build the type (see [Building content types](../admin/content-types.md)).

| Kind | What happens | Good for |
| --- | --- | --- |
| Translated | Each translation keeps its own value | Summaries, body texts, button labels, image captions |
| Shared (Translated off) | When you save one translation, the value is copied to all other translations | Prices, product numbers, photos, dates |

Shared is the default for a new field. So when you build a type for a multilingual site, tick **Translated** on every field that holds words.

Example: a product type has a translated **Description** and a shared **Price**. The marketing team translates the description into German. When someone later changes the price on the English product and saves, the German product has the new price too.

A **Unique** field follows the same split. A translated one must be unique among the documents of one language, a shared one across all languages. The translations of one document never clash with each other. See [Required and unique](./field-types.md#required-and-unique).

:::note
Titles and slugs are always per translation. They are not fields you can share.
:::

## Folders and menus in several languages

A new folder is created in every language of the space at once, so the tree has the same shape in each language.

A menu entry points at a document, not at one translation. The German menu shows the German titles and addresses, and leaves out any document that has no German translation. See [Menus](../admin/menus.md).

## What the website sees

A website always asks for content in one language. When it does not say which, it gets the space's default locale, shown as **Main language** under `Settings > General`.

There is no automatic fallback: if the German translation of a page does not exist, or is not published, the website finds nothing for that page in German. It does not show the English page instead. Check that every page you link to is translated and published in each language.

How a website asks for a language is explained for developers in [How a website gets content](../website/index.md).
