---
title: "Editing content"
description: "Find your way around the content tree, create and move documents, fill in fields, build pages from blocks on a list or a grid, use templates and folders, and edit next to the live website."
---

Writing content happens under **Content** in the sidebar. On the left you see the content tree with every document of the space; on the right, the document you are working on. This page explains the tree, the editor and the page builder. What happens when you save and publish is explained in [Drafts, publishing and versions](../content-model/publishing.md).

## The Content page

Click **Content** in the sidebar. The tree appears in the side panel. As long as no document is open, the main area shows a big search box (**Search by title, text or tag...**), a **Tags** button beside it, and the hint "Pick a document from the tree".

- Type at least two letters into the search box to find documents by title, by their text or by a tag they carry, in the current language. Click a result to open it. Press `/` to jump into the box.
- **Tags** narrows the list to the tags you tick, with or without a search term. See [Tags](./tags.md).
- **New** at the top right opens the list of types you may create. Click one to start a new document at the top level of the tree.

The tree and the search show one language at a time: the one chosen with the **Language** switch in the top bar. See [Languages and translations](../content-model/localisation.md).

## The content tree

Each row in the tree is a document, with the icon of its type and its title. Click the arrow in front of a row to open or close the documents below it; click the title to open the document.

When you hover over a row with the mouse, or move to it with the keyboard, a few small buttons appear on its right. On a touch screen or a narrow window they are always shown:

