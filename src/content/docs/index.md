---
title: "Welcome to Manablox"
description: "What Manablox is, who this guide is for, and where to start as a developer or as an editor."
---

Manablox is a content management system (CMS): a place where you write and organise the text, images and pages of a website, and from where the website reads them. You run it yourself, on your own computer while you learn and on a server when you go live.

Manablox is a **headless** CMS. That means it does not draw the website for you. It keeps your content tidy and hands it out over an API (a web address that programs can ask for data), and a separate website shows it. The upside: the same content can feed a website, an app or a newsletter, and the website can be built with whatever tools you like.

## What you get

- **An admin in the browser.** Editors log in, write pages, upload images, build menus and publish. No code needed.
- **A content model you design.** You decide what a "Page", a "Blog post" or a "Product" consists of: a title, a summary, an image, a list of sections.
- **Drafts and publishing.** Changes stay private until someone presses Publish, and every save is kept as a version you can go back to.
- **Languages.** Each space can hold content in several languages side by side.
- **An API for your website.** A read-only public API serves the published content, over REST and GraphQL, with a small JavaScript SDK on top.
- **A starter website.** One command writes a working website that already shows your content.
- **Automation.** Workflows, webhooks and plugins for when you want the CMS to do things on its own.

## Who this guide is for

This guide has two kinds of readers in mind. Neither needs to have used a CMS before.

| You are... | You will... |
| --- | --- |
| A developer, maybe new to servers, Docker or databases | Install Manablox, design the content model, build a website for it and put it online |
| An editor, marketing person or content writer | Use the admin in your browser to write, organise and publish content |

Pages for editors never ask you to open a terminal. Pages for developers explain every command before they show it, and tell you what you should see afterwards.

## Where to start

### If you are a developer

1. Read [Key ideas](./concepts.md) once. It explains the words the rest of the guide uses.
2. Check [What you need](./getting-started/before-you-begin.md) and install the missing tools.
3. Follow [Getting started](./getting-started/index.md) from start to finish. It takes about an hour and ends with a page from your CMS on a real website.
4. Take [A tour of your project](./your-project/index.md) to learn what each file does.
5. When you are ready to share it with the world, read [Put it on a server](./going-live/index.md).

### If you are an editor

1. Read [Key ideas](./concepts.md). The sections on spaces, documents, drafts and assets matter most to you.
2. Ask your developer for the address of the admin and for an account. The first account is created by whoever installed Manablox; everyone else is invited.
3. Take [A tour](./admin/index.md) of the admin.
4. Learn [Editing content](./admin/editing-content.md) and [Images and files](./admin/assets.md).
5. Read [Drafts, publishing and versions](./content-model/publishing.md) so you know what your visitors can and cannot see.

## By task

| I want to... | Read |
| --- | --- |
| Install Manablox on my computer | [Create your CMS](./getting-started/create-your-cms.md) |
| Understand the words (space, block, permalink...) | [Key ideas](./concepts.md) |
| Write and publish a page | [Editing content](./admin/editing-content.md) |
| Upload images and files | [Images and files](./admin/assets.md) |
| Build the navigation of my site | [Menus](./admin/menus.md) |
| Translate content | [Languages and translations](./content-model/localisation.md) |
| Decide what a page consists of | [Building content types](./admin/content-types.md), [Field types](./content-model/field-types.md) |
| Invite a colleague | [Users and roles](./admin/users-and-roles.md), [Spaces and members](./admin/spaces.md) |
| Build a website for my content | [The starter website](./website/starter-website.md), [How a website gets content](./website/index.md) |
| Let editors see changes on the real site before publishing | [Preview and the visual editor](./website/preview.md) |
| Send emails from the CMS | [Sending email](./your-project/mail.md) |
| Let the CMS do things automatically | [Workflows](./admin/workflows.md), [Webhooks](./admin/webhooks.md) |
| Put my CMS on a server | [Put it on a server](./going-live/index.md) |
| Keep my data safe | [Backups](./going-live/backups.md), [Security checklist](./going-live/security.md) |
| Look up a command | [The manablox command](./help/cli.md) |
| Fix something that does not work | [Common problems](./help/troubleshooting.md) |

## More places

- The [developer documentation](https://dev.manablox.io) explains how Manablox itself is built: its packages, the plugin contract and the full API reference. Read it when you write plugins or want to change Manablox.
- The source code of the CMS is on [GitHub](https://github.com/manablox/manablox-cms). Report problems and ask for features there, under Issues.
- Licenses for the premium plugins are sold on the [license portal](https://licenses.manablox.io), see [Premium plugins and licenses](./your-project/premium-plugins.md).
