---
title: "Building content types"
description: "Use the content type builder to create document and block types, pick an icon, set the switches, add and arrange fields, and change or delete a type later."
---

Before anyone can write a page, a blog post or a product, the space needs a **content type** that describes it: which fields it has and how it behaves. You build content types in the admin under **Content types**. This page walks through the builder. What the parts mean is explained in [How content is organised](../content-model/index.md), and every field type is described in [Field types](../content-model/field-types.md).

**Content types** appears in the sidebar for people who may create and edit content types: the owners and admins of the space, and roles your team gave that permission.

## The Content types page

The page shows two cards:

- **Document types**: things that stand on their own and sit in the content tree, such as pages and blog posts.
- **Block types**: pieces that editors stack inside a document's Blocks field, such as a teaser or a gallery.

Each card shows how many types exist and has a button to start a new one: **New document type** or **New block type**.

The side panel on the left lists the existing types, with a **Documents** and a **Blocks** tab. Click a type to open it. The `+` at the top of the panel starts a new type too.

A type with a **code** badge was written by a developer in the project's code. You can open it and look at it, but not change it here; see [Content types in code](../your-project/content-types-in-code.md).

If the space has AI set up, **Describe it** on each card and **Describe a content model** at the top design types from a few sentences you write. See [AI](./ai.md).

:::tip
Build block types first. A document type's Blocks field can only offer block types that already exist.
:::

## Creating a type

1. In the sidebar, click **Content types**.
2. Click **New document type** (or **New block type**).
3. Under **Start from**, keep **Blank** or pick a ready-made type (see below).
4. Type a **Label**, for example `Blog post`. The **Technical name** fills itself in as `blog-post`.
5. Optionally choose an **Icon** (see below).
6. For a document type, check the switches on the **Behaviour** card (see below).
7. Add or change fields with **Add field** (see below).
8. Click **Save** at the top right.

You should see the message `Saved "Blog post"`, and the type appears in the side panel. Documents of the new type can be created right away under **Content**.

## Ready-made types

A new type can start from one of these instead of a blank form. Picking one fills in the label, the icon and the fields; all of it can be changed before and after saving. A label you typed yourself is kept. If you already changed the fields, you are asked before they are replaced. A starting point is only offered while no type has its technical name yet, so once you saved a `hero` block, **Hero** is no longer listed. New databag types get their own starting points (see the table).

| Kind | Starting point | Fields |
| --- | --- | --- |
| Block | Hero | Headline, Subline, Content, Background image, Hero image |
| Block | Content | Headline, Subline, Content, Button (a link) |
| Block | Image | Image, Caption |
| Block | Gallery | Headline, Images |
| Block | Quote | Quote, Author, Role |
| Block | Call to action | Headline, Text, Button (a link) |
| Document | Page | Summary, Components (a Blocks field) |
| Document | Article | Date, Image, Summary, Body |
| Document | Event | Starts, Ends, Location, Image, Summary, Body |
| Databag | Contact submission | Name, Email, Phone, Message, Consent. Not publishable, so the entries stay in the admin and workflows |
| Databag | Newsletter subscriber | Email, Name, Confirmed. Not publishable |
| Databag | FAQ | Question, Answer |
| Databag | Testimonial | Quote, Author, Role, Photo |
| Databag | Location | Address, Phone, Email, Opening hours, Image |

## The type itself

| Setting | What it is |
| --- | --- |
| Label | The type's name in the admin, for example in the **New** menus. Can be changed at any time |
| Icon | The symbol shown for the type in the tree, the lists, the **New** menus, the pickers and on blocks. Click it, filter the list and pick one. **Default** keeps a page icon for document types and a blocks icon for block types |
| Technical name | The name websites use to recognise the type. Fills itself in from the label, and is locked once the type is saved |

## The Behaviour card

On the right, the **Behaviour** card holds:

