---
title: "Key ideas"
description: "The words this guide uses, in plain language, each with an everyday example: instance, space, content type, block, document, locale, permalink, publishing, preview, menu, asset, roles, API keys, workflows, webhooks and plugins."
---

Read this page once. Every other page uses these words and assumes you know roughly what they mean. Each idea comes with an example from an imaginary bakery, "Sunny Bakes", that wants a website with pages, a blog and a list of cakes.

## Instance

An **instance** is one installed, running Manablox: its database, the CMS server and the admin. When you run `manablox create`, you get the files for one instance. It holds all your spaces, all user accounts and all API keys.

Example: Sunny Bakes runs one instance on its server. Everything the bakery ever writes lives in it.

## Management API and public API

An API is a web address that programs, not people, ask for data. Manablox has two:

- The **management API** is what the admin talks to. It can read and change everything, including unfinished drafts, so it always asks who you are: a login, or an API key.
- The **public API** only hands out **published** content of **one** space, and only reads, never writes. Anybody may ask it, so this is the one a website uses.

In a project made with `manablox create` for your own computer, the admin and the management API run together at `http://localhost:3000`, and the public API runs at `http://localhost:3100`.

Example: the bakery's staff use the admin, which uses the management API. The bakery's website asks the public API for the "About us" page. It never sees the half-written Christmas page.

## Space

A **space** is one website or channel, with everything that belongs to it: its pages, its languages, its images, its menus and the people who may work on it. Almost everything in the admin happens "inside a space". You switch between spaces at the top of the admin's sidebar.

A space has a **name** you can change, a **technical name** that is fixed once the space exists (it is used in code and addresses), and a **frontend URL**: the address of the website that shows it.

Example: Sunny Bakes has one space, "Website". If it later starts an app with different content, that could be a second space.

## Content type

A **content type** is a template for a kind of content. It lists what every piece of that kind consists of. You build content types in the admin, or developers write them in code; both work the same way.

There are two kinds:

- A **document type** (the admin sometimes just says content type) describes things that stand on their own: a page, a blog post, a cake. They sit in the content tree and usually have their own web address.
- A **block type** describes a small, reusable building piece that only ever lives inside a document: a teaser, a photo gallery, a quote. Editors stack blocks to build a page section by section.

Example: the bakery has a "Page" type, a "Blog post" type and a "Cake" type, plus a "Teaser" block that shows a headline, a short text and a picture.

## Field

A **field** is one slot in a content type: "Title", "Summary", "Price", "Photo". Each field has a **field type** that decides what goes in it and how the admin shows it: text, rich text (formatted text with headings and links), a number, a date, a yes/no switch, a choice from a list, an image, a link to another document, or a list of blocks. See [Field types](./content-model/field-types.md).

