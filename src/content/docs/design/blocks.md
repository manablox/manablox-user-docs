---
title: "Designing blocks"
description: "The block designer: arrange elements, choose which field each one shows, make variants, style them per screen size, preview with real content and fix warnings. Or let AI propose a design."
---

Pages are built from blocks, so the look of your blocks is most of the look of your site. The block designer decides how every block of one type looks, for example every teaser or every quote. Editors fill in the content; the design stays the same everywhere.

## Open the block designer

1. Click **Design** in the sidebar, then **Blocks**.
2. The list shows a card per block type with its number of fields and variants, and warnings such as "2 fields not shown".
3. Click **Edit design** on a block type.

You also get there from the content type builder (the **Design** link on a block type) and from the content editor (**Edit block design**).

The designer fills the whole window. The bar on top has the way **Back**, the name and status of the design, **Undo** and **Redo**, the **More actions** menu (the three dots) and **Publish**. Below it are three columns:

- **Left:** the **Variants** of this block, then **Layers**, the elements the block is made of. The **Add** button next to it opens the new elements you can place.
- **Middle:** the preview, showing one block with sample content. Above it you switch between **Desktop**, **Tablet** and **Mobile**, light and dark colors, and the zoom.
- **Right:** the settings of the selected element, on the tabs **Content**, **Style** and **Visibility**. With nothing selected it explains what each tab does. Below are **Preview content** and **Checks**.

A block type nobody has designed yet shows every field, top to bottom. Your first change turns that into a draft you can shape.

Short on room? The button next to **Back** hides the main menu of the admin; click it again to bring the menu back. The tips above the preview go away for good once you close them.

## Elements

A design is made of elements, placed inside each other like boxes. The **Add** menu groups them, each with a short description:

| Group | Elements |
| --- | --- |
| Content | **Heading**, **Text**, **Rich text**, **Image**, **Button**, **Link**, **Video**, **Icon**, **Embed** (YouTube, Vimeo, Google Maps, Spotify, SoundCloud) |
| Layout | **Stack** (items in a row or a column), **Grid**, **Section** (a full-width band), **Box**, **Spacer**, **Divider** |
| From your content | **Repeat** (one copy per item of a list), **Blocks**, **Block**, **Template** (blocks inside this block) |
| Form | **Form**, **Form field**, **Submit button**, **Form message**. See [Forms](./forms.md) |

To add an element, click **Add** and drag the element onto the preview, or click it to place it after the selected one. To put it inside a container instead, point at the container's row in **Layers** and click its **+** (next to the duplicate button): the element you pick goes in at the end. **Find an element** filters the list. An element you cannot use here is greyed out and says why, for example when no field fits it.

To change the order, drag rows on the **Layers** tab or elements on the preview. Hover **Keys** under the list for the keyboard help: double-click or `F2` renames, `Alt` plus the arrow keys moves and nests, `Ctrl+D` duplicates, `Del` deletes.

## Show a field in an element

Select an element and open the **Content** tab.

- **Shows** picks the field whose content the element displays, for example the teaser's headline. Choose **Nothing, use the text below** to type a fixed text instead, per language.
- Inside a **Repeat** over documents a field points at, for example the services of a service list, **Shows** also offers the fields of those documents: a service's summary or image, a customer's quote.
- **Format** turns a value into readable text: a date (**Date style**, **Show the time**), a number (**Decimals**, **Percent**, **Currency**, and **Thousands separator**, which you switch off for years), yes or no with your own words, a list with a **Separator**, or **Shortened text** with a maximum length.
- Other options depend on the element: the **Level** of a heading, the **Style** and **Address** of a button, the **Aspect ratio** and **Fit** of an image, **Show controls** or **Loop** for a video, and so on.

Because an element points at the field itself, renaming a field in the content type keeps the design working.

**Name in Layers**, at the end of the tab, gives the element a name of your own in the **Layers** list. Visitors never see it.

## Variants

A variant is another look for the same block type. A teaser could come as "Image left" and "Hero", and editors pick one per block.