| Setting | What it does |
| --- | --- |
| Kind | **Content** (a document type) or **Block**. Fixed once the type is saved |
| Has a slug and permalink | Documents get a web address |
| Publishable | Documents have a draft and a live version, and a **Publish** button |
| Visible in the content tree | Documents appear in the content tree, and the **New** menus offer the type |
| Can appear in menus | Documents can be added to menus |
| Needs approval before publishing | People who may write but not publish this type have to ask for approval. Only available when **Publishable** is ticked; see [Notifications and approvals](./notifications.md) |

A block type has none of these switches. The card then only says that block types are embedded in another type's block field and have no address of their own.

What each switch means for editors and the website is explained in [How content is organised](../content-model/index.md#content-types).

## Built-in fields

Click **Built-in fields** to open a list of the fields every document of this type has without you adding them: `title`, and depending on the switches `slug`, `permalink`, `status`, `publishedAt` and a few more. The list changes as you tick and untick the switches. Do not add a field of your own with one of these names.

Block types have no built-in fields, so the panel is hidden for them.

## Adding fields

1. On the **Fields** card, click **Add field**. A list of field types opens: Text, Rich text, Number and so on. You can also press `Alt+N`, and then a number key to pick an entry.
2. Click a field type. The new field appears at the end of the list with its settings open.
3. Change the **Label**, for example to `Summary`. The **Technical name** follows it.
4. Set the field's options under **Value**, **Rules** and **In the editor**, and the switches **Required**, **Translated** and **Unique**.

Every setting is explained, field type by field type, in [Field types](../content-model/field-types.md). **Required** refuses a save while the field is empty, and **Unique** refuses a value another document of this type already holds; the exact rules are in [Required and unique](../content-model/field-types.md#required-and-unique). The settings under **In the editor** decide the layout of the document editor:

| Setting | What it does |
| --- | --- |
| Placement | **Main column** (with the title and the body) or **Sidebar** (beside it, for details such as a date or an image) |
| Width | 25%, 50%, 75% or 100% of the column. Two 50% fields share a row |
| Placeholder | Grey example text in an empty input |
| Help text | A hint shown under the input |

### Arranging fields

Each field is a row with its label, its technical name and its field type. On the row:

- click the label to open or close the field's settings,
- drag the row by its handle on the left to move it; a line shows where it will land,
- use the **Move up** and **Move down** arrows to move it one step,
- click the trash button (**Remove field**) to delete it.

The order here is the order in the document editor.

### Mistakes are marked

If a setting is wrong when you save, for example a Select field without options, nothing is saved. The field gets a red border and a warning sign, and the message is shown next to the setting. Fix it and save again.

## Changing a type that already has documents

You can keep working on a type after documents of it exist. A few things to know:

- **Adding a field** is always safe. Existing documents simply have it empty until someone fills it in.
- **Changing a label**, the icon or the editor layout is always safe.
- **Renaming a technical name** is not possible once the type is saved, because websites depend on it. To rename, remove the field and add a new one, and copy the content over by hand.
- **Removing a field** takes its content off the website at once. Earlier versions of the documents still hold it, but the field is gone from the editor.
- **Changing a field's rules**, for example making it required or unique, does not touch existing documents. The next time someone saves such a document, it has to meet the new rules.

Saved changes take effect immediately: editors and the website see the new fields on their next page load.

## Deleting a type

1. Open the type and click the trash button (**Delete content type**) at the top right.
2. The dialog **Delete this content type?** tells you what happens. Confirm with **Delete content type**.

A document type can only be deleted once no documents of it are left, in any language. Otherwise you see "Documents of this type still exist; delete them first." Delete those documents (in every language), then try again.

A block type can be deleted even while it is in use. Blocks of this type already placed in documents then show as unknown, and those documents cannot be saved until the blocks are removed. Check where the block is used before you delete it.

When a type is deleted, it also disappears from every role that granted permissions for it.

Types from code cannot be deleted here.
