---
title: "Environments"
description: "Try changes in a staging copy of your space, see what would change, and move them to your live site when they are ready."
---

An environment is a separate copy of a space. Every space has one called **production**: that is your live space, the one your website and apps show. You can add more, usually one called **staging**, to try out changes without touching what your visitors see.

## What you can do with one

- Build a new content type, a new menu or a new site design in staging, and look at it on its own staging address.
- Rework content in staging and move it all to your live site at once.
- Try out a workflow or webhook in staging first; copies start switched off, so nothing is sent until you switch them on there.

The members of the space, your images and files, tags and the space settings are shared by all environments. An image uploaded in staging is also in production, and the other way around.

## Who can manage them

| What | Who |
| --- | --- |
| Working in any environment of a space | Everyone who is a member of the space, with the rights their role gives them |
| Creating, promoting and deleting environments | Space owners and admins, and roles that are given the **Manage environments** permission |

If your hosting plan does not include environments, only production is available. Your plan also decides how many staging environments one space may have; production does not count.

## Switching between environments

Once a space has a staging environment, a second picker appears under the space picker in the sidebar. Choose an environment there to work in it. While you are not in production, a yellow bar across the top of the admin names the environment you are in, with links to promote it or to go back to production.

Everything you do in the admin then happens in that environment: the content tree, content types, menus, the site design, workflows, webhooks, domains and API addresses are those of the environment. The address in your browser ends in `?env=staging` (the technical name of the environment), so you can bookmark it or send it to a colleague. Switching to another space always takes you back to production.

**Visit site** in the top bar opens the environment's own domain. Without a domain of its own, a staging environment has no **Visit site** button; preview and share links still work.

## Where to manage them

Go to **Settings** and open **Environments**. Everyone in the space sees the list with each environment's name, technical name, where it was copied from and when it was created. Space owners and admins also see **New environment**, and **Promote** and **Delete** next to each staging environment.

## Creating a staging environment

Click **New environment**, give it a name (the technical name is filled in for you) and pick the environment to copy, usually production. You choose what is copied:

| Choice | What the copy holds |
| --- | --- |
| **Config only** | Content types, templates, menus (without their entries), workflows, webhooks, site designs and simple redirects. No documents |
| **Config and content** | All of the above, plus every document, published or not, the menu entries and all redirects |

Domains and API addresses are not copied: a staging environment gets its own, so it never answers on your live address. Staging sites are always hidden from search engines.

## Checking what would change

Click **Promote** next to the staging environment and choose what to promote. Before anything happens, you see a list of everything that would change in production: which content types, fields, templates, menus, redirects, designs, workflows and (with content) documents are new, changed or removed. For each changed or removed field it tells you how many live documents hold a value for it.

## Promoting to production

Promoting moves staging into your live space. Again you choose:

| Choice | What happens in production |
| --- | --- |
| **Config only** | Content types, templates, menus, simple redirects, site designs and workflows are replaced by the staging ones. Your live documents stay exactly as they are |
| **Config and content** | The same, and all live documents, menu entries and redirects are replaced by the staging ones |

Some things never change on a promote: your live domains and API addresses, and whether each live workflow is switched on or off. Webhooks stay as they are in production. When a field is removed, the values live documents hold for it are kept, just no longer shown. With content, a live document that staging did not change keeps its approval requests; a document that staging changed or removed loses them.

If a config promote removes or changes the type of a field your live documents use, or you promote content, you are asked to confirm first by typing the technical name of the environment. If your plan includes backups, a snapshot of the space is taken right before the promote, so you can go back under [Backups](./backups.md).

The promote runs in steps (content types, templates or documents, menus, redirects, designs, workflows). If one step fails, that step is undone, the later steps are not run, and you see which step failed. Promoting again finishes the rest.

While a promote runs, production cannot be changed. Anyone saving in production in that moment sees a message that a promote is running and can save again once it is done. Reading and your live site keep working.

## Deleting a staging environment

Click **Delete** next to it and type its technical name to confirm. Deleting removes the environment with everything in it: its documents, content types, menus, workflows, designs, domains and API addresses. Your images and files are not deleted, because they are shared. Production can never be deleted.

Creating, promoting and deleting are recorded in the [activity log](./activity.md).
