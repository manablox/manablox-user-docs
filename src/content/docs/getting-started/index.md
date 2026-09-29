---
title: "Getting started"
description: "Five short steps from an empty computer to a page from your own CMS on a real website."
---

This section takes you from nothing to a working setup: your own Manablox CMS on your computer, a first page written and published in the admin, and a small website that shows it. Plan about an hour, most of it waiting for downloads the first time.

You will use a terminal (the text window where you type commands) for some steps and your browser for others. Every command is explained before you run it.

## The steps

1. [What you need](./before-you-begin.md): install Node.js, pnpm and Docker, and check that they work.
2. [Create your CMS](./create-your-cms.md): one command writes a complete project; then you start it.
3. [Sign in and create a space](./first-sign-in.md): create the first account in the admin and a space for your website.
4. [Your first page](./first-page.md): design a simple "Page" type, write a page and publish it.
5. [Show it on a website](./first-website.md): let a second command write a starter website and see your page in it.

## What you will have at the end

| What | Where |
| --- | --- |
| The admin, where you write content | `http://localhost:3000` |
| The management API, used by the admin | `http://localhost:3000` (same address) |
| The public API, which your website reads from | `http://localhost:3100` |
| Your starter website | `http://localhost:3005` (Astro, the default) |
| A test inbox that catches the emails the CMS sends | `http://localhost:8025` |

`localhost` means "this computer". These addresses only work on your own machine, which is exactly what you want while learning. Putting the CMS on a server comes later, in [Put it on a server](../going-live/index.md).

:::tip
If a word such as space, content type or permalink is new to you, keep [Key ideas](../concepts.md) open in a second tab.
:::

## Stuck?

Every step says what you should see. If you see something else, the step usually tells you what to try. If it does not, look at [Common problems](../help/troubleshooting.md).
