---
title: "Forms"
description: "Add a contact form or a sign-up form to a designed site. Visitors' entries are stored as databag records, where workflows can pick them up."
---

A form on a designed site stores what visitors send as a record in a **databag**: a flat list of entries outside the content tree, made for things like contact requests or newsletter sign-ups. You read the entries under **Databags** in the sidebar, and a [workflow](../admin/workflows.md) can send an email or a notification for each new one.

## Before you start

1. Create a databag type for the entries: click **Databag types** in the sidebar, then **New databag type**. It works like [building a content type](../admin/content-types.md). For example "Contact requests" with the fields name, email and message. Mark the fields visitors must fill in as required.
2. Make sure forms are switched on for your installation (see [Switch forms on](#switch-forms-on)). If they are not, the form's checks in the designer say so.

## Add a form

Forms can go into a block, a page design or a layout.

1. Open the designer, for example a block type "Contact" under **Design > Blocks**.
2. Click **Add** above the layers, then **Form** in the **Form** group.
3. On the right, under **Stores entries in**, pick the databag type.

Manablox adds one input per field, a **Submit button** and a **Form message** for the thank-you or error text.

## Form blocks

A form can also live in a block type, so editors place it on any page like other blocks. When you create a block type under **Content types**, two starting points build one for you.

### A form for one databag

Pick **Form for one databag** under **Start from**, then the databag type under **The form stores entries in**, and save. The block gets a headline, a text and a design with a form that asks for every field of that databag type. The design is published right away when you may publish designs; otherwise it waits as a draft under **Design > Blocks**. Its inputs can be changed like any other form's.

### A form block editors point at a databag

Pick **Form** under **Start from** and save. The block gets a headline, a text and a **Databag** field of the type **Databag type**. Editors pick the databag type on every block they add, so one block type serves the contact form, the newsletter sign-up and any other form.

Its form asks for every field of the picked databag type, in the order of the type's fields, labelled with the fields' labels. In the block designer the form shows one input: it stands for all of them, so its style applies to every input. Nothing shows on the site until an editor picks a databag type.

Any form in a design can work this way: add a field of the type **Databag type** to the block or content type, select the form and pick **Picked by editors in the "Databag" field** (named after your field) under **Stores entries in**. Pick a databag type there again to go back to inputs of your own.

## Form options

Select the form to see its options:

| Option | What it does |
| --- | --- |
| **Fields it asks for** | Tick the fields the form shows. Required fields, marked with `*`, always stay |
| **Generate fields** | Builds the inputs again from the databag type, for example after you added a field |
| **Thank-you message** | What visitors see after sending, per language |
| **After sending, go to** | **Stay on the page** and show the message, or **Pick a page** to send visitors to, like a "Thank you" page |
| **Ask for consent before sending** | Adds a checkbox visitors must tick, with your **Consent text**, for example about your privacy policy |

Select a single input to choose which field it **Fills**, and for text fields how it **Asks for it as**: **One line**, **Several lines** or **E-mail address**. **Hide this input** removes an optional field from the form. Inputs can be moved and styled like any other element.

A box called **Check this form** lists anything that would stop the form from working.

## What visitors get

The form works with and without JavaScript. Visitors fill it in, click the button and see your thank-you message, or are taken to the page you picked. If something is missing, they see what to fix.

Manablox keeps spam bots out without a puzzle to solve: forms carry an invisible trap field, reject entries sent faster than a person could type them, and allow only a few entries per visitor in a short time.

Each entry becomes a record of the databag type, created by "Site form". Workflows with the trigger for a created document of that type run for every entry.

## Switch forms on

Forms need a shared secret on both the CMS and the site process, so the site can hand the entries to the CMS. A project made with `manablox create` has one already: `SITE_FORMS_SECRET` in `.env` was filled in for you, and forms work as soon as the site process runs.

When the checks in the designer say "This installation does not accept form submissions yet":

1. Create a random secret, for example with `openssl rand -hex 32`.
2. In the `.env` file, set it and the address the site process reaches the CMS at:

```sh
SITE_FORMS_SECRET=paste-the-secret-here
SITE_FORMS_API_URL=http://localhost:3000
```

Use `http://localhost:3000` in a project on your computer (the address of `pnpm dev`) and `http://api:3000` in a docker project.

3. Make sure both processes hand them to the website plugin. For the CMS, that is `manablox.plugins.ts`, in the `plugins` list:

```ts
websitePlugin({
  url: envOptional('SITE_URL'),
  forms: { secret: envOptional('SITE_FORMS_SECRET') },
}),
```

For the site process, that is `manablox.site.config.ts`, in its `plugins` list:

```ts
websitePlugin({
  forms: { apiUrl: envOptional('SITE_FORMS_API_URL'), secret: envOptional('SITE_FORMS_SECRET') },
}),
```

A project made with `manablox create` already has both lines.

4. Restart the CMS and the site process.

The secret must be at least 16 characters long. Keep it out of version control, like every other secret in `.env`.
