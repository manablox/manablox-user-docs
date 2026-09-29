---
title: "Sign in and create a space"
description: "Open the admin for the first time, create the administrator account and set up the first space for your website."
---

Your CMS is running, but it has no users and no content yet. The first time you open the admin, a short setup assistant asks for two things: the account that runs this CMS, and a first space for your content. This page walks through both.

Before you start, `pnpm dev` must be running in a terminal, as at the end of [Create your CMS](./create-your-cms.md).

## Open the admin

Open `http://localhost:3000` in your browser.

You should see a page with "Welcome to your instance." on one side and the heading "Create the administrator" on the other. The side panel lists the steps of the assistant: Administrator, First space, Site design and Ready. Site design only comes up when the space is a designed site.

If the browser says it cannot reach the page, check the terminal where `pnpm dev` runs. It must still be running and show no error. If you see a normal "Sign in" page instead, somebody already created the first account on this CMS; sign in with that account.

## Step 1: create the administrator

Fill in the form:

| Field | What to enter |
| --- | --- |
| Name | Your name. It is shown in the admin, for example in the history of a page |
| Email | Your email address. You sign in with it |
| Password | At least 12 characters. Pick a good one and store it in a password manager |

Click **Create account**.

This account is special: it becomes the **superadmin** of the CMS, which means it may do everything, in every space. It is also the only account that can be created this way. As soon as it exists, the setup assistant closes for good; everybody else gets an account from you later, under `Settings > Users`. See [Users and roles](../admin/users-and-roles.md).

:::caution
Anyone who opens a fresh CMS first can become its superadmin. That is harmless on your own computer, but on a server, create this account right after the first start.
:::

## Step 2: add your first space

A space is one website or channel, with its own pages, languages, images and menus (see [Key ideas](../concepts.md#space)). The assistant now shows the heading "Add your first space" and three choices:

| Choice | What it does |
| --- | --- |
| Create a space | Sets up a new space. This is the one you want |
| Import a space | Restores a space that was exported from another Manablox, see [Moving a space](../admin/transfer.md) |
| Skip for now | Goes straight to the admin; you can create a space later under `Settings > Spaces` |

Click **Create a space**. A form appears. Fill it in like this:

| Field | What to enter | Why |
| --- | --- | --- |
| Name | `Website` | The name you see in the admin. You can change it later |
| Technical name | Fills itself in as `website` | Used by code and in addresses. It cannot be changed later |
| Website | **Own frontend** | **Designed site** lets you design the website in the admin instead; see [Designing your website](../design/index.md). To follow this guide, pick **Own frontend** |
| Frontend URL | Leave `http://localhost:3005` | The address of the website that shows this space, used for the preview. `3005` is where the starter website runs in [Show it on a website](./first-website.md). You can change it later |
| Locales | Leave English | The languages you write content in. Type in the box to search for more |
| Default locale | Leave English | The language used when a translation is missing |
| Start with | **Empty space** | See below |

Under **Start with**, the assistant preselects **Preconfigured**. Change it to **Empty space** for this guide:

- **Empty space** creates a space with no content types, documents or menus. In the next step you build a simple content type yourself, which is the best way to understand how Manablox works.
- **Preconfigured** leads to one more page, **Website type**, where you pick a company website, a landing page, a portfolio, a blog, the basic setup, or the sections you want. Each creates content types, published example pages and a main menu. It is great for looking around, but every type already contains a "Page" type, so the next page of this guide would clash with it; see [Spaces](../admin/spaces.md#type-of-website) for what each one creates.

:::tip
Want both? Follow this guide with an empty space now, and later create a second space with the basic setup under `Settings > Spaces` to see a finished example. With two spaces, the public API needs to be told which one to serve: set `MANABLOX_SPACE` in your `.env` file to that space's technical name. See [The public API](../website/public-api.md).
:::

Click **Create space**. After a moment you should see a short confirmation and the heading "Your instance is ready".

Had you picked **Designed site**, the last button would read **Next: site design** and lead to one more step, "Choose how the site looks": a **Theme** for colors and fonts, and a **Site design** for the header, footer, menus, sections and page layouts (see [Spaces](../admin/spaces.md#site-design)). **Back** returns to the form with everything you entered.

## Step 3: go to the admin

Click **Go to the admin**. You are now signed in as the superadmin and see the dashboard of your new space.

Take a first look around:

- The **sidebar** on the left lists the areas of the admin: **Dashboard** at the top, then small headings that group the rest. **Content** holds Content, Templates, Databags, Assets and Menus; **Automation** holds Workflows and Webhooks; **Structure** holds Content types, Databag types and Design; **System** holds Activity and Settings.
- At the top of the sidebar is the **space switcher**. It shows "Website". When you have several spaces, you switch between them here.
- At the bottom of the sidebar is your account, with a button to sign out.

The full tour is in [A tour](../admin/index.md), but you do not need it for the next step.

## Changing the space later

Everything except the technical name can be changed. Go to `Settings > General`, edit the field and click **Save changes**. It always changes the space you are working in. More spaces are created under `Settings > Spaces` with the **New space** button. See [Spaces and members](../admin/spaces.md).

## Signing in next time

Next time you open `http://localhost:3000`, you see a "Sign in" page. Enter the email and password of the account you just created.

## Next step

Your space is empty. In [Your first page](./first-page.md) you tell it what a page consists of, then write and publish one.
