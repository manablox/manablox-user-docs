---
title: "A tour"
description: "Where everything is in the Manablox admin: the sidebar and its sections, the space switcher, the top bar with the language switch and notifications, and the habits every screen shares."
---

The **admin** is the part of Manablox you use in the browser to write content, upload images, build menus and manage who may do what. This page walks you around it once, so you know where to find things. The other pages in this section then explain each area in detail.

## Opening the admin

Open the admin's address in your browser. When the CMS runs on your own computer, that is `http://localhost:3000`. On a server, your team gives you the address, for example `https://cms.example.com`.

Sign in with your email and password on the **Sign in** page. If you do not have an account yet, ask an administrator to create one for you; see [Users and roles](./users-and-roles.md). The very first account of a new installation is created on a setup page instead; see [Sign in and create a space](../getting-started/first-sign-in.md).

## The layout

```
+----------------+----------------------------------------------------------+
| Manablox       | Website > Content > About     Language EN|DE   [?] bell  |
| [Website    v] +--------------+-------------------------------------------+
|                | Tree         |                                           |
| Dashboard      |  Home        |                                           |
| CONTENT        |  About       |       the page you are working on         |
| Content        |  Blog        |                                           |
| Templates      |              |                                           |
| ...            |              |                                           |
| SYSTEM         |              |                                           |
| Settings       |              |                                           |
| Anna Berger    |              |                                           |
+----------------+--------------+-------------------------------------------+
  sidebar          side panel     main area
```

The screen has three parts: the **sidebar** on the left, the **top bar** along the top, and the main area. Some sections add a **side panel** between the sidebar and the main area, for example the content tree.

## The sidebar

From top to bottom, the sidebar holds:

- **The Manablox logo.** Click it to go to the dashboard.
- **Collapse sidebar.** The small button next to the logo shrinks the sidebar to icons. Click it again (**Expand sidebar**) to bring the labels back.
- **The space switcher.** A dropdown with the name of the space you are working in. Pick another space here to switch. Everything below it in the sidebar belongs to the chosen space.
- **The sections.** **Dashboard** on its own, then the other sections in four groups with small headings: Content, Automation, Structure and System; see the table below.
- **You.** At the bottom: your initials, your name and your account type (`superadmin` for an administrator of the installation, `editor` for everyone else). Click them to open your profile; see [Your account](./your-account.md).
- **The theme button.** Switches between light, dark and your system's setting.
- **Sign out.** The button with the arrow at the very bottom right.

### The sections

What you see depends on your role in the current space. A section you may not use has no entry in the sidebar at all, and a group with no entries left is hidden too. When the sidebar is collapsed to icons, thin lines separate the groups.