Every field has a **label** (what editors see) and a **technical name** (what the website's code uses). The technical name is fixed once the type is saved, because websites depend on it.

Example: the "Cake" type has the fields Name, Description (rich text), Price (number) and Photo (asset).

## Document and the tree

A **document** is one actual piece of content of some type: the "About us" page, the blog post "Our new sourdough", the cake "Lemon drizzle". It has a title, usually a slug (see below), and a value in each field.

Documents are arranged in a **tree**, like folders on your computer. A document can have a parent and children, and the order among siblings is kept. The tree is what you see on the left of the admin's Content page.

Example: "Team" sits under "About us", and "Our new sourdough" sits under "Blog".

## Locale

A **locale** is a language (and sometimes a region) the space writes content in, with a short code such as `en` or `de`. Each space lists its locales and picks a default. A document exists once per locale, and its translations are linked so editors can move between them. See [Languages and translations](./content-model/localisation.md).

Example: the bakery writes in English (`en`) and German (`de`). The "About us" page has an English and a German version.

## Slug and permalink

A **slug** is the last part of a web address, belonging to one document: `team`. The **permalink** is the whole path, built from the slugs of the document and everything above it in the tree: `about-us/team`. A website turns the address a visitor typed into a document by asking the public API for that permalink.

A space can also mark one document as its **home page**, which is what the website shows at `/`.

Example: the bakery's team page is found at `https://sunnybakes.example/about-us/team` because its permalink is `about-us/team`.

## Draft, published and version

When you edit a document and save, you change its **draft**. Visitors do not see drafts. When you **publish**, the current draft becomes the **published** version, which is what the public API hands to the website. You can unpublish again, and you can schedule a publish for later.

Every save also keeps a **version** in the document's history, so you can look at an older state and restore it. See [Drafts, publishing and versions](./content-model/publishing.md).

Example: an editor drafts the Christmas opening hours in November, saves several times, and publishes on December 1st.

## Preview

**Preview** means looking at content that is not published yet, the way it will look on the real website. The **visual editor** in the admin goes one step further: it shows your website next to the form and updates it on every keystroke, before you even save. See [Preview and the visual editor](./website/preview.md).

Example: before publishing the Christmas page, the editor checks in the visual editor that the new photo does not squash the headline.

## Designed site

A **designed site** is a website Manablox shows for you, designed in the admin instead of built as code: a theme with colors and fonts, a design for each block and page type, a header and footer. A space is either a designed site or feeds a website of your own. See [A website without code](./design/index.md).

Example: the bakery has no developer, so it switches its space to a designed site, picks the Editorial theme and adds its domain.

## Menu

A **menu** is a named navigation list, such as `main` for the top bar or `footer` for the bottom of the page. You build it in the admin from documents and plain links, and you can nest entries. The tree says where a document lives; a menu says where it is linked from. See [Menus](./admin/menus.md).

Example: the bakery's `main` menu links to Home, Cakes, Blog and About us, but not to the imprint, which only appears in `footer`.

## Tag

A **tag** is a label you put on a document or an asset by typing it: no setting up first. Tags belong to the space, so the same label can gather pages, articles and photos, and a tag sits on the document rather than on one translation. You use them to find things again in the admin, and the website can ask for everything carrying a tag. See [Tags](./admin/tags.md).

Example: the bakery tags three articles and two photos with `christmas`, and the website builds a Christmas page from them.

## Asset

An **asset** is an uploaded file: a photo, a PDF, a video. Each space has its own library of assets. Images are delivered in ready-made sizes (for example `thumb`, `card` and `hero`), and editors can set a crop and a focal point so the important part of the picture is never cut off. See [Images and files](./admin/assets.md).

Example: the photo of the lemon drizzle cake is uploaded once and used on the cake page and in a teaser on the home page.

## User, member and role

A **user** is a person's account on the instance, with an email and a password. A user becomes a **member** of a space with a **role**, and the role decides what they may do there. The built-in roles are owner, admin, editor, author and viewer, and a space can define its own. A **superadmin** may do everything on the whole instance; the very first account is one. See [Users and roles](./admin/users-and-roles.md).

Example: the bakery owner is superadmin, the marketing person is an editor who may publish, and a student helper is an author whose drafts someone else publishes.

## API key

An **API key** is a long secret password for programs instead of people. A program sends it with each request to the management API, and it may then do what the person who created it may do, optionally limited to some spaces and some permissions. Websites that only read published content do not need one. See [API keys](./admin/api-keys.md).

Example: a script that imports the cake list from the shop's spreadsheet every night uses an API key.

## Workflow

A **workflow** is something the CMS does on its own, when content changes, on a schedule or when another system calls it: send an email, ask an AI model, create a document, notify someone. You build it in the admin as a small diagram of steps. See [Workflows](./admin/workflows.md).

Example: whenever a blog post is published, a workflow emails the bakery owner a link to it.

## Webhook

A **webhook** is a web address that one system calls to tell another that something happened. Manablox has both directions: an **outgoing** webhook calls another system when content changes, and an **incoming** webhook is an address other systems call to start a workflow. See [Webhooks](./admin/webhooks.md).

Example: an outgoing webhook tells the hosting service to rebuild the website whenever a page is published.

## Plugin

A **plugin** is a package that adds abilities to Manablox: new field types, ready-made content types, new workflow steps, extra screens in the admin, or code that runs at certain moments (called hooks). The built-in field types themselves come as a plugin, and so do the website designer, AI, workflows and webhooks: you pick those when you create a project, or add them later with `manablox plugin install`. See [Plugins](./extending/plugins.md).

Example: a developer writes a small plugin with an "Opening hours" field type, so editors can pick days and times instead of typing them.
