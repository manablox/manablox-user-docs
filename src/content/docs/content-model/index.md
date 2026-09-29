---
title: "How content is organised"
description: "Spaces, content types, blocks, fields, the content tree, folders and templates: what each one is, how they fit together and where you find them in the admin."
---

Manablox does not store "pages" the way a word processor stores files. It stores structured content: every piece of content has a type, every type is a list of fields, and pieces can be nested inside each other. This page explains those building blocks one by one, with a small company website as the example. Once you know them, every screen in the admin makes sense.

If a word here is new to you, the [Key ideas](../concepts.md) page explains it in a sentence or two.

## The big picture

Here is how a company website with a few pages and a blog could look inside Manablox:

```
Manablox (your instance)
`-- space "Website"
    |-- content types     Page, Blog post, Teaser (a block), ...
    |-- content tree
    |   |-- Home          address: /  (the home page)
    |   |-- About         address: /about
    |   |   `-- Team      address: /about/team
    |   |-- Campaigns     a folder, adds nothing to addresses
    |   |   `-- Spring    address: /spring
    |   `-- Blog          address: /blog
    |       `-- Hello     address: /blog/hello
    |-- templates         reusable lists of blocks
    |-- assets            uploaded images and files
    `-- menus             Main navigation, Footer, ...
```

The rest of this page walks through that picture from top to bottom.

## Spaces

A **space** is one website or channel. It has its own content tree, its own content types, its own languages, images, menus and members. Two spaces never see each other's content. Most companies start with one space; a second one makes sense for a separate app or a second brand.

You pick the space you are working in with the space switcher at the top of the admin's sidebar. Creating spaces and deciding who works in them is explained in [Spaces and members](../admin/spaces.md).

## Content types

A **content type** describes one kind of content: what fields it has and how it behaves. You build content types in the admin under **Content types** (see [Building content types](../admin/content-types.md)), or a developer writes them in code (see [Content types in code](../your-project/content-types-in-code.md)). Both kinds of type work the same way. A type that comes from code shows a **code** badge in the admin and cannot be edited there.

There are two kinds of content type:

| Kind | What it is for | Examples |
| --- | --- | --- |
| Document type | Things that stand on their own. They sit in the content tree and usually have a web address | A page, a blog post, a product, a job offer |
| Block type | Small building pieces that only ever live inside a document | A teaser, a photo gallery, a quote, a call to action |

A document type has a few switches that decide how its documents behave. You find them on the **Behaviour** card when you edit the type:

| Switch | When it is on |
| --- | --- |
| Has a slug and permalink | Each document gets a web address. Switch it off for things that are not pages, such as a container that only groups other documents |
| Publishable | Documents have a draft and a live version, and a **Publish** button. A document that is never published is never shown on the website |
| Visible in the content tree | Documents appear in the tree on the Content page, and the **New** menus offer the type |
| Can appear in menus | Documents can be added to a navigation menu |
| Needs approval before publishing | Someone who may write but not publish this type has to ask for approval first. Only available when the type is publishable. See [Notifications and approvals](../admin/notifications.md) |

A block type has none of these switches. It has no address and is never published on its own: it goes live together with the document it sits in.

:::caution
The admin's **New** menus only offer types that are visible in the content tree. Switch **Visible in the content tree** off only for content that is created some other way, for example by a workflow or an import.
:::

## Fields

A **field** is one slot in a content type: "Summary", "Price", "Photo", "Publish date". Every field has a **field type** that decides what can go in it and what the editor sees: a text box, a rich text editor, a date picker, an image picker, and so on. All field types are described in [Field types](./field-types.md).

Each field has two names:

- The **label** is what editors see above the input, for example "Summary". You can change it at any time.
- The **technical name** is what the website's code uses, for example `summary`. It fills itself in from the label and is locked once the type is saved, because websites depend on it.

Every document also has a few **built-in fields** that you never add yourself. The most important ones are the **Title** and, for types with a web address, the **Slug**. The builder lists all of them in its **Built-in fields** panel.

## Blocks

Blocks are how editors build flexible pages. Instead of one big text field, a page type gets a **Blocks** field, and the editor stacks blocks in it: a teaser, then a gallery, then a quote, in any order. Each block has its own small set of fields.

A block can even hold blocks of its own. A "Two columns" block could have a Blocks field for each column.

A Blocks field can also lay its blocks out on a grid, for example three columns on a desktop and one on a phone. How editors work with blocks is shown in [Editing content](../admin/editing-content.md#blocks).

## The content tree

Every document of a document type lives in the **content tree**, which you see on the left of the **Content** page. The tree works like folders on your computer: a document can have a parent and children, and the order among siblings is kept. You move documents by dragging them.

### Slugs and addresses

The **slug** is the last part of a document's web address, for example `team`. Manablox builds the full address, called the **permalink**, by joining the slugs of all parents: the "Team" page under "About" is at `about/team`. Move a page and its address, and the address of everything below it, changes with it.

Two rules keep addresses unique:

- Two documents with the same parent cannot have the same slug.
- A permalink exists only once per language in a space.

When you create a document, the slug fills itself in from the title. It stops following the title as soon as you type a slug yourself, and it never changes on its own for a document that already exists, so retitling a live page does not move it to a new address.

### The home page

One document in a space can be the **home page**. It is marked with a star in the tree, and the website gets it for the address `/`. Click the star on a row (with a mouse, it appears when you hover over the row) to make it the home page. Only people who may change the space's settings can do this.

## Folders

A **folder** groups documents in the tree and does nothing else. It has no address of its own, so it adds nothing to the addresses of what it holds: a page in a "Campaigns" folder is at `spring`, not `campaigns/spring`. A folder is never published and never appears in a menu.

You create a folder with **New folder** in the `+` menu at the top of the tree, or in the `+` menu on a row to put it inside that row. A folder is created in every language of the space at once, so the tree has the same shape in each language.

## Templates

A **template** is a list of blocks you write once and use on many documents, for example a standard footer section or a sign-up box. A document type gets a **Content template** field, and editors pick a template in it. Change the template, and every document that uses it changes too.

Templates are not in the content tree. You find them under **Templates** in the sidebar, and you edit and publish them like a page. Until a template is published, the documents using it show an empty block list on the website.

## Languages

A space lists the languages it is written in. Each document exists once per language, and each translation has its own title, slug and publishing state. See [Languages and translations](./localisation.md).

## Drafts and publishing

Saving a document changes only its draft. The website sees nothing until you publish. Every save is also kept as a version you can go back to. See [Drafts, publishing and versions](./publishing.md).

## Images, files and menus

Two more things belong to a space but are not documents:

- **Assets** are the images and files you upload. Fields of type Asset point at them. See [Images and files](../admin/assets.md).
- **Menus** are named navigations, such as "Main navigation" or "Footer", built from documents and links. See [Menus](../admin/menus.md).

## Next steps

- Look at the building materials in detail: [Field types](./field-types.md).
- Build your own types: [Building content types](../admin/content-types.md).
- Start writing: [Editing content](../admin/editing-content.md).