| Group | Section | What it holds | Who sees it | More |
| --- | --- | --- | --- | --- |
| | Dashboard | The space at a glance: figures, recently updated documents, quick links | Everyone | This page |
| Content | Content | The content tree, search and the document editor | Everyone | [Editing content](./editing-content.md) |
| Content | Templates | Block lists written once and used in many documents | Everyone | [Editing content](./editing-content.md#templates) |
| Content | Databags | Flat lists of entries outside the content tree, such as contact requests from a form | Everyone | [Forms](../design/forms.md) |
| Content | Assets | The space's images and files | Everyone | [Images and files](./assets.md) |
| Content | Menus | Navigations such as "Main navigation" or "Footer" | Everyone | [Menus](./menus.md) |
| Automation | Workflows | Automations: emails, notifications, calls to other systems. Only with the workflows plugin | Owners, admins, editors | [Workflows](./workflows.md) |
| Automation | Webhooks | Messages to and from other systems. Only with the webhooks plugin | Owners, admins, editors | [Webhooks](./webhooks.md) |
| Structure | Content types | The builder for document and block types | Owners and admins | [Building content types](./content-types.md) |
| Structure | Databag types | The builder for the kinds of entries databags hold | Owners and admins | [Forms](../design/forms.md) |
| Structure | Redirects | Forwarding from old addresses to new ones | Everyone who may see redirects (viewers too) | [Redirects](./redirects.md) |
| Structure | Design | The look of a designed site: theme, blocks, pages and site settings. Only with the website plugin | Owners, admins, editors | [Designing your website](../design/index.md) |
| System | Activity | Who did what and when | Owners and admins | [Activity](./activity.md) |
| System | Settings | The current space's settings and members, plus spaces, users and API keys | Owners and admins | See below |

"Owners, admins, editors" means the built-in roles of that name. A role your team defined can open more or fewer sections; see [Users and roles](./users-and-roles.md). An administrator of the whole installation sees everything. Plugins can add further sections, each in one of the four groups.

### Settings

**Settings** lists its sections in the side panel, in two groups. On a small screen, the **Settings** button in the top bar opens that list.

**This space**, with the current space's name under the heading, holds the settings of the space you are working in (the one picked in the space switcher):

| Section | What it is for | More |
| --- | --- | --- |
| General | The space's name, address and languages, its uploads, and deleting it | [Spaces and members](./spaces.md) |
| Members | Who works in the space, with which role | [Spaces and members](./spaces.md#members) |
| Roles | What each role may do in the space | [Users and roles](./users-and-roles.md) |
| Tags | The space's tags: rename, merge or delete them | [Tags](./tags.md) |
| AI | The AI services the space can write text and make images with. Only with the AI plugin | [AI](./ai.md) |
| Credentials | Passwords and keys that workflows use to reach other systems | [Workflows](./workflows.md) |
| API hosts | The host names the public API answers on for this space, and the domains of a designed site. Only shown if your plan includes custom domains | [Domains](../design/domains.md) |
| Environments | Staging copies of the space and promoting them to production. Only shown if your plan includes environments | [Environments](./environments.md) |
| Export and transfer | Download the space as a file. Only shown if you may export the space | [Moving a space](./transfer.md) |
| Backups | Snapshots of the space: take one, download it, bring the space back. Only shown if you may export the space and your plan includes backups | [Backups](./backups.md) |
| Usage | What the space used this period against its limits. Only shown if you may change the space's settings | [Usage](./usage.md) |

**Instance**, "Shared by every space", holds what belongs to the whole installation:

| Section | What it is for | More |
| --- | --- | --- |
| Spaces | Every space you can reach; click one to work in it. Administrators create and import spaces here | [Spaces and members](./spaces.md) |
| Users | All accounts of the installation and open invitations. Only administrators see this section | [Users and roles](./users-and-roles.md), [Invitations](./invitations.md) |
| Security | Who must use two-factor authentication, and the single sign-on providers. Only administrators see this section | [Two-factor authentication](./two-factor.md), [Single sign-on](./single-sign-on.md) |
| API keys | Keys that let programs read or change content in your name | [API keys](./api-keys.md) |
| Usage | What the whole installation and every space used this period. Only administrators see this section | [Usage](./usage.md) |
| Licenses | The license keys of the premium plugins (website and AI). Only with a premium plugin, and only administrators see this section | [Premium plugins and licenses](../your-project/premium-plugins.md) |

To look at another space's settings, switch to that space first, with the space switcher or in **Settings > Spaces**.

## The top bar

From left to right:

- **Where you are.** The space's name, the section, and the document or item you have open, for example `Website > Content > About`. Click the section name to go back to its start page.
- **Language.** When the space has more than one language, a switch such as `EN | DE` chooses the language you work in. The tree, the lists and the editor follow it. See [Languages and translations](../content-model/localisation.md).
- **Keyboard shortcuts.** The button with the keyboard icon lists every key that works on the current page. Pressing `?` does the same. See [Keyboard shortcuts](./keyboard.md).
- **Notifications.** The bell shows how many unread notifications you have, for example a document waiting for your approval. See [Notifications and approvals](./notifications.md).
- **Visit site.** Opens the space's website in a new tab. It only appears when the space has a frontend URL; see [Spaces and members](./spaces.md).

A thin moving bar at the very top of the top bar means the admin is loading or saving something.

## The side panel

Content, Templates, Menus, Workflows, Content types and Settings show a list next to the page: the content tree, the templates, the menus, the workflows, the types, the sections of the settings. It stays in place while you open items from it.

- Drag the panel's right edge to make it wider or narrower. The admin remembers the width.
- Hide it with the **Hide** button at its top (for example **Hide tree**), or press `]`. A hidden panel leaves a narrow strip; click **Show** on it, or press `]` again, to bring the panel back.

## The dashboard

The dashboard is the first page after signing in. It shows:

- a greeting and the space's name, technical name and website address,
- five figures: **Documents**, **Content types**, **Block types**, **Databags** and **Languages**, each a link to its section,
- **Waiting for your approval**, when documents wait for you to approve them,
- **Recently updated**: the latest changed documents in the current language, each with its status,
- **Start something**: quick links such as **New document**, **Define a content type**, **Upload assets** and **Edit the navigation**, depending on what you may do,
- the space's **Language** or **Languages**, with a switch when there are several.

If you are not a member of any space yet, you see "Ask an administrator to add you to a space." instead.

## On a small screen

On a phone or a narrow window, the sidebar is hidden. Tap the menu button at the top left of the top bar to open it. On pages with a side panel, a second button next to it (for example **Tree**) opens the panel. Tap outside, or press `Esc`, to close either one.

## Habits every screen shares

- **Technical names fill themselves in.** Spaces, content types, fields and roles have a label and a technical name. The technical name follows the label as you type (spaces become hyphens, capitals become lower case) until you type one yourself. Once saved, it is locked, because websites and programs depend on it.
- **Unsaved work is marked.** An editor with unsaved changes shows an **unsaved** badge, and the **Save** button is only active when there is something to save.
- **Risky actions ask first.** Deleting asks for confirmation in a dialog that says what will happen. Deleting a space or an account also asks you to type its name or email.
- **Messages appear briefly** in a corner of the screen, for example `Published "About"` or an error that explains what went wrong. A field with a problem is marked in red with the reason under it.
- **The keyboard works everywhere.** `Ctrl+S` (`Cmd+S` on a Mac) saves in every editor, and `g` followed by a letter jumps to a section. See [Keyboard shortcuts](./keyboard.md).
