---
title: "Field types"
description: "The fifteen built-in field types in plain words: what each one holds, what editors see in the admin, which settings it has and what it is typically used for."
---

When you add a field to a content type, the first thing you choose is its **field type**. The field type decides what can go into the field (text, a number, an image, a list of blocks) and what editors see when they fill it in. Manablox comes with fifteen field types. This page describes each of them.

You add fields in the admin under **Content types**: open a type, click **Add field** and pick a field type from the list. How the builder works is explained in [Building content types](../admin/content-types.md). Developers can add their own field types too; see [Custom field types](../extending/custom-field-types.md).

## At a glance

The names below are the ones the **Add field** list shows.

| Field type | What editors see | Typical uses |
| --- | --- | --- |
| [Text](#text) | A one-line box, a bigger box, or a code box | Headlines, summaries, short labels |
| [Rich text](#rich-text) | A text editor with a toolbar | Article bodies, descriptions |
| [Number](#number) | A number box | Prices, quantities, ratings |
| [Boolean](#boolean) | A Yes/No switch | "Show on start page", "Sold out" |
| [Date](#date) | A date picker, with or without time | Event dates, publication dates |
| [Select](#select) | A dropdown, or buttons to tick several | Categories, colours, sizes |
| [Link](#link) | A choice between a document and a web address | Call-to-action buttons, "Read more" links |
| [Asset](#asset) | An image or file picker | Hero images, downloads, galleries |
| [Content reference](#content-reference) | A search to pick other documents | Related articles, the author of a post |
| [User reference](#user-reference) | A dropdown of the space's members | The person responsible for a page |
| [Block](#block) | One block with its own fields | A fixed hero section |
| [Blocks](#blocks) | A list or grid of blocks | Page builders: sections stacked freely |
| [Content template](#content-template) | A dropdown of templates | A shared footer or sign-up section |
| [Repeater](#repeater) | A list of items that all have the same fields | Quotes, team members, opening hours |
| [Databag type](#databag-type) | A dropdown of databag types | Which databag a form block stores its entries in |

## Settings every field has

Whatever its type, every field has these settings:

| Setting | What it does |
| --- | --- |
| Label | What editors see above the input. Can be changed at any time |
| Technical name | The name the website's code uses. Fills itself in from the label, and is locked once the type is saved |
| Required | The document cannot be saved while this field is empty. See [Required and unique](#required-and-unique) |
| Translated | The field keeps a separate value per language. Off means one value shared by all translations; see [Languages and translations](./localisation.md#translated-and-shared-fields) |
| Unique | No two documents of this type may hold the same value in this field. See [Required and unique](#required-and-unique) |
| Placement | **Main column** (with the title and the body) or **Sidebar** (beside it, for extra details) |
| Width | 25%, 50%, 75% or 100% of the column. Two 50% fields share a row |
| Placeholder | Grey example text shown in an empty input |
| Help text | A hint shown under the input |

The settings that belong to one field type are grouped under **Value** (what the field holds and how it is entered) and **Rules** (what a value must satisfy).

## Required and unique

Both switches are checked every time a document is saved, drafts included. If a field breaks one of them, nothing is saved and the field shows the reason: "This is required." or "Another document of this type already uses this value."

### What counts as empty

**Required** refuses an empty field. What empty means depends on the field type:

| Field type | Empty means |
| --- | --- |
| Text | Nothing, or only spaces |
| Rich text | No text, no image and no divider |
| Select | Nothing chosen |
| Asset, Content reference, User reference | Nothing picked. An automatic list is never empty |
| Blocks | No blocks |
| Repeater | No items |
| Date | No date |
| Number, Boolean, Link, Block, Content template, Databag type | No value at all, for example a cleared link, no block added or No template. `0` and No count as values |

### How unique works

**Unique** makes sure no two documents of the same content type in the same space hold the same value, for example an article number or a product code.

- It works for Text, Number and Date fields, and for Select, Asset, Content reference and User reference fields that allow only one choice. On other fields, and on the fields of a block type, the switch has no effect.
- Values must match exactly to clash: `Shoe` and `shoe` are different.
- Empty fields are never compared, so any number of documents may leave the field empty.
- A translated field is compared within one language: an English and a German document may share a value. A field that is not translated holds one value for every language, so it is compared across all of them.
- The translations of one document never clash with each other.
- Saving compares with the drafts of the other documents. Publishing compares with what the other documents have live. If publishing is refused, the message pops up instead of appearing on the field.
- A copy made with the duplicate button starts with the default values in its unique fields instead of the original's values. See [Editing content](../admin/editing-content.md#duplicating).

:::caution
A Number field starts at `0`, and `0` is a value. With **Unique** on, every document after the first needs its own number before it can be saved.
:::

## Text

Plain text without formatting. Editors see a normal text box.

| Setting | What it does |
| --- | --- |
| Input | **Single line**, **Multi-line** (a bigger box for a few sentences) or **Code** (a box in a fixed-width font, for snippets such as an embed code) |
| Default value | The text a new document starts with |
| Min length, Max length | How short or long the text may be. With a maximum, editors see a counter such as `12 / 80` |
| Must match (regex) | A pattern the whole text has to follow, for example an order number like `ABC-123`. Leave empty unless a developer gives you a pattern |

Typical uses: a headline, a short summary (Multi-line), a button label, an SEO description.

## Rich text

Formatted text: headings, bold and italic, lists and links. Editors see a text editor with a toolbar above it. The website receives the text in a structured form, not as a finished web page, so it can style it to match the design.

| Setting | What it does |
| --- | --- |
| Editing tools | Which buttons the toolbar offers. Click a tool to switch it on or off |

The available tools are Bold, Italic, Strikethrough, Code, Link, Heading, Bulleted list, Numbered list, Quote, Code block, Divider, Align left, Align centre and Align right. A new Rich text field starts with Bold, Italic, Link, Heading, Bulleted list and Numbered list.

Typical uses: the body of an article, a product description, the text inside a teaser block.

## Number

A number. Editors see a number box.

| Setting | What it does |
| --- | --- |
| Default value | The number a new document starts with |
| Whole numbers only | No decimals, for things you count |
| Minimum, Maximum | The allowed range |

Typical uses: a price, a quantity in stock, a rating from 1 to 5, the number of seats at an event.

## Boolean

A yes or no. Editors see a switch labelled **Yes** or **No**.

| Setting | What it does |
| --- | --- |
| On by default | New documents start with the switch on |

Typical uses: "Show on the start page", "Sold out", "Hide from search engines".

## Date

A date, or a date with a time. Editors see their browser's date picker.

| Setting | What it does |
| --- | --- |
| Precision | **Date only** or **Date and time** |
| Default to now | A new document starts with the current date (and time) filled in |

Typical uses: the date of an event, the day a blog post was written, an application deadline.

## Select

A choice from a fixed list of options. With one choice, editors see a dropdown (the `-` entry means "nothing chosen"). With several choices allowed, they see the options as buttons and click each one they want.

| Setting | What it does |
| --- | --- |
| Options | The choices, one per line, in the order they are offered |
| Allow several | Editors may pick more than one option |

Typical uses: a blog category, a colour, a clothing size, the layout variant of a block ("light" or "dark").

:::note
The website receives exactly the text of an option. If a developer's code checks for `news`, the option has to be written `news`, not `News`.
:::

## Link

One link, either to a document in the same space or to an address somewhere else. Editors first choose **A document** or **An address**. For a document they click **Pick a document** and search for it; for an address they type it, for example `https://example.com/page`. Below that they can choose **Same tab** or **New tab** and write an optional link text. **Clear the link** empties the field.

A link to a document keeps working when that document moves, because the website always gets the document's current address.

| Setting | What it does |
| --- | --- |
| A document in this space | Editors may link to a document |
| An address elsewhere | Editors may type a web address |
| Can link to | Limits document links to certain types, for example only Pages. Empty means any type |
| Let the editor choose the tab | Shows the Same tab / New tab choice |
| Opens in | **The same tab** or **A new tab**: the default, and the only choice when editors may not choose |
| Let the editor write the link text | Shows the link text box |

An address typed without `https://` gets it added. Addresses that would run code when clicked (such as `javascript:`) are refused when you save; `mailto:` and `tel:` links are fine.

Typical uses: a call-to-action button in a teaser, a "Read more" link, a link to a partner's website.

## Asset

An uploaded image or file from the space's library. Editors click **Choose asset** and pick from the library. The library window can also upload a new file, which is then picked straight away. A chosen image shows as a thumbnail with a small x to remove it; **Replace** swaps it. If the space has AI set up, **Generate an image** or **Generate a video** can appear as well; see [AI](../admin/ai.md).

| Setting | What it does |
| --- | --- |
| Accepted file types | Which kinds of file the picker offers, for example only images. Empty means everything the space accepts |
| Allow several | Editors may pick more than one file |
| Which files | With several allowed: **The ones an editor picks**, or **Whatever matches a filter** (see [Automatic lists](#automatic-lists)) |
| Renditions delivered, Sizes of its own | Only for image-only fields: which resized versions of the image the website receives. Leave them to your developer |

With several allowed, change the order by dragging a thumbnail onto the left or right half of another, or with the arrow buttons on each thumbnail; the website receives the files in that order.

Typical uses: the hero image of a page, a PDF download, a photo gallery (with **Allow several**). Uploading and managing files is explained in [Images and files](../admin/assets.md).

## Content reference

A pointer to one or more other documents in the space. Editors click **Link content**, type in the search box and click a document to add it. Each linked document shows as a row with a small x to remove it. With several linked, drag a row by its handle or use the up and down arrows to change the order; the website receives them in that order.

| Setting | What it does |
| --- | --- |
| Can link to | Limits the choice to certain document types, for example only Team members |
| Allow several | Editors may link more than one document |
| Which documents | With several allowed: **The ones an editor picks**, or **Whatever matches a filter** (see [Automatic lists](#automatic-lists)) |

The website only sees linked documents that are published.

Typical uses: "Related articles" under a blog post, the author of a post (pointing at a Person document), the products shown in a campaign.

## User reference

A pointer to a person who works in the space. Editors see a dropdown of the space's members, with **Nobody** for an empty field.

| Setting | What it does |
| --- | --- |
| Allow several | Editors may pick more than one person |

With several allowed, each person shows as a row with a small x to remove them, and **Add a person** adds another. Drag a row by its handle or use the up and down arrows to change the order.

Typical uses: the person responsible for a page, a contact person on a job offer.

## Block

Exactly one block of one block type, with that block's fields shown right inside the document. An empty field shows a button **Add** followed by the block's name, for example **Add Hero**; the trash button removes the block again.

| Setting | What it does |
| --- | --- |
| Block type | The one block type this field holds |

Typical uses: a fixed hero section at the top of every landing page, an optional newsletter box. Build the block type first; see [Building content types](../admin/content-types.md).

## Blocks

A list of blocks that editors assemble freely: the page builder. Editors click **Add block** (or **Add** followed by the block's name when only one type is allowed), fill in the block's fields, and reorder blocks by dragging them or with the move up and move down buttons. Under **Layout** they can switch from a simple list to a grid with columns. The details are in [Editing content](../admin/editing-content.md#blocks).

| Setting | What it does |
| --- | --- |
| Allowed block types | Which block types editors can add. Pick at least one, or editors see "No block types configured for this field." |
| At least, At most | How many blocks the list must and may hold |

Typical uses: the sections of a landing page, the content of a blog post built from text, image and quote blocks.

## Repeater

A list of items where every item has the same small set of fields. You define those fields (the **sub-fields**) right on the repeater, so you do not need to build a block type first. For example, a "Quotes" repeater could have the sub-fields Quote (text, required), Author (text) and Photo (asset). In the document, editors add as many items as they need, fill in each one, and can remove items, change their order and collapse them to keep the page tidy.

| Setting | What it does |
| --- | --- |
| Fields in each item | The sub-fields every item has. You add them like normal fields, in a small field list inside the repeater's settings. A sub-field can be of any type, even another repeater |
| At least, At most | How many items the list must and may hold |

A few things to know:

- **Required** on the repeater means at least one item. **Required** on a sub-field means that field must be filled in in every item.
- Sub-fields cannot be translated on their own. To have separate items per language, switch **Translated** on for the whole repeater.
- A repeater can hold another repeater, but not a third one inside that.
- A copy made with the duplicate button gets its own copies of the items.

Typical uses: customer quotes, the members of a team, opening hours, the questions of an FAQ.

## Content template

A pointer to a template: a block list written once under **Templates** and used by many documents. Editors pick a template from a dropdown (or **No template**). Under the dropdown a link **Edit** opens the chosen template; it says "not published yet" when the template has never been published.

| Setting | What it does |
| --- | --- |
| Offer these templates | Which templates editors can pick. Empty means every template in the space |

The website receives the template's blocks as if they were written in the document itself. A template that is not published delivers no blocks.

Typical uses: a standard footer section, a sign-up box that should look the same on every product page.

## Databag type

A choice of one of the space's databag types. Editors pick it from a dropdown (or **No databag type**). Under the dropdown a link opens the fields of the chosen type.

| Setting | What it does |
| --- | --- |
| Offer these databag types | Which databag types editors can pick. Empty means every databag type in the space |

On a designed site, a form bound to this field stores what visitors send in the picked databag type and asks for all of its fields. The **Form** block starting point uses it; see [Forms](../design/forms.md#a-form-block-editors-point-at-a-databag).

## Automatic lists

An Asset or Content reference field that allows several items can fill itself. Set **Which files** or **Which documents** to **Whatever matches a filter**, and the field no longer stores a hand-picked list. Instead the website gets whatever matches the filter at the moment it asks, so the list is never out of date. Editors see the current matches in the document, but cannot change them there: the filter belongs to the content type.

| Setting | What it does |
| --- | --- |
| Matching this text | Only items that contain this text. Empty means everything the other settings allow |
| Only below this document | Content reference only: only documents under this one in the tree |
| Ordered by | Content reference only: their place in the tree, title, when they went live, when they were created, when they were last edited, or slug |
| Direction | **First to last** or **Last to first** |
| How many | How many items, up to 100 |
| Skipping the first | Leaves out the first items, for example to show "the next 10" in a second field |

Example: a "Latest news" field on the home page, set to documents of type Blog post, ordered by when they went live, last to first, 3 items. The home page then always shows the three newest posts without anybody touching it.