- Open **Variants** at the top left. **Variant** picks which variant you edit. The default one is marked "(default)"; blocks use it unless an editor picks another.
- **Add** makes a new variant: **From the fields**, one of the presets **Image left**, **Card**, **Hero** or **Centered**, or **Empty**.
- **Duplicate** copies the current variant, **Make default** makes it the default, **Delete** removes it (not the default one).
- **Start over** replaces the current variant with a new arrangement of the fields or a preset. Undo brings it back.

A block type can have up to 20 variants.

## Styles

Select an element and open the **Style** tab. The settings are grouped: **Spacing**, **Size**, **Layout**, **Text**, **Colors**, **Border and shadow** and **Effects**; the groups that matter most for the element are open first. Every choice is drawn the way it looks, and every value comes from the theme, so your design stays in line with it. A dot next to a setting means it is set on this element; the reset icon beside it goes back to the theme. Under **Colors**, a sample shows the text and background colors together; the three buttons on it switch between a transparent background and the theme's light or dark page, so you can check that the colors read well in both.

- **Spacing:** a box shows the element with its **Padding** (space inside its edge, green) and its **Margin** (space outside, orange). Click the number on a side and pick a step from the scale; at the top choose whether it applies to that side only, to both opposite sides, or to all sides. **Gap between children** sets the space between the elements inside.
- **Size:** **Maximum width** shows the theme's content widths as bars; pick one, **Full**, or **Type an exact width**. **Shape** sets the width to height ratio, for example 16:9 for a video.
- **Layout:** **Arrange content** puts the children **Stacked**, **In a row**, in a **Grid** or **Normal** (like text). For rows and stacks, click a dot in the **Position** square to place the children, or share out the free space; for grids, pick the number of **Columns**.
- **Text:** the **Size** tiles show each size of the theme, then **Font**, a **Weight** slider, **Alignment**, underline or strike through (**Line**) and **Letter case**.
- **Colors:** a sample shows the text color on the background as you pick them.
- **Border and shadow:** tiles draw each border width and style, the **Corners** and the **Shadow**.
- **Effects:** an **Opacity** slider.

A dashed frame marks the value an element gets from a larger screen or from the **Normal** state.

- **Per screen size:** switch the canvas to **Tablet** or **Mobile** and change a style there. It then applies to that screen size only; empty values follow the larger size.
- **Per state:** on desktop, pick **Hover**, **Focus** or **Pressed** to style what happens when a visitor points at, tabs to or clicks the element.
- **More settings** adds exact widths and heights, how the element aligns and grows inside its parent, italic text, and how a picture fills its frame.
- **Reset every style to the theme** removes the styles of the selected element for the current screen size or state.

You can also resize elements with the mouse on the canvas. They snap to the theme's widths and spacing steps; switch on **Free resize** above the preview for any size.

## Show or hide an element

On the **Visibility** tab:

- **Shown on**: untick **Desktop**, **Tablet** or **Mobile** to hide the element on that screen size.
- **Hide when empty**: hide the element while a field has no value, for example an image frame without an image.

## Preview with real content

Under **Preview content** on the right, choose what the block shows while you design. Nothing here is saved:

- **Sample text**: made-up text and a sample picture.
- **A real page**: click **Find a page**, then pick a page that uses this block. When a page has several of them, pick **Which block**.

## Checks

**Checks** on the right warns you about two things. Its title says **all good** or how many things to look at:

- **Not shown**: fields that have content nobody sees. Click a field to add an element for it, or leave it out on purpose.
- **Broken bindings**: an element shows a field the block type no longer has. Pick another field or remove the element.

When all is well it says "Every field is shown and nothing is broken."

## Start over and publish

- **Start over from the fields**, in the **More actions** menu (the three dots), replaces every variant with the design built from the fields. Undo brings it back.
- **Publish** makes this block design live. See [Publishing and preview links](./publishing.md).

## Let AI propose a design

With the AI plugin and an AI provider set up (see [AI](../admin/ai.md)), click **Design with AI** in the bar on top.

1. Under **How should the block look?**, describe it, for example "photo on the left, big headline, small grey date above it".
2. Click **Design**. A preview shows the proposal with sample content, and lists fields it does not show.
3. Click **Replace** to swap the current variant for it, or **Add as new variant**.

The proposal lands in your draft, so you can adjust it, undo it, and publish when it looks right.