| Button | What it does |
| --- | --- |
| Star (**Set as home page**) | Makes this document the home page. See below |
| Copy (**Duplicate this page**) | Makes a copy next to it. See [Duplicating](#duplicating) |
| Trash (**Delete this document**) | Deletes it, after asking. See [Deleting](#deleting) |
| `+` (**Add a child page**) | Starts a new document, or a folder, below this one |

A small green dot next to a title means the document is published.

The tree remembers which rows you opened, per space and language, and loads long lists bit by bit as you scroll. You can make the panel wider or narrower by dragging its right edge.

Documents of a type with **Visible in the content tree** switched off do not appear in the tree. You reach them through the fields that point at them.

### Searching the tree

Type in the **Search...** box at the top of the tree panel to find documents by a part of their title, their text or a tag. The tree then shows only the matching documents, in their place: the documents above them are listed in grey so you can see where each match lives, and the matching part of the title is highlighted. Click a match to open it. Clear the box to get the whole tree back.

The same tree, with the same search box, appears wherever the admin asks you to pick a document, for example for a link, a relation field, a redirect or a menu item. Open a row with its arrow and click the document you want. Documents that do not fit the field are shown in grey and cannot be picked. Databag entries are not in the tree, so a picker for them shows a searchable list instead.

### Moving documents

Drag a row by its title to a new place:

- drop it between two rows to change the order among siblings,
- drop it onto a row to put it below that document.

Everything below the moved document moves with it, and all their web addresses change to match the new place. Moving is saved straight away, without a **Save** click.

:::caution
Moving a published page changes its address on the website. Links from other websites to the old address stop working. Move live pages only when you mean to.
:::

### The home page

One document of the space can be the home page: the one the website shows at `/`. It is marked with a star in the tree.

To choose it, click the star on the document's row (**Set as home page**); with a mouse, it appears when you hover over the row. You should see the message "Set as the home page". Clicking the star of the current home page clears it again. Only people who may change the space's settings (owners and admins) see the clickable star; everyone else sees which page is the home page.

### Folders

A folder groups documents in the tree, for example all pages of a campaign. It does nothing else: it has no address, so pages inside it keep their short addresses, and it is never published.

1. Click the `+` at the top of the tree panel, or the `+` on a row to put the folder inside that row.
2. Click **New folder**.
3. Type a **Name**, for example `Campaigns`.
4. Click **Create folder**.

The folder is created in every language of the space at once. Drag documents into it like into any other row. A folder is renamed and deleted like a document.

## Creating a document

1. Click **New** on the Content page, or the `+` at the top of the tree, or the `+` on a row to create the document below that row.
2. Pick the type, for example **Page**.
3. Type a **Title**. For types with a web address, the **Slug** fills itself in from the title (`About us` becomes `about-us`). You can type your own slug instead.
4. Fill in the fields.
5. Click **Save** at the top right (or press `Ctrl+S`, `Cmd+S` on a Mac).

You should see a "Saved" note next to the title, and the document appears in the tree. The badge next to the title now says **draft**: saved, but not on the website yet. To put it online, click **Publish**.

## The document editor

### The header

The header runs along the top of the editor. On the left it shows the type (with its icon), the title and a status badge (see [Drafts, publishing and versions](../content-model/publishing.md#the-status-badge)). On the right are the buttons:

| Button | What it does |
| --- | --- |
| Undo, Redo | Step back and forward through your edits since the document was opened |
| **Generate** | Lets AI write the document. Only when the space has AI set up; see [AI](./ai.md) |
| **Visual** | Opens the visual editor. See [The visual editor](#the-visual-editor) |
| **History** | Shows the saved versions. See [Drafts, publishing and versions](../content-model/publishing.md#versions) |
| Language codes | The translations of this document. See [Languages and translations](../content-model/localisation.md#translating-a-document) |
| **Save** | Saves the draft. Only active when there are unsaved changes |
| **Publish** | Puts the current state on the website. Saves first if needed |
| **Unpublish** | Takes the document off the website, together with every page below it. They all go back to draft |
| **Schedule** | Publishes or unpublishes at a set time |
| Copy button | Duplicates the document |
| Trash button | Deletes the document |

**Publish**, **Unpublish** and **Schedule** only appear for people who may publish, and only on publishable types.

### The fields

Below the header, the first card holds the **Title** and, for types with a web address, the **Slug**. The slug of an existing document never changes by itself when you change the title, so a live page does not move to a new address by accident.

The fields of the type follow, arranged the way the type was built: most in the main column, some in the sidebar on the right. What each kind of field looks like is described in [Field types](../content-model/field-types.md). A field with a problem is marked in red when you save, with the reason under it, for example "This is required." for an empty required field or "Another document of this type already uses this value." for a unique field. If publishing is refused because another document already has a unique value live, the message pops up instead. See [Required and unique](../content-model/field-types.md#required-and-unique).

A refused save scrolls the first field with a problem into view and puts the cursor in it, so nothing hides below the fold. A block holding a bad field is outlined in red too, on the grid as well as in the list, which is how you find the problem when the block is closed.

The sidebar can also hold:

- **Approval**, for types that need approval before publishing; see [Notifications and approvals](./notifications.md),
- **Placement**: the document's **Position** among its siblings in the tree, and **In menus**, which lists the menus the document is in and opens a picker for putting it into menus; see [Menus](./menus.md),
- **Tags**: labels for the document, shared by all its translations, used to find it again and to build tag pages on the website; see [Tags](./tags.md),
- **History**, once you click **History** in the header.

## Blocks

A Blocks field is the page builder: you build a page from blocks such as teasers, galleries and quotes. A Blocks field works in two ways: as a simple list, which is how every field starts, or on a grid with columns.

### Blocks as a list

- Click **Add block** under the list and pick a block type. When the field allows only one type, the button says **Add** followed by the type's name and adds it straight away. You can also press `Alt+N`.
- A new block opens with its fields ready to fill in. Click a block's header to open or close it; closed, the header shows its type and a short summary.
- Drag a block by its header to move it, or use the **Move up** and **Move down** arrows.
- Click the trash button (**Delete block**) to remove a block.

A block can contain Blocks fields of its own, which work the same way.

### Blocks on a grid

A grid places blocks side by side, for example three teasers in a row on a desktop and one below the other on a phone.

1. Above the blocks, find the **Layout** bar. It says "Single column" while the field is a list.
2. Click **Use a grid**.
3. For **Desktop**, **Tablet** and **Mobile**, set **Cols** (columns, up to 12). **Rows** can stay empty (automatic) unless you want a fixed number. Tablet follows desktop and mobile uses one column, unless you set them.
4. Click **Done**.

The field now shows a **board**: a picture of the grid with a card for each block. The board replaces the list.

- **Add a block:** click an empty cell for a block of that size, or press and drag across several empty cells for a wider or taller block. If the field allows several block types, the dialog **Which block?** asks which one.
- **Edit a block:** click its card. Its fields open in a dialog, with a line saying where it sits. Click **Done** to close it, or **Delete** to remove the block.
- **Move a block:** drag its card to another place.
- **Resize a block:** drag one of its edges or corners. The mouse pointer changes to show which way it will resize.
- **Fine-tune a block:** select a card, then use the `-` and `+` buttons under the board for **Column**, **Row**, **Width** and **Height**.

The board shows one screen size at a time; switch between desktop, tablet and mobile with the switch above it. At first, tablet and mobile follow the desktop layout. As soon as you move a block at one size, that block gets its own place at that size. The button under the board (**Same as desktop** or **Let the grid place it**) hands a block back to the automatic placement.

**Show as a list** under the board brings back the list view, for example to reorder blocks or to read a long page from top to bottom. **Hide the list** removes it again. **Change grid** in the Layout bar changes the columns later.

:::note
A block that sticks out past the last column (or the last row, when you set a fixed number of rows) at any screen size cannot be saved. Make it smaller or move it first.
:::

## Templates

A **template** is a list of blocks written once and used on many documents, for example a standard sign-up section. Documents use it through a **Content template** field; see [Field types](../content-model/field-types.md#content-template).

Templates are not in the content tree. Click **Templates** in the sidebar: the templates are listed on the left.

1. Click **New template** (or press `n`).
2. Give it a title and add blocks, exactly like in a document.
3. Click **Save**, then **Publish**.

A template has to be published before a website sees it. Until then, documents using it show an empty block list. When you change a published template, save and publish it again, and every document that uses it shows the new version.

If the space has AI set up, **Describe a template** lays out a template from a few sentences; see [AI](./ai.md).

## The visual editor

The visual editor shows your website inside the admin while you edit, with your changes appearing as you type, even before you save.

Click **Visual** in the editor's header. The button appears on documents whose type has a web address and at least one Blocks or Block field. The visual editor opens full screen:

- In the middle, the website shows the document. Under the document's title in the top left, "Live preview connected" means the website is receiving your changes; "Waiting for the site..." means it has not answered yet.
- Above it, **Preview width** switches between a desktop, tablet and mobile width.
- On the right, you edit blocks and fields. Click a block in the preview to edit it there. **Add a block** adds blocks, and `Alt+N` adds one after the selected block.
- **Undo**, **Redo** and **Save** work as in the normal editor. **Close** (or the back arrow at the top left) returns to the document editor.

The visual editor needs two things: the space's **Frontend URL** must point at your website (it is called **Website address** under `Settings > General`; see [Spaces and members](./spaces.md)), and the website must have been built with a preview page. If the frame says "This space has no frontend URL configured.", ask an owner or admin to set it. If it stays on "Waiting for the site...", ask your developer; see [Preview and the visual editor](../website/preview.md).

## Duplicating

The copy button in the editor's header (**Duplicate document**), or the copy button on a row in the tree (**Duplicate this page**), makes a copy of the document next to the original. The copy has the same type, place and field values, "(copy)" after its title, and a free slug such as `about-copy`. Fields marked **Unique** are the exception: they start at their default value, so the copy does not clash with the original. The copy is always a **draft**, even when the original is live.

The copy is made from the last saved state. If you have unsaved changes, the admin asks first: **Duplicate anyway** copies without them.

If the document has others below it in the tree, the admin asks what the copy takes along: **This document only** leaves the children with the original, and **This document and everything beneath it** copies the whole branch, at any depth. Every copied child keeps its own title and slug, since nothing under the new parent clashes with it.

## Deleting

- **From the editor:** click the trash button (**Delete document**) and confirm with **Delete document**. The document is deleted together with every document below it in the tree.
- **From the tree:** click the trash button on the row. If the document has others below it, you choose: **Keep them, one level up** (they take its place in the tree) or **Delete them as well**. Then click **Delete**.

Deleting removes the document and its published copy from the admin and the website. It cannot be undone.
