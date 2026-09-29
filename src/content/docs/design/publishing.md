---
title: "Publishing and preview links"
description: "Make design changes live one by one or all at once, go back to an earlier version, and share a preview link so others can look at drafts before visitors do."
---

Everything you change in the designers is a **draft**. Visitors keep seeing the published version until you publish. That way you can work on a new look for days without anyone noticing.

Publishing designs needs the permission **Publish designs**; editors, admins and owners have it.

## Publish

- **One design:** click **Publish** in the bar on top of the theme, block, page, layout or menu designer, or on the Site settings page. On the overview, each design under **Waiting to be published** has its own **Publish** button.
- **Everything at once:** on the overview (**Design** in the sidebar), click **Publish all** in the header. The number shows how many designs have changes. All of them go live together, so visitors never see half of a redesign. A developer can do the same from the project folder with `pnpm exec manablox website publish-all --space <name>`.

The box at the top of the overview tells you whether the site is published, where visitors reach it and when it was last published. Content is published as usual: publishing a page makes it appear on the site with the current designs.

## Throw away a draft

On the overview, click the undo icon (**Discard draft**) in a design's row, then **Discard draft**. The draft goes back to the published version; a design that was never published goes back to the automatic one.

To start a design over completely, open **Every design, with versions and resets** on the overview and click the reset icon (**Start over with the automatic design**). It removes the design including its versions, and the site shows the design built from the content type again.

## Versions

Every publish is kept as a version.

1. On the overview, open **Every design, with versions and resets** and click the clock icon (**Versions**) in a design's row.
2. The list shows each version with its date; the live one is marked **live**.
3. Click **Restore** on an older version, then **Restore to draft**.

Restoring puts the old version into the draft. Look it over and publish it to make it live again.

## Preview the whole site

**Preview drafts** in the overview's header opens the site with every draft design and every draft page applied. The link works for a day; you can send it to someone to look at the redesign before it goes live.

**Open site** opens the live site on its primary domain.

## Share a preview of one page

In the content editor of a designed space, **Share preview** in the header creates a link that shows the **saved draft** of this page on the real site. The person you send it to does not need an account.

1. Save the page.
2. Click **Share preview**.
3. Under **Link works for**, choose **1 hour**, **1 day**, **7 days** or **30 days**.
4. Click **Create link**, then **Copy**, and send the link.

Good to know:

- Unsaved changes are not in the preview. Save first.
- The link shows this page's draft with the draft designs; other pages look as they are published.
- Preview pages carry a small "Preview" badge and are hidden from search engines.
- Anyone who has the link can open it until it expires. Create a short-lived link for anything confidential.
