---
title: "Password-protected sites"
description: "Keep a whole designed site behind one password: set, change and remove it, what visitors see, and what the password does not protect."
---

A designed site can ask every visitor for a password before it shows any page. That is handy while the site is not ready yet, for a site only your team or your members should see, or for a draft you show a customer. Each space has one password, shared by everyone you give it to.

## Set a password

1. Click **Settings** in the sidebar, then **General**.
2. Open **Site password**.
3. Type the password twice (at least 8 characters) and click **Set password**.

The site asks for it right away. You need a role that may change the space's settings, such as owner or admin.

To pick a new one, type it twice and click **Change password**. Everyone who entered the old password has to enter the new one.

To open the site again, click **Remove password** and confirm.

## What visitors see

Every address of the site shows a plain page titled "Password required" with one field. After the right password the visitor lands on the page they asked for, and the browser remembers it for 30 days. After too many wrong tries from one place, the page asks them to wait a few minutes.

Preview links you [share](./publishing.md) still work without the password, so you can still show drafts.

## Search engines

A protected site asks search engines to stay away: its `robots.txt` blocks everything, it has no sitemap, and every page is marked "do not index". Pages that were listed before drop out over time. After you remove the password, the site's own setting under **Search and sharing** applies again.

## What the password does not protect

The password guards the pages of the site. Images and files you uploaded keep their own address, so anyone who already has a file's address can still open it. Do not rely on the password for files that must stay secret.

## When the section is locked

If password protection is not available on your instance, the section shows a lock. A password that is already set stays in place and the site stays protected; it just cannot be changed or removed until the feature is available again.
