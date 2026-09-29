---
title: "Colors, fonts and spacing"
description: "Set up the theme of a designed site: colors with a contrast check, fonts from the built-in set, your own files or Google Fonts, text sizes, spacing and the look of buttons, links and forms. Or let AI suggest a theme."
---

The theme is the style of the whole site. Every block, page and menu takes its colors, fonts and spacing from it, so changing one color in the theme changes it everywhere at once.

Click **Design** in the sidebar, then **Theme**. The preview on the right shows a **Style guide**: headings, text, buttons, links, a sample form (labels, text fields, a dropdown, a text area, a checkbox, help text, the send button and the thank-you message), colors, spacing, corners and shadows in the current theme. It updates as you change things.

The settings are on five tabs: **Colors**, **Fonts**, **Text**, **Spacing** and **Elements**; each starts with a sentence on what it controls. Changes save as a draft by themselves. **Publish** in the bar on top makes the theme live (see [Publishing and preview links](./publishing.md)).

## Colors

Under **Roles** you pick a color for each job on the site:

| Role | Used for |
| --- | --- |
| **Background** | The page behind everything |
| **Surface** | Cards, bands and panels |
| **Text** | Body text |
| **Muted** | Captions and secondary text |
| **Primary** | Links, buttons and highlights |
| **On primary** | Text on primary buttons |
| **Border** | Lines and outlines |
| **Accent** | A second highlight color |

**Contrast** below checks that text stays readable on its background: text on the background and on surfaces, muted text, links, and button text on the primary color. A pair marked **low** is hard to read for many people; pick a darker or lighter color until it says **ok**.

**Palette** holds extra named colors. Click **Add color** to add one; the designers then offer it next to the roles.

**Dark color scheme** gives visitors whose device is set to dark mode their own set of role colors. Switch it on, then use the **Light** and **Dark** toggle to edit each set. A dark role you leave empty keeps its light color.

## Fonts

A theme has three font roles: **Body** (running text, buttons and forms), **Headings** (h1 to h6) and **Monospace** (code). Pick a font family for each.

Click **Add font** to add a family. There are three ways:

### A built-in font

Pick one of the ten fonts under **Built in**: sans-serifs (**Inter**, **DM Sans**, **Plus Jakarta Sans**, **Outfit**, **Space Grotesk**, **Bricolage Grotesque**), serifs (**Source Serif 4**, **Lora**, **Fraunces**) or **JetBrains Mono** for code. They are ready at once and free to use.

### A font from Google Fonts

1. Click **Add font**, then **From Google Fonts...**.
2. In **Font family**, type the name exactly as fonts.google.com shows it, for example `Playfair Display`.
3. Under **Weights**, tick the weights you need (400 and 700 are ticked already). Tick **Italic styles too** for italics. You can pick at most 18 styles.
4. Click **Download and add**.

Manablox copies the font files into the space's assets once. Visitors never load anything from Google, which is good for their privacy and for speed.

### Your own font file

1. Click **Add font**, then **Upload a woff2 file...**.
2. Choose the **Font file**: a `.woff2` file. Upload one file per weight and style.
3. Type the **Family name**, for example `Acme Sans`, and choose the **Weight** and **Style** of this file.
4. Click **Upload**. Repeat for the other weights of the same family.

:::note
If the upload is refused, your installation does not allow font files yet. Ask whoever runs it to add `font/woff2` to `ALLOWED_MIME_TYPES`; see [Uploads and images](../your-project/storage-and-media.md#what-may-be-uploaded).
:::

Each family also has a **Fallback**: the fonts a browser uses while yours loads. A family that a role still uses cannot be removed; pick another font for that role first.

## Text

**Type scale** is the list of text sizes the site uses, from `xs` to `4xl`. For each step you set the **Size**, a smaller **Mobile** size for phones (below 640 pixels), the **Line** height, the **Weight** and the letter spacing (**Tracking**).

**Headings and body text** decides, for each heading level from h1 to h6 and for body text, which size step, which font (**Heading font**, **Body font** or **Monospace**), which color and which case (**As typed**, **Uppercase**, **Lowercase**, **Capitalize**) it uses.

## Spacing

- **Spacing**: the steps paddings, margins and gaps pick from. Click **Add step** for another.
- **Corner radius**: how round corners are, from sharp to fully round.
- **Shadows**: soft to strong drop shadows.
- **Container widths**: how wide content may get. **Default width** is the one sections use unless they pick another, and **Side padding** is the space between content and the screen edge on narrow screens.

Designs only ever pick from these lists. That is why a site stays consistent, and why one change here restyles every page.

## Elements

Pick an **Element** to give it a base style that every design starts from: **Page body**, **Links**, **All buttons**, **Primary button**, **Secondary button**, **Ghost button**, **Form inputs**, **Form labels** and **Rich text**. The style settings work like those of the block designer; see [Styles](./blocks.md#styles).

## Let AI suggest a theme

When the CMS includes the AI plugin and the space has an AI provider (see [AI](../admin/ai.md)), click **Design with AI** in the header.

1. Under **What should the site feel like?**, describe the mood, for example "a friendly bakery, warm and handmade".
2. Optionally pick a **Brand color**; the palette is built around it.
3. Click **Design**. A preview card and the proposed colors appear. It tells you whether every text and background pair is readable.
4. Click **Again** for another proposal, or **Apply to the draft** to use it.

AI proposes colors, fonts, text sizes, corners and shadows; your spacing and element styles stay. Applying only changes the draft, so **Undo** brings the old theme back.
